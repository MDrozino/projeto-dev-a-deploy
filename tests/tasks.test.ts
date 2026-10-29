import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app.js";

let userId: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "Task Owner", email: `owner-${Date.now()}@example.com` });
  userId = res.body.id;
});

// Removing the user also removes its tasks (onDelete: cascade)
afterAll(async () => {
  await request(app).delete(`/users/${userId}`);
});

describe("tasks", () => {
  it("creates a task for a user", async () => {
    const res = await request(app)
      .post(`/users/${userId}/tasks`)
      .send({ title: "Study Docker" });

    expect(res.status).toBe(201);
    expect(res.body.done).toBe(false);
  });

  it("rejects an empty title", async () => {
    const res = await request(app)
      .post(`/users/${userId}/tasks`)
      .send({ title: "" });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the user does not exist", async () => {
    const res = await request(app)
      .post("/users/00000000-0000-0000-0000-000000000000/tasks")
      .send({ title: "Test" });

    expect(res.status).toBe(404);
  });

  it("marks a task as done and filters by status", async () => {
    const created = await request(app)
      .post(`/users/${userId}/tasks`)
      .send({ title: "Write tests" });

    const updated = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .send({ done: true });
    expect(updated.status).toBe(200);
    expect(updated.body.done).toBe(true);

    const list = await request(app).get(`/users/${userId}/tasks?done=true`);
    expect(list.status).toBe(200);
    expect(list.body.every((t: { done: boolean }) => t.done)).toBe(true);
  });

  it("deletes a task", async () => {
    const created = await request(app)
      .post(`/users/${userId}/tasks`)
      .send({ title: "Temporary" });

    const res = await request(app).delete(`/tasks/${created.body.id}`);
    expect(res.status).toBe(204);

    const again = await request(app).get(`/tasks/${created.body.id}`);
    expect(again.status).toBe(404);
  });
});
