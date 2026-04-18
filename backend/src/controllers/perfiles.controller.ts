import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";

import {
  obtenerPerfilesDeUsuario,
  crearPerfilDeUsuario,
  actualizarPerfilPorId,
  eliminarPerfilPorId,
  obtenerPerfilPorId
} from "../models/Perfil";

import { buscarUsuarioPorId } from "../models/Usuario";

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

    const usuario = await buscarUsuarioPorId(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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
  const perfilId = Number(req.params.id);
  const { nombrePerfil, esInfantil } = req.body;

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const perfil = await obtenerPerfilPorId(perfilId);

    if (!perfil || perfil.usuarioId !== req.usuarioId) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const data: any = {};

    if (nombrePerfil !== undefined) data.nombrePerfil = nombrePerfil;
    if (esInfantil !== undefined)
      data.esInfantil = esInfantil === "true" || esInfantil === true;

    if (req.file) {
      if (perfil.avatar) {
        const oldAvatarPath = path.join(__dirname, "..", perfil.avatar);
        if (fs.existsSync(oldAvatarPath)) fs.unlinkSync(oldAvatarPath);
      }

      data.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const perfilActualizado = await actualizarPerfilPorId(perfilId, data);

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
  const perfilId = Number(req.params.id);

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const perfil = await obtenerPerfilPorId(perfilId);

    if (!perfil || perfil.usuarioId !== req.usuarioId) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    if (perfil.avatar) {
      const avatarPath = path.join(__dirname, "..", perfil.avatar);
      if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
    }

    await eliminarPerfilPorId(perfilId);

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

  if (!perfilId) {
    return res.status(400).json({ message: "ID de perfil requerido" });
  }

  try {
    if (!req.usuarioId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const perfil = await obtenerPerfilPorId(Number(perfilId));

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
