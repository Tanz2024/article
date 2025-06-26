import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req;

  if (typeof id !== "string") return res.status(400).json({ error: "Invalid article id" });

  switch (method) {
    case "GET": {
      const article = await prisma.article.findUnique({ where: { id: Number(id) } });
      if (!article) return res.status(404).json({ error: "Not found" });
      return res.json(article);
    }
    case "PATCH": {
      const updated = await prisma.article.update({
        where: { id: Number(id) },
        data: body,
      });
      return res.json(updated);
    }
    case "DELETE": {
      await prisma.article.delete({ where: { id: Number(id) } });
      return res.status(204).end();
    }
    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
