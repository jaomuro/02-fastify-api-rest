import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/hello", async () => {
    const transactions = knex("transactions").where("amount", 1000).select("*");

    return transactions;
  });
}
