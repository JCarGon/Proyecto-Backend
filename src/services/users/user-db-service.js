import { User } from '../../models/index.js'
import { HistoricalShopping } from '../../models/index.js';
import { encryptPassword } from "../../utils/encrypt.js";
import { HttpStatusError } from 'common-errors';
import { getFigure } from '../figures/figures-service.js';

export async function getUserById(id) {
  const user = await User.findById(id).populate('favouritesFigures', 'name price principalImage');
  return user;
};

export async function getUserByEmail(email) {
  const user = await User.findOne({ email });
  return user;
};

export async function createUser(user) {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^[a-zA-Z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!user.username.match(usernameRegex)) {
    throw { message: 'Username only contains letters and numbers', status: 400 };
  }
  if (!user.password.match(passwordRegex)) {
    throw { message: 'Password only contains letters and numbers', status: 400 };
  }
  if (!user.email.match(emailRegex)) {
    throw { message: 'Email must be "prueba@prueba.com"', status: 400 };
  }
  const requiredFields = ['username', 'password', 'name', 'email', 'address', 'cp', 'city', 'tlf'];
  for (const field of requiredFields) {
    if (!user[field]) {
      throw { message: `Field '${field}' is required`, status: 400 };
    }
  }
  const exists = await User.findOne({ $or: [{ username: user.username }, { email: user.email }] });
  if (exists) throw { message: 'Username or email already exists', status: 400 };
  user.password = await encryptPassword(user.password);
  user.rol = 'user';
  const userDoc = new User(user);
  const createUser = await userDoc.save();
  return createUser;
}

export async function deleteMe(id){
  const deletedUser = await User.findByIdAndDelete(id);
  if(!deletedUser) throw HttpStatusError(404, `User not found`);
  return deletedUser;
}

export async function updateMe(id, body){
  const user = await User.findOne({ _id: id });

  if (!user) throw HttpStatusError(404, `User not found`);
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      user[key] = body[key];
    }
  }
  const updatedUser = await user.save();
  return updatedUser;
}

export async function deleteToken(headers){
  headers.authorization = '';
  const msg = {
    msg: 'Log out'
  }
  return(msg);
}

export async function addFigureToCart(userId, figureId) {
  const user = await User.findOne({ _id: userId });
  if (!user) throw HttpStatusError(404, `User not found`);
  if(user.favouritesFigures.includes(figureId)) throw HttpStatusError(409, 'Figure already exists');
  const figure = await getFigure(figureId);
  if(figure.amount === 0) throw HttpStatusError(400, 'There is no stock');
  user.favouritesFigures.push(figureId);
  const updatedUser = await user.save();
  return updatedUser;
}

export async function deleteFigureFromCart(userId, figureId) {
  const user = await User.findOne({ _id: userId });
  if (!user) throw HttpStatusError(404, `User not found`);
  if(!user.favouritesFigures.includes(figureId)) throw HttpStatusError(404, 'Figure not exists');
  const index = user.favouritesFigures.indexOf(figureId);
  user.favouritesFigures.splice(index, 1);
  const userUpdated = await user.save();
  return userUpdated;
}

export async function confirmOrder(id) {
  const user = await getUserById(id);
  const purchase = {
    userId: id,
    products: [],
    totalPrice: 0
  }
  const figures = user.favouritesFigures;
  for(let i=0; i<figures.length; i++) {
    const figure = await getFigure(figures[i].id);
    figure.amount = figure.amount-1;
    await figure.save();
    const object = {
      productId: figure._id,
      price: figure.price
    };
    purchase.products.push(object);
    purchase.totalPrice = purchase.totalPrice + figure.price;
  }
  const purchaseDoc = new HistoricalShopping(purchase);
  await purchaseDoc.save();
  user.favouritesFigures = [];
  await user.save();
  return user;
}
