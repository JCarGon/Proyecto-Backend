import { User } from '../../models/index.js'
import { encryptPassword } from "../../utils/encrypt.js";
import { HttpStatusError } from 'common-errors';

export async function getUsers(filters){
  const { name } = filters;
  const query = {
    username: name ? new RegExp(name, 'i'): undefined,
    //expresión regular para buscar si algún nombre de usuario contiene el introducido en el filters
  };

  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(([_, a]) => a !== undefined)
  );
  const users = await User.find(cleanedQuery).select('-password -__v');

  return users;
}

export async function getUser(id) {
  const user = await User.findById(id);
  if(!user) throw HttpStatusError(404, `User not found`);
  return user;
}

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
  const userDoc = new User(user);
  const createUser = await userDoc.save();
  return createUser;
}

export async function deleteUser(id){
  const deletedUser = await User.findByIdAndDelete(id);
  if(!deletedUser) throw HttpStatusError(404, `User not found`);
  return deletedUser;
}

export async function updateUser(id, body){
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
