import type { Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
  userTasksParamsSchema,
} from "../schemas/tasks.schema.js";
import { tasksService } from "../services/tasks.service.js";

export const tasksController = {
  listByUser: async (req: Request, res: Response) => {
    const { userId } = userTasksParamsSchema.parse(req.params);
    const { done } = listTasksQuerySchema.parse(req.query);
    res.json(await tasksService.listByUser(userId, done));
  },

  getById: async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    const task = await tasksService.getById(id);
    if (!task) throw new AppError(404, "Task not found");
    res.json(task);
  },

  create: async (req: Request, res: Response) => {
    const { userId } = userTasksParamsSchema.parse(req.params);
    const data = createTaskSchema.parse(req.body);
    const task = await tasksService.create(userId, data);
    res.status(201).json(task);
  },

  update: async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    const data = updateTaskSchema.parse(req.body);
    const task = await tasksService.update(id, data);
    if (!task) throw new AppError(404, "Task not found");
    res.json(task);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = taskIdSchema.parse(req.params);
    const task = await tasksService.remove(id);
    if (!task) throw new AppError(404, "Task not found");
    res.status(204).send();
  },
};
