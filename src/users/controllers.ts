import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { checkToken, createUser, loginUser } from "./services";

const createUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await createUser(email, password);

    return res.status(StatusCodes.CREATED).json({
      msg: "Usuario creado exitosamente",
      token,
      user,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error en el servidor, intente nuevamente", error });
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginUser(email, password);

    return res.status(StatusCodes.CREATED).json({
      msg: "Inicio de sesión exitoso",
      token,
      user,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error en el servidor, intente nuevamente", error });
  }
};

const checkTokenController = (req: Request, res: Response) => {
  const { token } = req.body;

  const result = checkToken(token);

  if (result.valid) {
    return res
      .status(StatusCodes.OK)
      .json({ valid: true, payload: result.payload });
  }

  return res.status(StatusCodes.NO_CONTENT).send();
};

export { createUserController, loginUserController, checkTokenController };
