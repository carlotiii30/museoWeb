import logger from "../logger.mjs";

import express from "express";
const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Ruta para obtener todas las obras
router.get("/", async (req, res) => {
  logger.info("Solicitando todas las obras");
  try {
    const obras = await prisma.obra.findMany();

    res.render("obras.njk", {
      titulo: "Obras Singulares",
      obras,
    });
  } catch (error) {
    logger.error("Error al obtener las obras:", error);
    res.status(500).send("Error al cargar las obras.");
  }
});

// Ruta para buscar obras
router.get("/buscar", async (req, res) => {
  const búsqueda = req.query.búsqueda?.trim();
  logger.info(`Búsqueda solicitada: "${búsqueda}"`);

  if (!búsqueda || /\s/.test(búsqueda)) {
    logger.warn("Búsqueda inválida: solo se permite una palabra");
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
    logger.error("GET /obras/buscar - Error interno del servidor:", err);
    res.status(500).send("Error interno del servidor.");
  }
});

// Ruta para obtener una obra específica por ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  logger.info(`Solicitando obra con ID: ${id}`);

  try {
    const obra = await prisma.obra.findUnique({
      where: { id },
    });

    if (!obra) {
      logger.warn(`Obra no encontrada`);
      return res.status(404).send("Obra no encontrada");
    }

    logger.info(`Obra encontrada: ${obra.titulo}`);
    res.render("obra.njk", {
      titulo: obra.titulo,
      obra,
    });
  } catch (err) {
    logger.error(`Error al obtener la obra:`, err);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
