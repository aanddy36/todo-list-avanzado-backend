import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthOptions, JwtPayload } from "../types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../users/models"; // Asegúrate de ajustar el path correcto para tu modelo de usuario

dotenv.config();


export const auth = (typeOfUser: AuthOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Token inexistente" });
    }

    const token = authHeader.split(" ")[1];

    try { 
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Usuario no existe" });
      }

      switch (typeOfUser) {
        case AuthOptions.USER:
          if (user.role !== "user") {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ msg: "Solo un usuario puede acceder a esta ruta" });
          }
          
          break;

        case AuthOptions.ADMIN:
          if (user.role !== "admin") {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ msg: "Solo un administrador puede acceder a esta ruta" });
          }
          break;

        case AuthOptions.BOTH:
          break;

        default:
          return res
            .status(StatusCodes.FORBIDDEN)
            .json({ msg: "Acceso no autorizado" });
      }

    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Token inválido" });
    }

    return next();
  };
};