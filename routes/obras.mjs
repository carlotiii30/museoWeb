import express from "express";
const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const obras = await prisma.obra.findMany();

    res.render("obras.njk", {
      titulo: "Obras Singulares",
      obras,
    });
  } catch (error) {
    console.error("Error al obtener las obras:", error);
    res.status(500).send("Error al cargar las obras.");
  }
});

router.get("/buscar", async (req, res) => {
  const búsqueda = req.query.búsqueda?.trim();

  if (!búsqueda || /\s/.test(búsqueda)) {
    return res.status(400).send("Solo se permite una palabra en la búsqueda.");
  }

  try {
    const resultados = await prisma.obra.findMany({
      where: {
        OR: [
          { titulo: { contains: búsqueda, mode: "insensitive" } },
          { descripcion: { contains: búsqueda, mode: "insensitive" } },
          { comentario: { contains: búsqueda, mode: "insensitive" } },
          { procedencia: { contains: búsqueda, mode: "insensitive" } },
        ],
      },
    });

    res.render("resultados.njk", {
      búsqueda,
      resultados,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor.");
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const obra = await prisma.obra.findUnique({
      where: { id },
    });

    if (!obra) {
      return res.status(404).send("Obra no encontrada");
    }

    res.render("obra.njk", {
      titulo: obra.titulo,
      obra,
    });
  } catch (err) {
    console.error("Error al obtener la obra:", err);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
