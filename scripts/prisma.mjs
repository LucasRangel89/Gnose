import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const schemaFlag = args.indexOf("--schema");
let schema = process.env.PRISMA_SCHEMA || "prisma/schema.prisma";
if (schemaFlag !== -1) {
  schema = args[schemaFlag + 1] || schema;
  args.splice(schemaFlag, 2);
}

const prismaEntrypoint = resolve("node_modules/prisma/build/index.js");
const result = spawnSync(
  process.execPath,
  [prismaEntrypoint, ...args, "--schema", schema],
  { stdio: "inherit", env: process.env },
);

if (result.error) {
  console.error(`Não foi possível executar Prisma: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
