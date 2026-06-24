# syntax=docker/dockerfile:1.7

FROM node:26-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /repo

RUN npm install --global pnpm@11.8.0

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build

FROM node:26-slim AS runner

ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=8088

WORKDIR /app

COPY --from=builder --chown=node:node /repo/apps/web/.output ./.output

USER node

EXPOSE 8088

CMD ["node", ".output/server/index.mjs"]
