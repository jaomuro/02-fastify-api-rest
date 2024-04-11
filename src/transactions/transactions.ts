import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (req, res) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(req.body);

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    });
    // code 201 - recurso criado com sucesso.
    return res.status(201).send();
  });

  app.get("/", async (req, res) => {
    const transaction = await knex("transactions").select();
    return res.status(201).send(transaction);
  });
}
