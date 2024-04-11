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
    const transactions = await knex("transactions").select();
    return res.status(200).send({ transactions });
  });

  app.get("/:id", async (req, res) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getTransactionsParamsSchema.parse(req.params);

    const transactions = await knex("transactions").where("id", id).first();

    return res.status(200).send({ transactions });
  });

  app.get("/summary", async () => {
    const summary = await knex("transactions")
      .sum("amount", { as: "amount" })
      .first();

    return { summary };
  });
}
