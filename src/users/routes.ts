import express from "express";
const router = express.Router();
import { registerSchema, loginSchema } from "./schemas";
import { validateRequest } from "../middleware/validateRequest";

import { checkTokenController, createUserController, loginUserController } from "./controllers";

router.route("/register").post(validateRequest(registerSchema), createUserController);
router.route("/login").post(validateRequest(loginSchema), loginUserController);
router.route("/checkToken").post(checkTokenController);

export default router;
