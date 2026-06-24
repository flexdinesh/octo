FROM node:26-slim

WORKDIR /app

RUN npm install --global pnpm@11.8.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --prod --filter api --frozen-lockfile

COPY apps/api apps/api

WORKDIR /app/apps/api

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
