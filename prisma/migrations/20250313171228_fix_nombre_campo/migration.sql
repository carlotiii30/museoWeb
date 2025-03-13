/*
  Warnings:

  - You are about to drop the column `descripción` on the `Obra` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Obra` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "procedencia" TEXT NOT NULL,
    "comentario" TEXT NOT NULL
);
INSERT INTO "new_Obra" ("comentario", "id", "imagen", "procedencia", "titulo") SELECT "comentario", "id", "imagen", "procedencia", "titulo" FROM "Obra";
DROP TABLE "Obra";
ALTER TABLE "new_Obra" RENAME TO "Obra";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
