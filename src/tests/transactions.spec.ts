import { afterAll, beforeAll, it, describe, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create an new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 100,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all the transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 100,
        type: "credit",
      });
    const cookies = createTransactionResponse.get("Set-Cookie");

    const transactionListResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(transactionListResponse.body.transactions).toEqual([
      expect.objectContaining({ title: "new transaction", amount: 100 }),
    ]);
  });
});
