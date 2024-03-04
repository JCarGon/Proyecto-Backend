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
  const usernameRegex = /^[a-zA-Z0-9]{5,20}$/;
  const passwordRegex = /^[a-zA-Z0-9]{6,20}$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i;
  const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]{6,20}$/;
  const addressRegex = /^c\/\s.+,\s\d+$/;
  const cpRegex = /^\d{5}$/;
  const cityRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]{4,20}$/;
  const tlfRegex = /^\d{9}$/;

  if (!user.username.match(usernameRegex)) {
    throw HttpStatusError(400, `Username must be between 5 and 20 alphanumeric characters`);
  }
  if (!user.password.match(passwordRegex)) {
    throw HttpStatusError(400, `Password must be between 6 and 20 alphanumeric characters`);
  }
  if (!user.email.match(emailRegex)) {
    throw HttpStatusError(400, `Email format must be "correo@correo.com"`);
  }
  if (!user.name.match(nameRegex)) {
    throw HttpStatusError(400, `Name must be between 6 and 20 alphabetic characters`);
  }
  if (user.address && !user.address.match(addressRegex)) {
    throw HttpStatusError(400, `Address must follow the format "c/ ..., number"`);
  }
  if (!user.cp.match(cpRegex)) {
    throw HttpStatusError(400, `Postal code must contain exactly 5 digits`);
  }
  if (!user.city.match(cityRegex)) {
    throw HttpStatusError(400, `City must be between 4 and 20 alphabetic characters`);
  }
  if (!user.tlf.match(tlfRegex)) {
    throw HttpStatusError(400, `Phone number must contain exactly 9 digits`);
  }
  const requiredFields = ['username', 'password', 'name', 'email', 'address', 'cp', 'city', 'tlf'];
  for (const field of requiredFields) {
    if (!user[field]) {
      throw { message: `Field '${field}' is required`, status: 400 };
    }
  }
  const exists = await User.findOne({ $or: [{ username: user.username }, { email: user.email }] });
  if (exists) throw { message: 'Username or email already exists', status: 409 };
  user.password = await encryptPassword(user.password);
  const userDoc = new User(user);
  const createdUser = await userDoc.save();
  return createdUser;
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

export async function confirmOrder(id, address) {
  const discount = 0.8;
  const user = await getUserById(id);
  const purchase = {
    userId: id,
    shippingAddress: address,
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
      figureName: figure.name,
      price: (figure.price*discount)
    };
    purchase.products.push(object);
    purchase.totalPrice = Number(purchase.totalPrice + (figure.price * discount)).toFixed(2);
  }
  const purchaseDoc = new HistoricalShopping(purchase);
  await purchaseDoc.save();
  user.favouritesFigures = [];
  await user.save();
  return user;
}
