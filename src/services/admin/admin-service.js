import { User } from '../../models/index.js'
import { encryptPassword } from "../../utils/encrypt.js";
import { HttpStatusError } from 'common-errors';

export async function createUserAsAdmin(user) {
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

export async function updateUserAsAdmin(id, body){
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

export async function deleteUserAsAdmin(id) {
  const deletedUser = await User.findByIdAndDelete(id);
  if(!deletedUser) throw HttpStatusError(404, `User not found`);
  return deletedUser;
}
