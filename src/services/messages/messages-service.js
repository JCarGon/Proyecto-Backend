import { Message } from '../../models/index.js'
import { HttpStatusError } from 'common-errors';

export async function createMessage(body) {
  const requiredFields = ['name', 'surnames', 'email', 'tlf', 'msg'];
  const nameRegex = /^[A-Za-zÀ-ÿ\s]{3,20}$/;
  const surnamesRegex = /^[A-Za-zÀ-ÿ\s]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const tlfRegex = /^\d{9}$/;

  for (const field of requiredFields) {
    if (!body[field]) throw HttpStatusError(400, `Body must contains field '${field}' or not be empty.`);
  }

  if (!nameRegex.test(body.name)) throw HttpStatusError(400, 'Field name is invalid.');
  if (!surnamesRegex.test(body.surnames)) throw HttpStatusError(400, 'Field surnames is invalid. Only must contains alphabetic characters');
  if (!emailRegex.test(body.email)) throw HttpStatusError(400, 'Field email is invalid. Format must be `correo@correo.com`.');
  if (!tlfRegex.test(body.tlf)) throw HttpStatusError(400, 'Field tlf is invalid. Must contains 9 numbers.');
  if (!body.msg.trim()) throw HttpStatusError(400, 'Field msg is invalid.');

  const messageDoc = new Message(body);
  const createdMessage = await messageDoc.save();
  return createdMessage;
}

export async function getMessages(filters) {
  const { email } = filters;
  const query = {};
  if (email) query.email = new RegExp(email, 'i');
  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(([_, a]) => a !== undefined && a !== null)
  );
  const messages = await Message.find(cleanedQuery).select('-__v')
  return messages;
}

export async function getMessage(id) {
  const message = await Message.findById(id);
  if(!message) throw HttpStatusError(404, `Message not found`);
  return message;
}
