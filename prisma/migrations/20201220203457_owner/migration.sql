/*
  Warnings:

  - You are about to drop the column `phone` on the `Owner` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "phoneNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "ownerId" INTEGER,

    FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT
);
INSERT INTO "new_Owner" ("id", "name", "email") SELECT "id", "name", "email" FROM "Owner";
DROP TABLE "Owner";
ALTER TABLE "new_Owner" RENAME TO "Owner";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
