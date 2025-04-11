import logger from "../logger.mjs";

import express from "express";
const router = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @swagger
 * /usuario/{correo}:
 *   get:
 *     summary: Obtiene información de un usuario por su correo
 *     parameters:
 *       - in: path
 *         name: correo
 *         required: true
 *         schema:
 *           type: string
 *         description: Correo del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/usuario/:correo", async (req, res) => {
  try {
    const correo = req.params.correo;
    logger.debug(
      `GET /usuario/${correo} - Solicitando información del usuario`
    );

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (usuario) {
      logger.info(`GET /usuario/${correo} - Usuario encontrado`);
      res.status(200).json({ ok: true, data: correo });
    } else {
      logger.warn(`GET /usuario/${correo} - Usuario no encontrado`);
      res.status(404).json({ ok: false, msg: `${correo} not found` });
    }
  } catch (error) {
    logger.error(`Error en GET /usuario/:correo - ${error.message}`);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /obra/cuantas:
 *   get:
 *     summary: Devuelve el número total de obras
 *     responses:
 *       200:
 *         description: Número total de obras
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: integer
 *       500:
 *         description: Error interno del servidor
 */
router.get("/obra/cuantas", async (req, res) => {
  try {
    const obras = await prisma.obra.findMany();
    res.status(200).json({ ok: true, data: obras.length });
  } catch (error) {
    logger.error(`Error en GET /obra/cuantas - ${error.message}`);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /obra:
 *   get:
 *     summary: Devuelve un rango de obras
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: integer
 *         description: Índice inicial de las obras
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: integer
 *         description: Índice final de las obras
 *     responses:
 *       200:
 *         description: Lista de obras en el rango especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error interno del servidor
 */
router.get("/obra", async (req, res) => {
  try {
    const desde = parseInt(req.query.desde) || 0;
    const hasta = parseInt(req.query.hasta) || 10;

    const obras = await prisma.obra.findMany({
      skip: desde,
      take: hasta - desde,
    });

    res.status(200).json({ ok: true, data: obras });
  } catch (error) {
    logger.error(`Error en GET /obra - ${error.message}`);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /obra/{id}:
 *   get:
 *     summary: Obtiene información de una obra por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra
 *     responses:
 *       200:
 *         description: Obra encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Obra no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/obra/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logger.debug(`GET /obra/${id} - Solicitando información de la obra`);

    const obra = await prisma.obra.findUnique({
      where: { id },
    });

    if (obra) {
      res.status(200).json({ ok: true, data: obra });
    } else {
      res.status(404).json({ ok: false, msg: `obra ${id} not found` });
    }
  } catch (error) {
    logger.error(`Error en GET /obra/:id - ${error.message}`);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
});

/**
 * @swagger
 * /obra/{id}:
 *   delete:
 *     summary: Elimina una obra por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra
 *     responses:
 *       200:
 *         description: Obra eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Obra no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/obra/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    logger.debug(`DELETE /obra/${id} - Solicitando eliminación de la obra`);

    const obra = await prisma.obra.delete({
      where: { id },
    });

    if (obra) {
      res.status(200).json({ ok: true, data: obra });
    } else {
      res.status(404).json({ ok: false, msg: `obra ${id} not found` });
    }
  } catch (error) {
    logger.error(`Error en DELETE /obra/:id - ${error.message}`);
    res.status(500).json({ ok: false, msg: "Error interno del servidor" });
  }
});

export default router;
