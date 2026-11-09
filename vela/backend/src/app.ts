import express, { Application } from 'express';
import cors from 'cors';
import { ServiceContainer } from './container';
import { createApiRouter } from './presentation/http/routes/apiRouter';
import { errorHandlerMiddleware } from './presentation/http/middlewares/errorHandlerMiddleware';
import { env } from './infrastructure/config/environment';

export function createApp(container: ServiceContainer): Application {
  const app: Application = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  // Mount API router
  const apiRouter = createApiRouter({
    authController: container.authController,
    userController: container.userController,
    twinController: container.twinController,
    feedController: container.feedController,
    eventController: container.eventController,
    tokenService: container.tokenService,
  });

  app.use('/api', apiRouter);

  // Global Error Handler Middleware
  app.use(errorHandlerMiddleware);

  return app;
}
