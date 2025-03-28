import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Ruta para mostrar el formulario de login
router.get("/login", (req, res) => {
  res.render("login.njk");
});

// Ruta para manejar el login
router.post("/login", async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!user) {
      return res
        .status(401)
        .render("login.njk", { error: "Usuario o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
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

    res.locals.usuario = user.nombre;

    // Configurar la cookie con el token
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.IN === "production",
        maxAge: 7200000,
      })
      .render("index.njk");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("login.njk", { error: "Error interno del servidor" });
  }
});

// Ruta para manejar el logout
router.get("/logout", (req, res) => {
  res.clearCookie("access_token").redirect("/");
});

// Ruta para mostrar el formulario de registro
router.get("/registro", (req, res) => {
  res.render("registro.njk");
});

// Ruta para manejar el registro
router.post("/registro", async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    const existingUser = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (existingUser) {
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

    res.render("index.njk");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("registro.njk", { error: "Error interno del servidor" });
  }
});

export default router;
