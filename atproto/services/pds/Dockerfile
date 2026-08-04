# NOTE there is an additional build stage below that should match
FROM node:24.18-alpine3.23 AS build

RUN npm install -g pnpm@11.11.0

WORKDIR /app

COPY ./.npmrc ./
COPY ./.nvmrc ./
COPY ./package.json ./

# Move files into the image and install
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./tsconfig ./tsconfig
COPY ./lexicons ./lexicons
COPY ./packages/internal ./packages/internal
COPY ./packages/lex ./packages/lex

# NOTE pds's transitive dependencies go here: if that changes, this needs to be updated.
# pnpm list --filter '@atproto/pds...' --depth 0 --json | jq '.[].path' | grep -v "/lex/" | grep -v "/internal/" | grep -v 'packages/pds"' | sort -u | sed "s|\"$PWD/|./|; s|\"\$||"
COPY ./packages/api ./packages/api
COPY ./packages/aws ./packages/aws
COPY ./packages/bsky ./packages/bsky
COPY ./packages/common-web ./packages/common-web
COPY ./packages/common ./packages/common
COPY ./packages/crypto ./packages/crypto
COPY ./packages/did ./packages/did
COPY ./packages/identity ./packages/identity
COPY ./packages/lex-cli ./packages/lex-cli
COPY ./packages/lexicon ./packages/lexicon
COPY ./packages/oauth/jwk-jose ./packages/oauth/jwk-jose
COPY ./packages/oauth/jwk-webcrypto ./packages/oauth/jwk-webcrypto
COPY ./packages/oauth/jwk ./packages/oauth/jwk
COPY ./packages/oauth/oauth-client-browser-example ./packages/oauth/oauth-client-browser-example
COPY ./packages/oauth/oauth-client-browser ./packages/oauth/oauth-client-browser
COPY ./packages/oauth/oauth-client ./packages/oauth/oauth-client
COPY ./packages/oauth/oauth-provider-api ./packages/oauth/oauth-provider-api
COPY ./packages/oauth/oauth-provider-ui ./packages/oauth/oauth-provider-ui
COPY ./packages/oauth/oauth-provider ./packages/oauth/oauth-provider
COPY ./packages/oauth/oauth-scopes ./packages/oauth/oauth-scopes
COPY ./packages/oauth/oauth-types ./packages/oauth/oauth-types
COPY ./packages/repo ./packages/repo
COPY ./packages/sync ./packages/sync
COPY ./packages/syntax ./packages/syntax
COPY ./packages/ws-client ./packages/ws-client
COPY ./packages/xrpc-server ./packages/xrpc-server
COPY ./packages/xrpc ./packages/xrpc

COPY ./packages/pds ./packages/pds

# bsync is not a runtime dep but bsky's codegen:buf reads ../bsync/proto at build time
COPY ./packages/bsync ./packages/bsync

COPY ./services/pds ./services/pds

# install all deps
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
  PUPPETEER_SKIP_DOWNLOAD=true pnpm install --frozen-lockfile
# Materialize the JWK declarations first because downstream workspace packages
# resolve its declared dist export during the recursive build.
RUN pnpm --filter '@atproto/jwk' build \
  && test -f packages/oauth/jwk/dist/index.d.ts \
  && pnpm run --recursive --stream --filter '@atproto/pds...' build
# services/pds (pds-service) is a downstream consumer of @atproto/pds, not
# one of its dependencies, so the '@atproto/pds...' filter above never
# builds it - it has its own tsgo build (see tsconfig.build.json), same as
# the root Makefile's pds-build target already does as a separate step.
RUN pnpm --filter pds-service build
# install only prod deps, hoisted to root node_modules dir
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm install --prod --shamefully-hoist --frozen-lockfile --prefer-offline --config.confirmModulesPurge=false

# Uses assets from build stage to reduce build size
FROM node:24.18-alpine3.23

RUN apk add --update dumb-init

# Avoid zombie processes, handle signal forwarding
ENTRYPOINT ["dumb-init", "--"]

COPY --from=build /app /app
WORKDIR /app/services/pds

RUN mkdir /app/data && chown node /app/data
VOLUME /app/data

EXPOSE 3000
ENV PDS_PORT=3000
ENV NODE_ENV=production
# potential perf issues w/ io_uring on this version of node
ENV UV_USE_IO_URING=0

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node
CMD ["node", "--heapsnapshot-signal=SIGUSR2", "--enable-source-maps", "--import=./dist/tracer.js", "dist/index.js"]

LABEL org.opencontainers.image.source=https://github.com/bluesky-social/atproto
LABEL org.opencontainers.image.description="ATP Personal Data Server (PDS)"
LABEL org.opencontainers.image.licenses=MIT
