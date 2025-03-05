import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN = process.env.IN || "development";
const app = express();

// Configurar Nunjucks
nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  noCache: IN === "development",
  watch: IN === "development",
  express: app,
});
app.set("view engine", "njk");

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.get("/", (req, res) => {
  res.render("index.njk", { titulo: "Bienvenido al Museo SSBW" });
});

// Iniciar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT} en modo ${IN}`
  );
});
