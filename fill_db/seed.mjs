import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
import path from "path";

function leer_json(file) {
  return JSON.parse(readFileSync(file));
}

const prisma = new PrismaClient();
const obras = leer_json("./fill_db/data/info_obras.json");

// Función para descargar una imagen y guardarla localmente
async function descargarImagen(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  writeFileSync(filepath, buffer);
}

const imagenesDir = "./fill_db/data/imagenes";
mkdirSync(imagenesDir, { recursive: true });

// Función para generar un nombre de archivo válido a partir del título
function generarNombreArchivo(titulo) {
  return titulo.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".png";
}

// Insertar obras en la base de datos
console.log("🚀 Guardando obras en la base de datos...");
await Promise.all(
  obras.map(async (obra) => {
    const { titulo, descripcion, procedencia, comentario, imagen } = obra;
    console.log("📌 Insertando:", titulo);

    // Generar nombre de archivo basado en el título
    const imagenFilename = generarNombreArchivo(titulo);
    const imagenPath = path.join(imagenesDir, imagenFilename);
    await descargarImagen(imagen, imagenPath);

    await prisma.obra.create({
      data: {
        titulo,
        descripcion,
        procedencia,
        comentario,
        imagen: imagenPath,
      },
    });
  })
);

// Consultar y mostrar las obras guardadas
const todasLasObras = await prisma.obra.findMany();
console.log("📄 Obras guardadas en la base de datos:", todasLasObras);

await prisma.$disconnect();
