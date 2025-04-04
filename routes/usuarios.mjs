import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import logger from "../logger.mjs";

const router = express.Router();
const prisma = new PrismaClient();

// Ruta para mostrar el formulario de login
router.get("/login", (req, res) => {
  res.render("login.njk");
});

// Ruta para manejar el login
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;
  logger.info(`Intentando iniciar sesión para el correo: ${correo}`);

  try {
    // Buscar el usuario en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!user) {
      logger.warn(`Usuario no encontrado: ${correo}`);
      return res
        .status(401)
        .render("login.njk", { error: "Usuario o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Contraseña incorrecta para el usuario: ${correo}`);
      return res
        .status(401)
        .render("login.njk", { error: "Usuario o contraseña incorrectos" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { usuario: user.nombre, correo: user.correo, rol: user.rol },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );

    logger.info(`Usuario autenticado: ${correo}`);
    res.locals.usuario = user.nombre;

    // Configurar la cookie con el token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === "production",
      maxAge: 7200000,
    });
    res.redirect("/");
  } catch (error) {
    logger.error("Error interno del servidor:", error);
    res
      .status(500)
      .render("login.njk", { error: "Error interno del servidor" });
  }
});

// Ruta para manejar el logout
router.get("/logout", (req, res) => {
  logger.info("Cerrando sesión");
  res.clearCookie("access_token").redirect("/");
});

// Ruta para mostrar el formulario de registro
router.get("/registro", (req, res) => {
  res.render("registro.njk");
});

// Ruta para manejar el registro
router.post("/registro", async (req, res) => {
  const { nombre, correo, password } = req.body;
  logger.info(`Intentando registrar usuario: ${correo}`);

  try {
    const existingUser = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
      logger.warn(`El usuario ya existe: ${correo}`);
      return res
        .status(400)
        .render("registro.njk", { error: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario en la base de datos
    await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: hashedPassword,
      },
    });

    logger.info(`Usuario registrado exitosamente: ${correo}`);
    res.redirect("/");
  } catch (error) {
    logger.error("Error interno del servidor:", error);
    res
      .status(500)
      .render("registro.njk", { error: "Error interno del servidor" });
  }
});

export default router;
