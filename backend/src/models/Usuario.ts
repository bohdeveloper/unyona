import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear usuario
export const crearUsuario = async (data: {
  email: string;
  password: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento: Date;
  edad?: number;
  pais?: string;
  idioma?: string;
}) => {
  return prisma.usuario.create({
    data: {
      email: data.email,
      password: data.password,
      nombre: data.nombre,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      fechaNacimiento: data.fechaNacimiento,
      edad: data.edad,
      pais: data.pais,
      idioma: data.idioma
    }
  });
};

// Buscar usuario por email
export const buscarUsuarioPorEmail = async (email: string) => {
  return prisma.usuario.findUnique({
    where: { email }
  });
};

// Buscar usuario por ID
export const buscarUsuarioPorId = async (id: number) => {
  return prisma.usuario.findUnique({
    where: { id },
    include: {
      perfiles: true
    }
  });
};

// Actualizar último login
export const actualizarUltimoLogin = async (id: number) => {
  return prisma.usuario.update({
    where: { id },
    data: {
      ultimoLogin: new Date()
    }
  });
};

// Actualizar datos del usuario
export const actualizarUsuario = async (
  id: number,
  data: Partial<{
    nombre: string;
    apellido1: string;
    apellido2: string;
    edad: number;
    pais: string;
    idioma: string;
    activo: boolean;
    verificado: boolean;
  }>
) => {
  return prisma.usuario.update({
    where: { id },
    data
  });
};

// Eliminar usuario
export const eliminarUsuario = async (id: number) => {
  return prisma.usuario.delete({
    where: { id }
  });
};
