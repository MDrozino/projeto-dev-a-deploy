import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { app } from "../src/app.js";

const createdIds: string[] = [];
const uniqueEmail = () => `test-${Date.now()}-${Math.random()}@example.com`;

afterAll(async () => {
  for (const id of createdIds) {
    await request(app).delete(`/users/${id}`);
  }
});

describe("users", () => {
  it("creates a user", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Test User", email: uniqueEmail() });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdIds.push(res.body.id);
  });

  it("rejects a duplicate email", async () => {
    const email = uniqueEmail();
    const first = await request(app)
      .post("/users")
      .send({ name: "First", email });
    createdIds.push(first.body.id);

    const second = await request(app)
      .post("/users")
      .send({ name: "Second", email });

    expect(second.status).toBe(409);
  });

  it("rejects an invalid body", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "", email: "not-an-email" });

    expect(res.status).toBe(400);
  });

  it("returns 404 for an unknown user", async () => {
    const res = await request(app).get(
      "/users/00000000-0000-0000-0000-000000000000",
    );

    expect(res.status).toBe(404);
  });
});
