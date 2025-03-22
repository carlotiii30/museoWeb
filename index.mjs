import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import { fileURLToPath } from "url";
import obrasRouter from "./routes/obras.mjs";

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

app.get("/", (req, res) => {
  res.render("index.njk", { titulo: "Bienvenido al Museo Arqueológico" });
});

app.use("/obras", obrasRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT} en modo ${IN}`
  );
});
