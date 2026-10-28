import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

type UserInput = { name: string; email: string };

export const usersService = {
  list: () => db.select().from(users),

  getById: async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  },

  create: async (data: UserInput) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  update: async (id: string, data: Partial<UserInput>) => {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user ?? null;
  },

  remove: async (id: string) => {
    const [user] = await db.delete(users).where(eq(users.id, id)).returning();
    return user ?? null;
  },
};
