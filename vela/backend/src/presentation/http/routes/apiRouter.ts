import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { TwinController } from '../controllers/TwinController';
import { FeedController } from '../controllers/FeedController';
import { EventController } from '../controllers/EventController';
import { ITokenService } from '../../../application/ports/ITokenService';
import { createAuthRoutes } from './authRoutes';
import { createUserRoutes } from './userRoutes';
import { createHealthRoutes } from './healthRoutes';

export interface ApiRouterDependencies {
  authController: AuthController;
  userController: UserController;
  twinController: TwinController;
  feedController: FeedController;
  eventController: EventController;
  tokenService: ITokenService;
}

export function createApiRouter(deps: ApiRouterDependencies): Router {
  const router = Router();

  // 1. Health
  router.use('/', createHealthRoutes());

  // 2. Auth
  router.use('/auth', createAuthRoutes(deps.authController));

  // 3. Birthday Twins matching endpoints (public query by date of birth)
  router.get('/users/twins', deps.twinController.getBirthdayTwins);
  router.get('/twins', deps.twinController.getBirthdayTwins);
  router.post('/users/twins/:twinId/invite', deps.twinController.inviteTwin);
  router.post('/twins/:twinId/invite', deps.twinController.inviteTwin);

  // 4. Authenticated User routes
  router.use('/users', createUserRoutes(deps.userController, deps.tokenService));

  // 4. Social Feed endpoints
  router.get('/feed', deps.feedController.getPosts);
  router.post('/feed', deps.feedController.createPost);
  router.post('/feed/:id/like', deps.feedController.toggleLike);

  // 5. Events & Collaborative Planning endpoints
  router.get('/events', deps.eventController.getEvents);
  router.post('/events/:id/join', deps.eventController.joinEvent);
  router.get('/artists', deps.eventController.getArtists);
  router.post('/events/:id/book-artist', deps.eventController.bookArtistForEvent);

  return router;
}
