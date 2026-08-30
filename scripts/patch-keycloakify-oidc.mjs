import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const targets = ["src/admin/KcPage.tsx", "src/account/KcPage.tsx"];

for (const path of targets) {
  if (!existsSync(path)) {
    console.log(`Skipping ${path}: not generated.`);
    continue;
  }

  const before = readFileSync(path, "utf8");
  let after = before;

  after = after.replace(/^import\s+\{\s*DPoP\s*\}\s+from\s+["']oidc-spa\/DPoP["'];?\s*$/gm, "");
  after = after.replace(/sessionRestorationMethod:\s*import\.meta\.env\.DEV\s*\?\s*["']full page redirect["']\s*:\s*["']auto["']/g, 'sessionRestorationMethod: "full page redirect"');
  after = after.replace(/sessionRestorationMethod:\s*["']auto["']/g, 'sessionRestorationMethod: "full page redirect"');
  after = after.replace(/\s*,?\s*\.\.\.DPoP\(\{\s*mode:\s*["']auto["']\s*\}\)\s*,?/g, "");

  if (after !== before) {
    writeFileSync(path, after);
    console.log(`Patched ${path} to disable DPoP auto mode.`);
  } else {
    console.log(`No DPoP auto-mode patch needed for ${path}.`);
  }
}

const emailOverrides = [
  ["overrides/email/template.ftl", "src/email/html/template.ftl"],
  ["overrides/email/theme.properties", "src/email/theme.properties"],
  ["overrides/email/corelink-mark.svg", "src/email/resources/corelink-mark.svg"]
];

for (const [source, destination] of emailOverrides) {
  if (!existsSync(source)) {
    throw new Error(`Missing email override source: ${source}`);
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, readFileSync(source));
  console.log(`Restored ${destination} from ${source}.`);
}
