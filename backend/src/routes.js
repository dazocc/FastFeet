import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import DeliveryByControler from './app/controllers/DeliveryByControler';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryWithProblemsController from './app/controllers/DeliveryWithProblemsController';
import authMiddleware from './app/middlewares/auth';
import checkExistsId from './app/middlewares/checkExistsId';
import checkUserIsAdmin from './app/middlewares/checkUserIsAdmin';

const routes = new Router();
const upload = multer(multerConfig);

// routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get(
  '/deliverymans/:id/deliveries',
  checkExistsId,
  DeliveryByControler.index
);
routes.put(
  '/deliverymans/deliveries/:id',
  checkExistsId,
  DeliveryByControler.update
);

routes.get(
  '/delivery/:id/problems',
  checkExistsId,
  DeliveryProblemController.index
);

routes.post(
  '/delivery/:id/problems',
  checkExistsId,
  DeliveryProblemController.store
);

routes.put(
  '/delivery/:id/problems',
  checkExistsId,
  DeliveryProblemController.update
);

routes.get('/deliveries/problems', DeliveryWithProblemsController.index);

routes.post(
  '/delivery/:id/problems',
  checkExistsId,
  DeliveryProblemController.index
);

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
