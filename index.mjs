import express from "express";
import nunjucks from "nunjucks";

const IN = process.env.IN || "development";
const app = express();

nunjucks.configure("views", {
  autoescape: true,
  noCache: IN === "development",
  watch: IN === "development",
  express: app,
});
app.set("view engine", "html");

app.get("/hola", (req, res) => {
  res.send("Hola desde el servidor");
});

app.get("/", (req, res) => {
  res.render("index.html", { saludado: "Pepito" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT} en ${IN}`);
});
