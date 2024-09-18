import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  getAllTasksService,
  getTasksOfUserService,
  createTaskService,
  editTaskService,
  deleteTaskService,
} from "./services";
import { io } from "../index";

const getAllTasksController = async (req: Request, res: Response) => {
  try {
    let { page = 1, completed } = req.query;
    page = Number(page);
    if (isNaN(page) || page <= 0 || !Number.isInteger(page)) {
      page = 1;
    }
    const { tasks, totalTasks } = await getAllTasksService(
      page,
      completed ? JSON.parse(completed as string) : null
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Todas las tasks", tasks, totalTasks });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Error en el servidor, intente nuevamente" });
  }
};

const getTasksOfUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tasks = await getTasksOfUserService(userId);
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Todas las tasks de un usuario", tasks });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Error en el servidor, intente nuevamente" });
  }
};

const createTaskController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;
    const newTask = await createTaskService(userId, name);
    io.emit("taskCreated", { msg: "Tarea creada", task: newTask });
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Nueva tarea", task: newTask });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Error en el servidor, intente nuevamente" });
  }
};

const editTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    const updatedTask = await editTaskService(taskId, updates);
    io.emit("taskUpdated", { msg: "Tarea editada", task: updatedTask });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Tarea editada", task: updatedTask });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Error en el servidor, intente nuevamente" });
  }
};

const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await deleteTaskService(taskId);
    io.emit("taskDeleted", { msg: "Tarea borrada", task });
    return res
      .status(StatusCodes.OK)
      .json({ msg: `Tarea de id ${taskId} borrada` });
  } catch (error) {
    return res
      .status(StatusCodes.NOT_ACCEPTABLE)
      .json({ msg: "Error en el servidor, intente nuevamente", error });
  }
};

export {
  getAllTasksController,
  getTasksOfUserController,
  createTaskController,
  editTaskController,
  deleteTaskController,
};
