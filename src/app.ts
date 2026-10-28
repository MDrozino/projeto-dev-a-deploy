import express from "express";
import { errorHandler } from "./middlewares/error-handler.js";
import { usersRouter } from "./routes/users.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/users", usersRouter);

app.use(errorHandler);
