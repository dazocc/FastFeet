import { Router } from 'express';

// import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

function checkExistsId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Id is required' });
  }

  req.id = id;

  return next();
}

// routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', checkExistsId, RecipientController.update);

export default routes;
