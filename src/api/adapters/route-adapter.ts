import { HttpResponse, Controller } from '../../common/protocols';
import { Request, Response } from 'express';

export const routeAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      payload: req.payload ? req.payload : {},
      path: req.path,
      ...req.body,
      ...req.params,
      ...req.query,
    };

    const httpResponse: HttpResponse = await controller(request);

    return res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
