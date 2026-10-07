import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { routes } from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

// CORS: as origens permitidas vêm da variável CORS_ORIGIN (separadas por vírgula)
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  }),
);

app.use(express.json());

app.use(routes);

// Precisam ficar depois das rotas
app.use(notFound);
app.use(errorHandler);
