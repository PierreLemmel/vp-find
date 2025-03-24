FROM oven/bun:latest  as base

WORKDIR /server

COPY package*.json ./
RUN bun install

COPY . .

# Bun automatically picks up index.ts or server.ts
CMD ["bun", "run", "index.ts"] # or server.ts, or a specific command