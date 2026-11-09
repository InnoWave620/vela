import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../../application/ports/ITokenService';

export function createUserRoutes(
  userController: UserController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.use(authMiddleware as any);
  router.get('/me', userController.getMe as any);
  router.get('/', userController.listAll as any);

  return router;
}

