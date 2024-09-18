import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "./models";

export const createUser = async (email: string, password: string) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const tokenPayload = {
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return { token, user: tokenPayload };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("Email o contraseña incorrectos");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Email o contraseña incorrectos");
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  return { token, user: tokenPayload };
};

export const checkToken = (token: string | undefined): { valid: boolean; payload?: any } => {
  if (!token) {
    return { valid: false };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false };
  }
};