import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { StatusCodes } from "http-status-codes";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Formato inválido" });
    }
    return next();
  };
};
