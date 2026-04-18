import { Router } from "express";
import { login, registro, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;