import "dotenv/config";
import { app } from "./app";

console.log("DATABASE_URL server.ts:", process.env.DATABASE_URL);
console.log("CWD REAL:", process.cwd());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});