import { getUserById, createUser, deleteMe, updateMe, deleteToken, addFigureToCart, deleteFigureFromCart, confirmOrder } from "../services/users/user-db-service.js";

export async function getUserMe(req, res, next){
  try {
    const id = req.user.id;
    const user = await getUserById(id);
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
    if(error.code === 11000){
      error.status = 409;
    }
    if(error.message.includes('validation')){
      error.status = 400;
    }
    next(error);
  }
}

export async function updateMeController(req, res, next){
  try {
    const id = req.user.id;
    const body = req.body;
    const updatedUser = await updateMe(id, body);
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteMeController(req, res, next) {
  try {
    const id = req.user.id;
    const deletedUser = await deleteMe(id);
    res.status(200).send(deletedUser);
  } catch(error){
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

export async function addFigureToCartController(req, res, next) {
  try {
    const { id } = req.user;
    const figureId = req.params.id;
    const updatedUser = await addFigureToCart(id, figureId);
    return res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function removeFigureFromCartController(req, res, next) {
  try {
    const { id } = req.user;
    const figureId = req.params.id;
    const deletedFigure = await deleteFigureFromCart(id, figureId);
    res.status(200).send(deletedFigure);
  } catch(error){
    next(error);
  }
}

export async function confirmOrderController(req, res, next) {
  try {
    const { id } = req.user;
    const address = req.body.shippingAddress;
    const user = await confirmOrder(id, address);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
}
