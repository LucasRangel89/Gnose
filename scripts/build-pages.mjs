import { spawn } from "node:child_process";
import { access, mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "src/app/api");
const hiddenApiDir = path.join(root, "src/.api-disabled-for-pages");
let apiMoved = false;

try {
  await access(apiDir);
  await rename(apiDir, hiddenApiDir);
  apiMoved = true;
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

try {
  const result = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_PUBLIC_GITHUB_PAGES: "true",
        NEXT_PUBLIC_AUTH_ENABLED: "false",
        AUTH_REQUIRED: "false",
        DATABASE_URL: "file:./pages.db",
      },
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });

  if (result.code !== 0) {
    throw new Error(`Next.js static export failed (exit ${result.code ?? result.signal}).`);
  }

  await mkdir(path.join(root, "out"), { recursive: true });
  await writeFile(path.join(root, "out/.nojekyll"), "");
  console.log("GitHub Pages files generated in ./out (read-only, base path /Gnose).");
} finally {
  if (apiMoved) await rename(hiddenApiDir, apiDir);
}
