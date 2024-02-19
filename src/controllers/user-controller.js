import { getUsers, getUser, getUserByEmail, createUser, deleteUser, updateUser, deleteToken } from "../services/users/user-db-service.js";

export async function getUsersController(req, res, next) {
  try {
    const users = await getUsers(req.query);
    res.status(200).send(users);
  } catch (error){
    next(error);
  }
}

export async function getUserController(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    res.status(200).send(user);
  } catch (error){
    next(error);
  }
}

export async function getUserMe(req, res, next){
  try {
    const user = await getUserByEmail(req.user.email);
    return res.send(user);
  } catch (error) {
    next(error);
  }
}

export async function createUserController(req, res, next) {
  try {
    const body = { ...req.body, rol: 'user' };
    const user = await createUser(body);
    res.status(201).send(user);
  } catch (error){
    if(error.code = 11000){
      error.status = 409;
    }
    if(error.message.includes('validation')){
      error.status = 400;
    }
    next(error);
  }
}

export async function deleteUserController(req, res, next) {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUser(id);
    res.status(200).send(deletedUser);
  } catch(error){
    next(error);
  }
}

export async function updateUserController(req, res, next){
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedUser = await updateUser(id, body);
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteTokenController(req, res, next){
  try {
    const msg = await deleteToken(req.headers);
    return res.status(200).send(msg);
  } catch(error) {
    next(error);
  }
}
