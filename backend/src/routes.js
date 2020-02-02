import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import checkExistsId from './app/middlewares/checkExistsId';
import checkUserIsAdmin from './app/middlewares/checkUserIsAdmin';

const routes = new Router();
const upload = multer(multerConfig);

// routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/** Daqui pra baixo soh funcionaldiades para usuario logado */
routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', checkExistsId, RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);
/** Daqui pra baixo soh funcionalidades para admin */
routes.use(checkUserIsAdmin);

routes.get('/delivererymans', DeliveryManController.index);
routes.post('/delivererymans', DeliveryManController.store);
routes.put('/delivererymans/:id', checkExistsId, DeliveryManController.update);
routes.delete(
  '/delivererymans/:id',
  checkExistsId,
  DeliveryManController.delete
);
routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', checkExistsId, DeliveryController.update);
routes.delete('/deliveries/:id', checkExistsId, DeliveryController.delete);

export default routes;
