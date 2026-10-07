import { Router } from "express";
import authRoutes from "./auth.routes";
import categoriesRoutes from "./categories.routes";
import ticketsRoutes from "./tickets.routes";
import usersRoutes from "./users.routes";

// Agrega os roteadores de cada recurso
const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tickets", ticketsRoutes);

export default router;
