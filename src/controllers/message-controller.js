import { createMessage, getMessages, getMessage } from "../services/messages/messages-service.js";

export async function createMessageController(req, res, next) {
  const body = req.body;
  try {
    const messageCreated = await createMessage(body);
    res.status(201).send(messageCreated);
  } catch (error) {
    if(error.message.includes('validation')){
      error.status = 400;
    }
    next(error);
  }
}

export async function getMessagesController(req, res, next) {
  try {
    const messages = await getMessages(req.query);
    res.status(200).send(messages);
  } catch (error){
    next(error);
  }
}

export async function getMessageController(req, res, next) {
  try {
    const { id } = req.params;
    const message = await getMessage(id);
    res.status(200).send(message);
  } catch (error){
    next(error);
  }
}
