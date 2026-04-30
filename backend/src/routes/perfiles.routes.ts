import { Router } from "express";
import {
  crearPerfil,
  obtenerPerfiles,
  actualizarPerfil,
  eliminarPerfil,
  seleccionarPerfil
} from "../controllers/perfiles.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadAvatar } from "../middlewares/uploadAvatar";


const router = Router();

router.use(authMiddleware);

router.get("/", authMiddleware, obtenerPerfiles);
router.post("/", authMiddleware, uploadAvatar.single("avatar"), crearPerfil);
router.put("/:perfilId", authMiddleware, uploadAvatar.single("avatar"), actualizarPerfil);
router.delete("/:perfilId", authMiddleware, eliminarPerfil);
router.post("/seleccionar", authMiddleware, seleccionarPerfil);

export default router;