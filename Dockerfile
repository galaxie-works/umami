ARG NODE_IMAGE_VERSION="22-alpine"
ARG PNPM_VERSION="10.33.3"

# Install dependencies only when needed
FROM node:${NODE_IMAGE_VERSION} AS deps
ARG PNPM_VERSION
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:${NODE_IMAGE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY docker/proxy.ts ./src

ARG BASE_PATH

ENV BASE_PATH=$BASE_PATH
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/dummy"

RUN npm run build-docker

FROM node:${NODE_IMAGE_VERSION} AS script-deps
ARG PRISMA_VERSION="7.3.0"
ARG PNPM_VERSION
WORKDIR /runtime-deps
RUN npm install -g pnpm@${PNPM_VERSION}
RUN pnpm --allow-build='@prisma/engines' --allow-build='prisma' add \
    npm-run-all@4.1.5 \
    dotenv@17.3.1 \
    chalk@5.6.2 \
    semver@7.7.4 \
    @prisma/config@${PRISMA_VERSION} \
    prisma@${PRISMA_VERSION} \
    @prisma/client@${PRISMA_VERSION} \
    @prisma/adapter-pg@${PRISMA_VERSION}

# Production image, copy all the files and run next
FROM node:${NODE_IMAGE_VERSION} AS runner
WORKDIR /app

ARG PRISMA_VERSION="7.3.0"
ARG PNPM_VERSION
ARG NODE_OPTIONS

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN set -x \
    && apk add --no-cache curl \
    && npm install -g pnpm@${PNPM_VERSION}

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/generated ./generated

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Script dependencies must be installed after the standalone copy because the
# traced node_modules tree can replace packages needed by start-docker scripts.
COPY --from=script-deps /runtime-deps/node_modules/.bin ./node_modules/.bin
COPY --from=script-deps /runtime-deps/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=script-deps /runtime-deps/node_modules/@prisma ./node_modules/@prisma
COPY --from=script-deps /runtime-deps/node_modules/chalk ./node_modules/chalk
COPY --from=script-deps /runtime-deps/node_modules/dotenv ./node_modules/dotenv
COPY --from=script-deps /runtime-deps/node_modules/npm-run-all ./node_modules/npm-run-all
COPY --from=script-deps /runtime-deps/node_modules/prisma ./node_modules/prisma
COPY --from=script-deps /runtime-deps/node_modules/semver ./node_modules/semver

USER nextjs

EXPOSE 3000

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

CMD ["pnpm", "start-docker"]
