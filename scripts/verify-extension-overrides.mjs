import { readFileSync } from "node:fs";

const checks = [
  {
    path: "src/admin/KcPage.tsx",
    mustInclude: ["full page redirect"],
    mustNotInclude: ["DPoP", "mode: \"auto\"", "sessionRestorationMethod: import.meta.env.DEV ? \"full page redirect\" : \"auto\""]
  },
  {
    path: "src/account/KcPage.tsx",
    mustInclude: ["full page redirect"],
    mustNotInclude: ["DPoP", "mode: \"auto\"", "sessionRestorationMethod: import.meta.env.DEV ? \"full page redirect\" : \"auto\""]
  },
  {
    path: "src/admin/KcAdminUi.tsx",
    mustInclude: ["CoreLink", "corelink-admin.css"],
    mustNotInclude: []
  },
  {
    path: "src/account/KcAccountUi.tsx",
    mustInclude: ["CoreLink", "corelink-account.css"],
    mustNotInclude: []
  },
  {
    path: "src/email/html/template.ftl",
    mustInclude: ["CoreLink"],
    mustNotInclude: []
  }
];

let failed = false;

for (const check of checks) {
  const content = readFileSync(check.path, "utf8");

  for (const needle of check.mustInclude) {
    if (!content.includes(needle)) {
      console.error(`ERROR: ${check.path} is missing required marker: ${needle}`);
      failed = true;
    }
  }

  for (const needle of check.mustNotInclude) {
    if (content.includes(needle)) {
      console.error(`ERROR: ${check.path} contains forbidden upstream marker: ${needle}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("CoreLink extension overrides verified.");
