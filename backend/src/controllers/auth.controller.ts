import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  crearUsuario,
  buscarUsuarioPorEmail,
  buscarUsuarioPorId,
  actualizarUltimoLogin
} from "../models/Usuario";

/* ============================
   ME → Obtener usuario logueado
   ============================ */
export const me = async (req: any, res: Response) => {
  const usuario = await buscarUsuarioPorId(req.usuarioId);

  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Eliminamos password antes de devolverlo
  const { password, ...usuarioSinPassword } = usuario;

  res.json(usuarioSinPassword);
};

/* ============================
   REGISTRO
   ============================ */
export const registro = async (req: Request, res: Response) => {
  const { nombre, apellido1, apellido2, email, password, fechaNacimiento } = req.body;

  const existeUsuario = await buscarUsuarioPorEmail(email);
  if (existeUsuario) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  const passwordOK = await bcrypt.hash(password, 10);

  const usuario = await crearUsuario({
    nombre,
    apellido1,
    apellido2,
    email,
    password: passwordOK,
    fechaNacimiento: new Date(fechaNacimiento)
  });

  const token = jwt.sign(
    { usuarioId: usuario.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.status(201).json({
    message: "Usuario creado correctamente",
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      email: usuario.email,
      fechaNacimiento: usuario.fechaNacimiento
    }
  });
};

/* ============================
   LOGIN
   ============================ */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const usuario = await buscarUsuarioPorEmail(email);
  if (!usuario) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  const isValid = await bcrypt.compare(password, usuario.password);
  if (!isValid) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    { usuarioId: usuario.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido1: usuario.apellido1,
      apellido2: usuario.apellido2,
      email: usuario.email,
      fechaNacimiento: usuario.fechaNacimiento
    }
  });
};
