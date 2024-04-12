import { afterAll, beforeAll, it, describe, expect, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { execSync } from "node:child_process";
describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
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

  it("should be able to get a specific transaction", async () => {
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

    const transactionId = transactionListResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "new transaction",
        amount: 100,
        id: transactionId,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionCreditResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "credit transaction",
        amount: 200,
        type: "credit",
      });

    const cookies = createTransactionCreditResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "debit transaction",
        amount: 100,
        type: "debit",
      });

    const getSummaryTransactionsResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(getSummaryTransactionsResponse.body.summary).toEqual({
      amount: 100,
    });
  });
});
