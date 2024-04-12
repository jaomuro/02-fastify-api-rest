import { FastifyReply, FastifyRequest } from "fastify";

export async function checkSessionIdExists(
  req: FastifyRequest,
  res: FastifyReply
) {
  const session_id = req.cookies.sessionId;
  if (!session_id) {
    return res.status(401).send({
      error: "Não possui Id de sessão ativo, faça uma transação.",
    });
  }
}
