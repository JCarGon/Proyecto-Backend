import { HttpStatusError } from "common-errors";

export async function validatorUserId(req, res, next) {
  const { id } = req.params;
  if(id === req.user.id){
    next();
  } else {
    throw HttpStatusError(403, `Forbidden`);
  }
}
