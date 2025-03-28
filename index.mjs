import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import { fileURLToPath } from "url";
import obrasRouter from "./routes/obras.mjs";
import usuariosRouter from "./routes/usuarios.mjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN = process.env.IN || "development";
const app = express();

nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  noCache: IN === "development",
  watch: IN === "development",
  express: app,
});
app.set("view engine", "njk");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de autenticación
const autentificacion = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY);
      req.usuario = data.usuario;
      req.rol = data.rol;
      res.locals.usuario = data.usuario;
      res.locals.rol = data.rol;
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
    }
  }
  next();
};

app.use(autentificacion);

app.get("/", (req, res) => {
  res.render("index.njk", { titulo: "Bienvenido al Museo Arqueológico" });
});

app.use("/obras", obrasRouter);
app.use("/usuarios", usuariosRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT} en modo ${IN}`
  );
});
