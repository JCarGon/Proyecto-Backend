import { HttpStatusError } from "common-errors";

export function adminChecker(req, res, next) {
  const rol = req.user.rol;
  if(rol === 'admin') {
    next();
  } else {
    throw HttpStatusError(403, `Forbidden`);
  }
}
