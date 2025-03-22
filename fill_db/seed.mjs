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

const imagenesDir = "./images";
mkdirSync(imagenesDir, { recursive: true });

// Función para generar un nombre de archivo válido a partir del título
function generarNombreArchivo(titulo) {
  return titulo.toLowerCase().replace(/[^a-z0-9]/g, "_") + ".png";
}

// Función para eliminar el contenido de la base de datos
async function eliminarContenidoBD() {
  console.log("🗑️ Eliminando contenido de la base de datos...");
  await prisma.obra.deleteMany({});
}

// Eliminar contenido de la base de datos antes de insertar nuevas obras
await eliminarContenidoBD();

// Insertar obras en la base de datos
console.log("🚀 Guardando obras en la base de datos...");
await Promise.all(
  obras.map(async (obra) => {
    const { titulo, descripcion, procedencia, comentario, imagen } = obra;
    console.log("📌 Insertando:", titulo);

    // Generar nombre de archivo basado en el título
    const imagenFilename = generarNombreArchivo(titulo);
    const imagenPath = path.join(imagenesDir, imagenFilename);
    //await descargarImagen(imagen, imagenPath);

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

await prisma.$disconnect();
