import { Request, Response, NextFunction } from 'express';

const apiKey = process.env.API_KEY;

export function apiAuth(req: Request, res: Response, next: NextFunction): void {
  const requestKey = req.headers['x-api-key'] as string;

  if (apiKey !== requestKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
