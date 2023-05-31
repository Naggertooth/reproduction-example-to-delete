-- CreateTable
CREATE TABLE "RoleNames"
(
  "id" bigserial NOT NULL,
  "name" text NOT NULL,
  CONSTRAINT "RoleNames_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RoleNames_name_key" UNIQUE ("name")
);

-- CreateTable
CREATE TABLE "Roles"
(
  "userId" TEXT NOT NULL,
  "roleId" bigint NOT NULL,
  CONSTRAINT "Roles_pkey" PRIMARY KEY ("userId", "roleId"),
  CONSTRAINT "Roles_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES "User" ("id") MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT "Roles_roleId_fkey" FOREIGN KEY ("roleId")
      REFERENCES "RoleNames" ("id") MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
);

-- UpdateTable User
ALTER TABLE "User"
  DROP COLUMN IF EXISTS "role";

-- Seed data into RoleNames
INSERT INTO "RoleNames"
  VALUES(DEFAULT, 'ADMIN');

-- Seed data into Roles
INSERT INTO "Roles"
  SELECT u.id, rn.id from "User" u, "RoleNames" rn WHERE rn.name = 'ADMIN';

DROP TYPE "UserRole";
