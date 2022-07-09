import { NextFunction, Request, Response } from 'express';

export const cors = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.set('access-control-allow-origin', `${process.env.CLIENT_ORIGIN_URL}`);
  res.set('access-control-allow-headers', '*');
  res.set('access-control-allow-methods', 'POST');
  next();
};
