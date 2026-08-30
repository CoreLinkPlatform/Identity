#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <version-or-tag>" >&2
  exit 2
fi

VERSION="${1#v}"
GROUP_PATH="ir/coreplatform/identity-theme/${VERSION}"
ROOT_DIR="central-bundle"
OUT_DIR="${ROOT_DIR}/${GROUP_PATH}"
ARTIFACT="identity-theme-${VERSION}"
MAIN_SOURCE="dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar"

: "${GPG_PASSPHRASE:?GPG_PASSPHRASE is required}"

if [[ ! -f "${MAIN_SOURCE}" ]]; then
  echo "missing ${MAIN_SOURCE}; run npm run build:keycloak first" >&2
  exit 1
fi

rm -rf "${ROOT_DIR}" central-bundle.zip
mkdir -p "${OUT_DIR}" .central-placeholder

cp "${MAIN_SOURCE}" "${OUT_DIR}/${ARTIFACT}.jar"
sed "s/@VERSION@/${VERSION}/g" maven/pom.xml.template > "${OUT_DIR}/${ARTIFACT}.pom"

cat > .central-placeholder/README.md <<'EOF'
# CoreLink Identity Theme

This artifact is a packaged Keycloak theme. Source code and documentation are maintained in the CoreLinkPlatform/Identity repository.
EOF

jar --create --file "${OUT_DIR}/${ARTIFACT}-sources.jar" -C .central-placeholder README.md
jar --create --file "${OUT_DIR}/${ARTIFACT}-javadoc.jar" -C .central-placeholder README.md

for file in \
  "${OUT_DIR}/${ARTIFACT}.jar" \
  "${OUT_DIR}/${ARTIFACT}-sources.jar" \
  "${OUT_DIR}/${ARTIFACT}-javadoc.jar" \
  "${OUT_DIR}/${ARTIFACT}.pom"; do
  gpg --batch --yes --pinentry-mode loopback \
    --passphrase "${GPG_PASSPHRASE}" \
    --armor --detach-sign "${file}"

  md5sum "${file}" | awk '{print $1}' > "${file}.md5"
  sha1sum "${file}" | awk '{print $1}' > "${file}.sha1"
  sha256sum "${file}" | awk '{print $1}' > "${file}.sha256"
  sha512sum "${file}" | awk '{print $1}' > "${file}.sha512"
done

(
  cd "${ROOT_DIR}"
  zip -qr ../central-bundle.zip ir
)

rm -rf .central-placeholder

echo "Built central-bundle.zip for ir.coreplatform:identity-theme:${VERSION}"
