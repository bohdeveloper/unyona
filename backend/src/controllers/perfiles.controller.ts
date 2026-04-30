import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import {
  obtenerPerfilesDeUsuario,
  crearPerfilDeUsuario,
  obtenerPerfilPorId
} from "../models/Perfil";

import { buscarUsuarioPorId } from "../models/Usuario";

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  usuarioId?: number;
  file?: Express.Multer.File;
}

/* ============================
   OBTENER PERFILES
   ============================ */
export const obtenerPerfiles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const perfiles = await obtenerPerfilesDeUsuario(req.usuarioId);
    res.json(perfiles);
  } catch {
    res.status(500).json({ message: "Error al obtener perfiles" });
  }
};

/* ============================
   CREAR PERFIL
   ============================ */
export const crearPerfil = async (req: AuthRequest, res: Response) => {
  const { nombrePerfil, esInfantil } = req.body;

  if (!nombrePerfil) {
    return res.status(400).json({ message: "El nombre del perfil es obligatorio" });
  }

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const usuario = await buscarUsuarioPorId(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const avatarPath = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : "";

    const perfil = await crearPerfilDeUsuario(req.usuarioId, {
      nombrePerfil,
      avatar: avatarPath,
      esInfantil: esInfantil === "true" || esInfantil === true
    });

    res.status(201).json(perfil);
  } catch {
    res.status(500).json({ message: "Error al crear perfil" });
  }
};

/* ============================
   ACTUALIZAR PERFIL
   ============================ */
export const actualizarPerfil = async (req: AuthRequest, res: Response) => {
  console.log("PARAMS:", req.params);
  
  const perfilId = Number(req.params.perfilId);

  if (!Number.isInteger(perfilId)) {
    return res.status(400).json({ message: "ID de perfil inválido" });
  }

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const data: any = {};
    const { nombrePerfil, esInfantil } = req.body;

    if (nombrePerfil !== undefined) data.nombrePerfil = nombrePerfil;
    if (esInfantil !== undefined) {
      data.esInfantil = esInfantil === "true" || esInfantil === true;
    }

    if (req.file) {
      const perfilPrevio = await obtenerPerfilPorId(perfilId);

      if (perfilPrevio?.avatar) {
        const avatarPath = path.join(
          process.cwd(),
          "uploads",
          "avatars",
          path.basename(perfilPrevio.avatar)
        );

        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }

      data.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const actualizado = await prisma.perfil.updateMany({
      where: {
        id: perfilId,
        usuarioId: req.usuarioId
      },
      data
    });

    if (actualizado.count === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const perfilActualizado = await obtenerPerfilPorId(perfilId);
    res.json(perfilActualizado);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

/* ============================
   ELIMINAR PERFIL
   ============================ */
export const eliminarPerfil = async (req: AuthRequest, res: Response) => {
  
  const perfilId = Number(req.params.perfilId);

  if (!Number.isInteger(perfilId)) {
    return res.status(400).json({ message: "ID de perfil inválido" });
  }

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const perfil = await obtenerPerfilPorId(perfilId);

    if (perfil?.avatar) {
      const avatarPath = path.join(
        process.cwd(),
        "uploads",
        "avatars",
        path.basename(perfil.avatar)
      );

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    const eliminado = await prisma.perfil.deleteMany({
      where: {
        id: perfilId,
        usuarioId: req.usuarioId
      }
    });

    if (eliminado.count === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const perfiles = await obtenerPerfilesDeUsuario(req.usuarioId);
    res.json(perfiles);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar perfil" });
  }
};

/* ============================
   SELECCIONAR PERFIL
   ============================ */
export const seleccionarPerfil = async (req: AuthRequest, res: Response) => {
  const { perfilId } = req.body;

  if (!Number.isInteger(perfilId)) {
    return res.status(400).json({ message: "ID de perfil requerido" });
  }

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const perfil = await obtenerPerfilPorId(perfilId);

    if (!perfil || perfil.usuarioId !== req.usuarioId) {
      return res.status(404).json({ message: "Perfil no válido" });
    }

    const token = jwt.sign(
      {
        usuarioId: req.usuarioId,
        perfilId: perfil.id,
        esInfantil: perfil.esInfantil
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      perfilActivo: perfil
    });
  } catch {
    res.status(500).json({ message: "Error al seleccionar perfil" });
  }
};