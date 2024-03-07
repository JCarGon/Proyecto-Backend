import { Figure } from '../../models/index.js'
import { HttpStatusError } from 'common-errors';

export async function createFigure(figureData) {
  const alphanumericFields = ['name', 'character', 'company', 'dimensions', 'material', 'brand', 'principalImage', 'animeName'];
  for (const field of alphanumericFields) {
    if (!figureData[field]) throw HttpStatusError(400, `Field '${field}' is required`);
  }
  if (typeof figureData.price !== 'number' || figureData.price <= 0) {
    throw HttpStatusError(400, `Field 'price' must be a number greater than 0`);
  }
  if (typeof figureData.amount !== 'number' || figureData.amount <= 0) {
    throw HttpStatusError(400, `Field 'amount' must be a number greater than 0`);
  }const exists = await Figure.findOne({ name: figureData.name });
  if (exists) throw HttpStatusError(400, 'Figure name already exists');
  const figureDoc = new Figure(figureData);
  const createFigure = await figureDoc.save();
  return createFigure;
}

export async function getFigures(filters) {
  const { name, character, company, price, dimensions, material, brand, amount, animeName, page, pageSize } = filters;
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

  const actualPage = parseInt(filters.page) || 1;
  const actualPageSize = parseInt(filters.pageSize) || 10;

  const skip = (actualPage - 1) * actualPageSize;

  const figures = await Figure.find(cleanedQuery)
    .select('-__v')
    .skip(skip)
    .limit(actualPageSize);

  return figures;
}

export async function getFigure(id) {
  const figure = await Figure.findById(id);
  if(!figure) throw HttpStatusError(404, `Figure not found`);
  return figure;
}

export async function updateFigure(id, body) {
  const figure = await Figure.findOne({ _id: id });

  if (!figure) throw HttpStatusError(404, `Figure not found`);

  const alphanumericRegex = /^[A-Za-záéíóúÁÉÍÓÚ0-9\s.-]+$/i;
  const alphanumericFields = ['name', 'character', 'company', 'dimensions', 'material', 'brand', 'principalImage', 'animeName'];

  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      if (alphanumericFields.includes(key)) {
        if (body[key] && !alphanumericRegex.test(body[key])) {
          throw HttpStatusError(400, `Field '${key}' must contain only alphanumeric characters, including spaces, periods, and hyphens.`);
        }
      }
      if (key === 'price' || key === 'amount') {
        if (typeof body[key] !== 'number' || body[key] <= 0) {
          throw HttpStatusError(400, `Field '${key}' must be a number greater than 0`);
        }
      }
      figure[key] = body[key];
    }
  }

  if (body.name) {
    const exists = await Figure.findOne({ _id: { $ne: id }, name: body.name });
    if (exists) throw HttpStatusError(400, 'Figure name already exists');
  }

  const updatedFigure = await figure.save();
  return updatedFigure;
}


export async function deleteFigure(id) {
  const deletedFigure = await Figure.findByIdAndDelete(id);
  if(!deletedFigure) throw HttpStatusError(404, `Figure not found`);
  return deletedFigure;
}
