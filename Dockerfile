FROM oven/bun:1 as base
WORKDIR /usr/src/app

RUN apt update \
    && apt install -y curl

# Install nodejs using n
ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY . .
ARG DATABASE_URL
RUN cd ./apps/server && bun install --frozen-lockfile && cd /usr/src/app

ENV NODE_ENV=production
# RUN bunx prisma generate
RUN bunx turbo run build --filter=server

CMD bunx turbo run start --filter=server
