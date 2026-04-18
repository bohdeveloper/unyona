import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/* Extrae el token / Lo valida / Añade usuarioId a la request */
interface AuthRequest extends Request {
  usuarioId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      usuarioId: string;
    };

    req.usuarioId = decoded.usuarioId;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};