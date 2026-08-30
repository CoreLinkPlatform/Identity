import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { spawnSync } from "node:child_process";

/*
 * keycloakify sync-extensions may run npm install when extension dependencies
 * change. npm then executes this project's postinstall hook again. Guard that
 * nested invocation so synchronization happens exactly once per install.
 */
if (process.env.CORELINK_SYNC_IN_PROGRESS === "1") {
  console.log("Skipping nested Keycloakify extension sync.");
  process.exit(0);
}

const ownedFiles = [
  "src/admin/KcPage.tsx",
  "src/admin/KcAdminUi.tsx",
  "src/admin/PageHeader.tsx",
  "src/admin/corelink-admin.css",
  "src/account/KcPage.tsx",
  "src/account/KcAccountUi.tsx",
  "src/account/root/Header.tsx",
  "src/account/corelink-account.css",
  "src/email/theme.properties",
  "src/email/html/template.ftl",
  "src/email/resources/corelink-mark.svg"
];

const snapshots = new Map();

for (const path of ownedFiles) {
  if (existsSync(path)) {
    snapshots.set(path, readFileSync(path));
  }
}

const result = spawnSync("keycloakify", ["sync-extensions"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    CORELINK_SYNC_IN_PROGRESS: "1"
  }
});

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

for (const [path, content] of snapshots) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

console.log(`Restored ${snapshots.size} CoreLink-owned extension files after Keycloakify sync.`);
