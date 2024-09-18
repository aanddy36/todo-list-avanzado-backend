import express from "express";
const router = express.Router();

import {
  createTaskController,
  getTasksOfUserController,
  editTaskController,
  deleteTaskController,
  getAllTasksController,
} from "./controllers";

import { createTaskSchema, editTaskSchema } from "./schemas";
import { validateRequest } from "../middleware/validateRequest";

import { auth } from "../middleware/auth";
import { AuthOptions } from "../types";

router.route("/").get(auth(AuthOptions.ADMIN), getAllTasksController);
router
  .route("/:userId")
  .get(auth(AuthOptions.USER), getTasksOfUserController)
  .post(
    auth(AuthOptions.USER),
    validateRequest(createTaskSchema),
    createTaskController
  );
router
  .route("/:taskId")
  .patch(
    auth(AuthOptions.USER),
    validateRequest(editTaskSchema),
    editTaskController
  )
  .delete(auth(AuthOptions.BOTH), deleteTaskController);

export default router;
