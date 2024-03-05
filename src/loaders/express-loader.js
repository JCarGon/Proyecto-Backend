import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import YAML from 'yamljs';

import router from '../routes/index.js';
import { errorMiddleware } from '../middlewares/error-middleware.js';
import { morganMiddleware } from '../config/morgan.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const swaggerDocument = YAML.load(path.join(dirname, '../openapi/openapi.yml'));

export default function(server){
    /* Config */
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true}));
    /* Static files */
    server.use(express.static('public'));
    /* Swagger */
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    /* MDW */
    server.use(morganMiddleware);
    /* Routes */
    server.use('/v1', router);
    /* Error handler */
    server.use(errorMiddleware);
}
