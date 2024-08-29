# Build Stage 1
# Compile frontend component
#
FROM node:alpine3.19 AS appbuild1

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# base grafana image
FROM grafana/grafana:10.0.3

ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=aveva-eds-datasource
WORKDIR /var/lib/grafana/plugins/aveva-eds-datasource
COPY --from=appbuild1 /usr/src/app/dist ./dist
COPY package.json .