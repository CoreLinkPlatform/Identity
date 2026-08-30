ARG KEYCLOAK_VERSION=26.7.2

FROM node:22-bookworm AS theme-builder
WORKDIR /src

ARG KEYCLOAK_THEME_NAME=corelink
ARG VITE_BRAND_NAME=CoreLink
ARG VITE_BRAND_TAGLINE="Secure connected intelligence"
ARG VITE_BRAND_MARK=img/corelink-mark.svg

ENV VITE_BRAND_NAME=${VITE_BRAND_NAME}
ENV VITE_BRAND_TAGLINE=${VITE_BRAND_TAGLINE}
ENV VITE_BRAND_MARK=${VITE_BRAND_MARK}

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-17-jdk-headless maven \
    && rm -rf /var/lib/apt/lists/*

# Keycloakify's postinstall hook (`sync-extensions`) needs the Vite config and
# project sources to discover optional extensions such as email-native.
# Install only after the complete project has been copied into the build stage.
COPY . .
RUN npm install

RUN npm pkg set name="${KEYCLOAK_THEME_NAME}" \
    && npm run build:keycloak \
    && test -f dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar \
    && cp dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar /tmp/identity-theme.jar

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION} AS keycloak-builder
COPY --from=theme-builder /tmp/identity-theme.jar /opt/keycloak/providers/identity-theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}
COPY --from=keycloak-builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
