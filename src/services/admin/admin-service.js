import { User } from '../../models/index.js'
import { encryptPassword } from "../../utils/encrypt.js";
import { HttpStatusError } from 'common-errors';

export async function getUsers(filters){
  const { name } = filters;
  const query = {
    username: name ? new RegExp(name, 'i'): undefined,
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

export async function createUserAsAdmin(user) {
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
