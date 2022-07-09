import { Request, Response } from 'express';

// eslint-disable-next-line sort-imports
import { Controller, HttpRequest } from '../../presentation/ports';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      headers: {
        host: req.headers.host,
      },
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
