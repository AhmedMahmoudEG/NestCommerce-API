import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start + 'ms',
      requestedAT: Date().toLocaleString().slice(0, 28),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    next();
  }
}
