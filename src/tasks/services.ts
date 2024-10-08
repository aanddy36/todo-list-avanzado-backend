import Task from "./models";
import User from "../users/models";

export const getAllTasksService = async (page = 1, completed: boolean | null = null) => {
  const limit = 5; // Número de elementos por página
  const offset = (page - 1) * limit;

  const whereCondition = completed !== null ? { completed } : {};

  const tasks = await Task.findAll({
    where: whereCondition,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ["email"],
        as: "user",
      },
    ],
  });

  const totalTasks = await Task.count({ where: whereCondition });

  return { tasks, totalTasks };
};

export const getTasksOfUserService = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("El usuario no existe");
  }
  const tasks = await Task.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        attributes: ["email"],
        as: "user",
      },
    ],
  });
  return tasks;
};

export const createTaskService = async (userId: string, name: string) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("El usuario no existe");
  }
  const newTask = await Task.create({ name, userId });
  const taskWithUser = await Task.findByPk(newTask.id, {
    include: [
      {
        model: User,
        attributes: ["email"],
        as: "user",
      },
    ],
  });
  return taskWithUser;
};

export const editTaskService = async (taskId: string, updates: any) => {
  const task = await Task.findByPk(taskId, {
    include: [
      {
        model: User,
        attributes: ["email"],
        as: "user",
      },
    ],
  });
  if (!task) {
    throw new Error("No existe esta tarea");
  }
  await task.update(updates);

  return task;
};

export const deleteTaskService = async (taskId: string) => {
  const task = await Task.findByPk(taskId, {
    include: [
      {
        model: User,
        attributes: ["email"],
        as: "user",
      },
    ],
  });
  if (!task) {
    throw new Error("No se encontró la tarea");
  }
  await task.destroy();
  return task.id
};
