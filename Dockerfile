ARG KEYCLOAK_VERSION=26.7.2

FROM node:22-alpine AS theme-builder
WORKDIR /src
ARG KEYCLOAK_THEME_NAME=corelink
ARG VITE_BRAND_NAME=CoreLink
ARG VITE_BRAND_TAGLINE="Secure connected intelligence"
ENV KEYCLOAK_THEME_NAME=${KEYCLOAK_THEME_NAME}
ENV VITE_BRAND_NAME=${VITE_BRAND_NAME}
ENV VITE_BRAND_TAGLINE=${VITE_BRAND_TAGLINE}
COPY package.json ./
RUN npm pkg set name="${KEYCLOAK_THEME_NAME}" && npm install
COPY . .
RUN npm run build:keycloak \
    && cp dist_keycloak/*-26.2-and-above.jar /tmp/identity-theme.jar

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION} AS keycloak-builder
COPY --from=theme-builder /tmp/identity-theme.jar /opt/keycloak/providers/identity-theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}
COPY --from=keycloak-builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
