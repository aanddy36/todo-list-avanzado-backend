import Joi from "joi";

export const createTaskSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

export const editTaskSchema = Joi.object({
  name: Joi.string().min(1),
  completed: Joi.boolean(),
}).or("completed", "name");
