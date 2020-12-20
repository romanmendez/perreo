/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `dogId` on the `Owner` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Owner` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_DogToOwner" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    FOREIGN KEY ("A") REFERENCES "Dog"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" TEXT
);
INSERT INTO "new_Owner" ("id", "name", "email") SELECT "id", "name", "email" FROM "Owner";
DROP TABLE "Owner";
ALTER TABLE "new_Owner" RENAME TO "Owner";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_DogToOwner_AB_unique" ON "_DogToOwner"("A", "B");

-- CreateIndex
CREATE INDEX "_DogToOwner_B_index" ON "_DogToOwner"("B");
