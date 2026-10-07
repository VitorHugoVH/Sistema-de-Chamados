import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { categoryRoutes } from "./category.routes";
import { ticketRoutes } from "./ticket.routes";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/tickets", ticketRoutes);
