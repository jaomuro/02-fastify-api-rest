import { afterAll, beforeAll, test } from "vitest";
import request from "supertest";
import { app } from "../app";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test("user can create an new transaction", async () => {
  await request(app.server)
    .post("/transactions")
    .send({
      title: "new transaction",
      amount: 100,
      type: "credit",
    })
    .expect(201);
});
