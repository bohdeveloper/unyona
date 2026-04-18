import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Obtener todos los perfiles de un usuario
 */
export const obtenerPerfilesDeUsuario = async (usuarioId: number) => {
  return prisma.perfil.findMany({
    where: { usuarioId },
    orderBy: { id: "asc" }
  });
};

/**
 * Crear un perfil para un usuario
 */
export const crearPerfilDeUsuario = async (
  usuarioId: number,
  data: {
    nombrePerfil: string;
    avatar: string;
    esInfantil: boolean;
  }
) => {
  return prisma.perfil.create({
    data: {
      nombrePerfil: data.nombrePerfil,
      avatar: data.avatar,
      esInfantil: data.esInfantil,
      usuario: { connect: { id: usuarioId } }
    }
  });
};

/**
 * Obtener un perfil por ID
 */
export const obtenerPerfilPorId = async (perfilId: number) => {
  return prisma.perfil.findUnique({
    where: { id: perfilId }
  });
};

/**
 * Actualizar un perfil por ID
 */
export const actualizarPerfilPorId = async (
  perfilId: number,
  data: Partial<{
    nombrePerfil: string;
    avatar: string;
    esInfantil: boolean;
  }>
) => {
  return prisma.perfil.update({
    where: { id: perfilId },
    data
  });
};

/**
 * Eliminar un perfil por ID
 */
export const eliminarPerfilPorId = async (perfilId: number) => {
  return prisma.perfil.delete({
    where: { id: perfilId }
  });
};
