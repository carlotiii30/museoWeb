-- CreateTable
CREATE TABLE "Obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripción" TEXT NOT NULL,
    "procedencia" TEXT NOT NULL,
    "comentario" TEXT NOT NULL
);
