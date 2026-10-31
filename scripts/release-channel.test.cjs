"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { classifyVersion, githubOutputs } = require("./release-channel.cjs");

for (const version of ["1.0.0", "1.2.3", "0.1.0"]) {
  test(`stable ${version} publishes the version and latest image tags`, () => {
    const channel = classifyVersion(version);
    assert.equal(channel.prerelease, false);
    assert.deepEqual(channel.imageTags, [
      `ghcr.io/corelinkplatform/identity:v${version}`,
      "ghcr.io/corelinkplatform/identity:latest",
    ]);
    assert.match(githubOutputs(channel), /prerelease=false/);
  });
}

for (const version of ["1.1.0-alpha.1", "1.1.0-beta.2", "1.1.0-rc.3", "1.1.0-dev.4"]) {
  test(`prerelease ${version} does not overwrite latest`, () => {
    const channel = classifyVersion(version);
    assert.equal(channel.prerelease, true);
    assert.deepEqual(channel.imageTags, [`ghcr.io/corelinkplatform/identity:v${version}`]);
    assert.match(githubOutputs(channel), /prerelease=true/);
  });
}

for (const version of ["v1.0.0", "1.0", "01.2.3", "1.2.3-alpha..1", "1.2.3-01", "1.2.3-rc.01", "1.2.3-", "1.2.3+build-7", "1.2.3-rc.1+build"]) {
  test(`invalid version ${version} is rejected`, () => {
    assert.throws(() => classifyVersion(version), /Invalid/);
  });
}
