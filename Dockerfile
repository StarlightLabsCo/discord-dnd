FROM oven/bun:1 as base
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apt update \
    && apt install -y curl

ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY . .

ARG DATABASE_URL
RUN bun install --production --frozen-lockfile
RUN bunx turbo run db:generate
RUN bun build --compile --minify ./apps/server/index.ts --outfile server

CMD ./server