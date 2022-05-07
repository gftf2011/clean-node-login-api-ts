import { HttpRequest } from '@/presentation/ports'
import { Request, Response } from 'express'
import { WebController } from '@/presentation/controllers'

export const adaptRoute = (controller: WebController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      headers: {
        host: req.headers.host
      }
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
