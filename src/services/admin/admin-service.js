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
  const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]{4,20}$/;
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
    throw HttpStatusError(400, `Name must be between 4 and 20 alphabetic characters`);
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

  if (body.username) {
    const exists = await User.findOne({ username: body.username });
    if (exists) throw HttpStatusError(409, 'Username already exists');
  }

  const usernameRegex = /^[a-zA-Z0-9]{5,20}$/;
  const passwordRegex = /^[a-zA-Z0-9]{6,20}$/;
  const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]{6,20}$/;
  const addressRegex = /^c\/\s.+,\s\d+$/;
  const cpRegex = /^\d{5}$/;
  const cityRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]{4,20}$/;
  const tlfRegex = /^\d{9}$/;

  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      let value = body[key];
      switch (key) {
        case 'username':
          if (!usernameRegex.test(value)) throw HttpStatusError(400, `Username must be between 5 and 20 alphanumeric characters`);
          break;
        case 'password':
          if (!passwordRegex.test(value)) throw HttpStatusError(400, `Password must be between 6 and 20 alphanumeric characters`);
          value = await encryptPassword(user.password);
          break;
        case 'email':
          throw HttpStatusError(400, `Email can't be modify`);
        case 'name':
          if (!nameRegex.test(value)) throw HttpStatusError(400, `Name must be between 6 and 20 alphabetic characters`);
          break;
        case 'address':
          if (!addressRegex.test(value)) throw HttpStatusError(400, `Address must follow the format "c/ ..., number"`);
          break;
        case 'cp':
          if (!cpRegex.test(value)) throw HttpStatusError(400, `Postal code must contain exactly 5 digits`);
          break;
        case 'city':
          if (!cityRegex.test(value)) throw HttpStatusError(400, `City must be between 4 and 20 alphabetic characters`);
          break;
        case 'tlf':
          if (!tlfRegex.test(value)) throw HttpStatusError(400, `Phone number must contain exactly 9 digits`);
          break;
      }
      user[key] = value;
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
