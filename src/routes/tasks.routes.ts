import { Router } from "express";
import { tasksController } from "../controllers/tasks.controller.js";

export const tasksRouter = Router();

tasksRouter.get("/users/:userId/tasks", tasksController.listByUser);
tasksRouter.post("/users/:userId/tasks", tasksController.create);

tasksRouter.get("/tasks/:id", tasksController.getById);
tasksRouter.patch("/tasks/:id", tasksController.update);
tasksRouter.delete("/tasks/:id", tasksController.remove);
