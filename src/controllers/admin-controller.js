import { getUsers, getUser, createUserAsAdmin, updateUserAsAdmin, deleteUserAsAdmin,
getAllHistoricalShoppings, getUserHistoricalShopping } from "../services/admin/admin-service.js";

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

export async function createUserAsAdminController(req, res, next) {
  try {
    const body = req.body;
    const user = await createUserAsAdmin(body);
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

export async function updateUserAsAdminController(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedUser = await updateUserAsAdmin(id, body);
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserAsAdminController(req, res, next) {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserAsAdmin(id);
    res.status(200).send(deletedUser);
  } catch(error){
    next(error);
  }
}

export async function historicalShoppingsController(req, res, next) {
  try {
    const purchases = await getAllHistoricalShoppings();
    res.status(200).send(purchases);
  } catch (error) {
    next(error);
  }
}

export async function userHistoricalShoppingsController(req, res, next) {
  try {
    const { id } = req.params;
    const purchases = await getUserHistoricalShopping(id);
    res.status(200).send(purchases);
  } catch (error){
    next(error);
  }
}
