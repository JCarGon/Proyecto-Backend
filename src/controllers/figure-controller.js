import { createFigure, getFigures, getFigure, updateFigure, deleteFigure } from "../services/figures/figures-service.js";

export async function createFigureController(req, res, next) {
  try {
    const body = req.body;
    const figure = await createFigure(body);
    res.status(201).send(figure);
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

export async function getFiguresController(req, res, next) {
  try {
    const users = await getFigures(req.query);
    res.status(200).send(users);
  } catch (error){
    next(error);
  }
}

export async function getFigureController(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getFigure(id);
    res.status(200).send(user);
  } catch (error){
    next(error);
  }
}

export async function updateFigureController(req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedUser = await updateFigure(id, body);
    res.status(200).send(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteFigureController(req, res, next) {
  try {
    const { id } = req.params;
    const deletedFigure = await deleteFigure(id);
    res.status(200).send(deletedFigure);
  } catch(error){
    next(error);
  }
}
