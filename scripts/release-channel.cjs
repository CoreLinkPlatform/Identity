"use strict";

const fs = require("node:fs");

const IMAGE = "ghcr.io/corelinkplatform/identity";

// A version is supplied without its leading v; tag/package equality is checked
// separately by the release workflow. Build metadata (+...) is disallowed
// because Docker/OCI image tags cannot contain '+'.
function classifyVersion(version) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.exec(version || "");
  if (!match) {
    throw new Error(`Invalid SemVer version: ${version}`);
  }
  const identifiers = match[4]?.split(".") || [];
  if (identifiers.some((part) => /^\d+$/.test(part) && part.length > 1 && part.startsWith("0"))) {
    throw new Error(`Invalid numeric prerelease identifier: ${version}`);
  }
  const prerelease = identifiers.length > 0;
  const imageTags = [`${IMAGE}:v${version}`];
  if (!prerelease) {
    imageTags.push(`${IMAGE}:latest`);
  }
  return { prerelease, imageTags };
}

function githubOutputs(channel) {
  return [
    `prerelease=${channel.prerelease}`,
    "image_tags<<CORELINK_IMAGE_TAGS",
    ...channel.imageTags,
    "CORELINK_IMAGE_TAGS",
    "",
  ].join("\n");
}

if (require.main === module) {
  try {
    const output = githubOutputs(classifyVersion(process.argv[2]));
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
    } else {
      process.stdout.write(output);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { classifyVersion, githubOutputs };
