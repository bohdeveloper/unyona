import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import perfilesRoutes from "./routes/perfiles.routes";
import path from "path";

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

// Autenticación
app.use("/auth", authRoutes);

// Perfiles
app.use("/perfiles", perfilesRoutes);

// Avatares
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
