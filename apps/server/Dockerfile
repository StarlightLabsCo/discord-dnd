FROM oven/bun:1 as base
WORKDIR /usr/src/app

RUN apt update \
    && apt install -y curl

ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY . .
ARG DATABASE_URL
RUN bun install --frozen-lockfile

ENV NODE_ENV=production

CMD bunx turbo run start --filter=server
