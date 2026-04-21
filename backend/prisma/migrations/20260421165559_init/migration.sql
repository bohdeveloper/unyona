-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido1" TEXT NOT NULL,
    "apellido2" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "edad" INTEGER,
    "pais" TEXT NOT NULL DEFAULT 'ES',
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "rol" TEXT NOT NULL DEFAULT 'user',
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "nombrePerfil" TEXT NOT NULL,
    "avatar" TEXT DEFAULT '',
    "esInfantil" BOOLEAN NOT NULL DEFAULT false,
    "idiomaPerfil" TEXT NOT NULL DEFAULT 'es',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorito" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Historial" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "progreso" INTEGER NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "Historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferencia" (
    "id" SERIAL NOT NULL,
    "genero" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "Preferencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historial" ADD CONSTRAINT "Historial_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferencia" ADD CONSTRAINT "Preferencia_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
