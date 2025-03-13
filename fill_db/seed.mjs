import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

function leer_json(file) {
  return JSON.parse(readFileSync(file));
}

const prisma = new PrismaClient();
const obras = leer_json("./fill_db/data/info_obras.json");

// Insertar obras en la base de datos
console.log("🚀 Guardando obras en la base de datos...");
await Promise.all(
  obras.map(async (obra) => {
    const { titulo, descripcion, procedencia, comentario, imagen } = obra;
    console.log("📌 Insertando:", titulo);
    await prisma.obra.create({
      data: { titulo, descripcion, procedencia, comentario, imagen },
    });
  })
);

// Consultar y mostrar las obras guardadas
const todasLasObras = await prisma.obra.findMany();
console.log("📄 Obras guardadas en la base de datos:", todasLasObras);

await prisma.$disconnect();
