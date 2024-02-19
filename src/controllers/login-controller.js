import { HttpStatusError } from 'common-errors';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../services/users/user-db-service.js';
import { checkHash } from '../utils/encrypt.js';

import config from '../config.js';

export async function login(req, res, next){
  const { email, password } = req.body;
  try {

    const user = await getUserByEmail(email);

    if(user){
      if(checkHash(password, user.password)){
        const userInfo = { id: user.id, rol: user.rol, email: user.email };
        const jwtConfig = { expiresIn: 3600 };
        const token = jwt.sign(userInfo, config.app.secretKey, jwtConfig);
        return res.send({token});
      }
    }
    throw new HttpStatusError(401, 'Invalid credentials');
  } catch(error){
    next(error)
  }
}
