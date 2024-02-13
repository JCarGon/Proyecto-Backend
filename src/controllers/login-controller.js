import { HttpStatusError } from 'common-errors';
import jwt from 'jsonwebtoken';
import { getUserByName } from '../services/users/user-db-service.js';
import { checkHash } from '../utils/encrypt.js';

import config from '../config.js';

export async function login(req, res, next){
  const { username, password } = req.body;
  try {

    const user = await getUserByName(username);

    if(user){
      if(checkHash(password, user.password)){
        const userInfo = { id: user.id, username: user.username };
        const jwtConfig = { expiresIn: 7200 };
        const token = jwt.sign(userInfo, config.app.secretKey, jwtConfig);
        return res.send({token});
      }
    }
    throw new HttpStatusError(401, 'Invalid credentials');
  } catch(error){
    next(error)
  }
}
