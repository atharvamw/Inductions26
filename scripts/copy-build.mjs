import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inductionsDir = path.resolve(__dirname, "..");
const distDir = path.join(inductionsDir, "dist");
const rootDir = path.resolve(inductionsDir, "..");
const staticBuildsInductions = path.join(rootDir, "static-builds", "inductions");
const serverStaticBuildsInductions = path.join(rootDir, "csi-internal", "server", "static-builds", "inductions");

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(distDir)) {
  console.error("Error: dist directory does not exist. Run vite build first.");
  process.exit(1);
}

console.log("\n[Post-Build] Synchronizing static build output...");

// 1. Copy to root static-builds/inductions
if (fs.existsSync(staticBuildsInductions)) {
  fs.rmSync(staticBuildsInductions, { recursive: true, force: true });
}
copyDirectory(distDir, staticBuildsInductions);
console.log(`✓ Copied to: ${staticBuildsInductions}`);

// 2. Copy to server/static-builds/inductions
if (fs.existsSync(serverStaticBuildsInductions)) {
  fs.rmSync(serverStaticBuildsInductions, { recursive: true, force: true });
}
copyDirectory(distDir, serverStaticBuildsInductions);
console.log(`✓ Copied to: ${serverStaticBuildsInductions}`);

console.log("\n=================================================");
console.log("  Inductions Static Build Ready for Deployment!  ");
console.log("=================================================");
console.log(`Deployable folder: ${distDir}`);
console.log(`Static builds:     ${staticBuildsInductions}`);
console.log("Backend domain:    https://csicoep.pp.ua");
console.log("=================================================\n");
