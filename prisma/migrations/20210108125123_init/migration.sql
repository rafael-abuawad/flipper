-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "published" BOOLEAN DEFAULT false,
    "title" TEXT NOT NULL,
    "content" TEXT
);
