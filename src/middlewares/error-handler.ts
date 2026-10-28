import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

// Drizzle wraps the original pg error in `cause`; 23505 = unique violation
function isUniqueViolation(err: unknown): boolean {
  const cause = (err as { cause?: { code?: string } })?.cause;
  return cause?.code === "23505";
}

// Express identifies error handlers by their 4 arguments, so `_next` must exist
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.issues });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (isUniqueViolation(err)) {
    res.status(409).json({ error: "Resource already exists" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
