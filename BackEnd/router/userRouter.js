import { Router } from 'express';
import { UserController } from '../controller/userController.js';

const userRouter = ({ UserModel, connectionMySQL }) => {
  const router = Router();
  const userController = new UserController({ UserModel, connectionMySQL });

  router.get('/user', userController.getAll);
  //router.get('/user/email', userController.getByEmail);userRuter
  router.get('/user/:id', userController.getById);
  router.post('/user', userController.create);
  router.put('/user/:id', userController.update);
  router.delete('/user/:id', userController.delete);

  return router;
};

export default userRouter; // 👈 default export