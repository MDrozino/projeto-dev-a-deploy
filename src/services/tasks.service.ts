import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { tasks } from "../db/schema.js";
import { AppError } from "../errors/app-error.js";
import { usersService } from "./users.service.js";

type TaskInput = { title: string; description?: string | null };
type TaskUpdate = Partial<TaskInput> & { done?: boolean };

export const tasksService = {
  listByUser: async (userId: string, done?: boolean) => {
    const user = await usersService.getById(userId);
    if (!user) throw new AppError(404, "User not found");

    return db
      .select()
      .from(tasks)
      .where(
        done === undefined
          ? eq(tasks.userId, userId)
          : and(eq(tasks.userId, userId), eq(tasks.done, done)),
      );
  },

  getById: async (id: string) => {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task ?? null;
  },

  create: async (userId: string, data: TaskInput) => {
    const user = await usersService.getById(userId);
    if (!user) throw new AppError(404, "User not found");

    const [task] = await db
      .insert(tasks)
      .values({ ...data, userId })
      .returning();
    return task;
  },

  update: async (id: string, data: TaskUpdate) => {
    const [task] = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id))
      .returning();
    return task ?? null;
  },

  remove: async (id: string) => {
    const [task] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return task ?? null;
  },
};
