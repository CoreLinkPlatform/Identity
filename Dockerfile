ARG KEYCLOAK_VERSION=26.7.2

FROM node:22-alpine AS theme-builder
WORKDIR /src
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build:keycloak

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION} AS keycloak-builder
COPY --from=theme-builder /src/dist_keycloak/corelink-26.2-and-above.jar /opt/keycloak/providers/corelink-theme.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}
COPY --from=keycloak-builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--optimized"]
