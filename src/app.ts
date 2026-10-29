import express from "express";
import { errorHandler } from "./middlewares/error-handler.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);
app.use(tasksRouter);

app.use(errorHandler);
