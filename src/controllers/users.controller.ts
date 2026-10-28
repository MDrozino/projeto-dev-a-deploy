import type { Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from "../schemas/users.schema.js";
import { usersService } from "../services/users.service.js";

export const usersController = {
  list: async (_req: Request, res: Response) => {
    res.json(await usersService.list());
  },

  getById: async (req: Request, res: Response) => {
    const { id } = userIdSchema.parse(req.params);
    const user = await usersService.getById(id);
    if (!user) throw new AppError(404, "User not found");
    res.json(user);
  },

  create: async (req: Request, res: Response) => {
    const data = createUserSchema.parse(req.body);
    const user = await usersService.create(data);
    res.status(201).json(user);
  },

  update: async (req: Request, res: Response) => {
    const { id } = userIdSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);
    const user = await usersService.update(id, data);
    if (!user) throw new AppError(404, "User not found");
    res.json(user);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = userIdSchema.parse(req.params);
    const user = await usersService.remove(id);
    if (!user) throw new AppError(404, "User not found");
    res.status(204).send();
  },
};
