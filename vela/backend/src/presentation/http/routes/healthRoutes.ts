import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';

export function createHealthRoutes(): Router {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    sendSuccess(res, {
      status: 'ok',
      service: 'vela-backend',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}

