import { User } from '../../models/index.js'
import { encryptPassword } from "../../utils/encrypt.js";

export async function getUserByName(username) {
  const user = await User.findOne({ username });
  return user;
};

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

export async function createUser(user) {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^[a-zA-Z0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!user.username.match(usernameRegex)) {
    throw { message: 'username only contains letters and numbers', status: 400 };
  }
  if (!user.password.match(passwordRegex)) {
    throw { message: 'password only contains letters and numbers', status: 400 };
  }
  if (!user.email.match(emailRegex)) {
    throw { message: 'email must be "prueba@prueba.com"', status: 400 };
  }
  const requiredFields = ['username', 'password', 'name', 'email', 'address', 'cp', 'city', 'date'];
  for (const field of requiredFields) {
    if (!user[field]) {
      throw { message: `Field '${field}' is required`, status: 400 };
    }
  }
  user.password = await encryptPassword(user.password);
  const userDoc = new User(user);
  const createUser = await userDoc.save();
  return createUser;
}


export async function deleteUser(params){
  const deleteUser = await User.findByIdAndDelete(params.id);
  if(!deleteUser) throw HttpStatusError(404, `User not found`);
  return deleteUser;
}

export async function updateUser(params){
  //TO DO
  await User.findByIdAndUpdate(params.id);
}
