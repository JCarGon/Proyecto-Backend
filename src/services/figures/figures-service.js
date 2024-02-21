import { Figure } from '../../models/index.js'
import { HttpStatusError } from 'common-errors';

export async function createFigure(figureData) {
  const requiredFields = ['name', 'character', 'company', 'price', 'dimensions', 'material', 'brand', 'principalImage', 'amount', 'animeName'];
  for (const field of requiredFields) {
    if (!figureData[field]) {
      throw { message: `Field '${field}' is required`, status: 400 };
    }
  }
  const exists = await Figure.findOne({ name: figureData.name });
  if (exists) throw { message: 'Figure name already exists', status: 400 };
  const figureDoc = new Figure(figureData);
  const createFigure = await figureDoc.save();
  return createFigure;
}

export async function getFigures(filters) {
  const { name, character, company, price, dimensions, material, brand, amount, animeName } = filters;
  const query = {};
  if (name) query.name = new RegExp(name, 'i');
  if (character) query.character = new RegExp(character, 'i');
  if (company) query.company = new RegExp(company, 'i');
  if (price) query.price = price;
  if (dimensions) query.dimensions = new RegExp(dimensions, 'i');
  if (material) query.material = new RegExp(material, 'i');
  if (brand) query.brand = new RegExp(brand, 'i');
  if (amount) query.amount = amount;
  if (animeName) query.animeName = new RegExp(animeName, 'i');
  const cleanedQuery = Object.fromEntries(
    Object.entries(query).filter(([_, a]) => a !== undefined && a !== null)
  );
  const figures = await Figure.find(cleanedQuery).select('-__v');
  return figures;
}

export async function getFigure(id) {
  const figure = await Figure.findById(id);
  if(!figure) throw HttpStatusError(404, `Figure not found`);
  return figure;
}

export async function updateFigure(id, body){
  const figure = await Figure.findOne({ _id: id });

  if (!figure) throw HttpStatusError(404, `Figure not found`);
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      figure[key] = body[key];
    }
  }
  const updatedFigure = await figure.save();
  return updatedFigure;
}

export async function deleteFigure(id) {
  const deletedFigure = await Figure.findByIdAndDelete(id);
  if(!deletedFigure) throw HttpStatusError(404, `Figure not found`);
  return deletedFigure;
}
