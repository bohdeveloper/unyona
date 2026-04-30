import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  usuarioId?: number;
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
      usuarioId: number;
    };

    req.usuarioId = Number(decoded.usuarioId);

    if (!Number.isInteger(req.usuarioId)) {
      return res.status(401).json({ message: "Token inválido" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};