import { HttpStatusError } from "common-errors";

export function adminChecker(req, res, next) {
  if(req.user.rol === 'admin') {
    return next();
  }

  throw HttpStatusError(403, `Forbidden`);
}
