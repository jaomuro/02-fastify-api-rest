import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";

const app = fastify();

app.get("/hello", async () => {
  const transactions = await knex("transactions")
    .insert({
      id: crypto.randomUUID(),
      title: "Transação de teste",
      amount: 1000,
    })
    .returning("*");
  // const transactions = knex("transactions").select("*");
  // const transactions = knex("transactions").where("amount", 500).select("*");
  // const transactions = knex("transactions").where("amount", 1000).select("*");

  return transactions;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("http server running");
  });
