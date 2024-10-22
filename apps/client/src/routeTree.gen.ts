/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LobbyImport } from './routes/lobby'
import { Route as GameImport } from './routes/game'
import { Route as IndexImport } from './routes/index'
import { Route as LobbyIndexImport } from './routes/lobby.index'
import { Route as LobbyCharacterImport } from './routes/lobby.character'
import { Route as LobbyCharacterSubraceImport } from './routes/lobby.character.subrace'
import { Route as LobbyCharacterRaceImport } from './routes/lobby.character.race'
import { Route as LobbyCharacterOriginImport } from './routes/lobby.character.origin'
import { Route as LobbyCharacterLoreImport } from './routes/lobby.character.lore'
import { Route as LobbyCharacterClassImport } from './routes/lobby.character.class'
import { Route as LobbyCharacterBackgroundImport } from './routes/lobby.character.background'
import { Route as LobbyCharacterAbilitiesImport } from './routes/lobby.character.abilities'

// Create/Update Routes

const LobbyRoute = LobbyImport.update({
  path: '/lobby',
  getParentRoute: () => rootRoute,
} as any)

const GameRoute = GameImport.update({
  path: '/game',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LobbyIndexRoute = LobbyIndexImport.update({
  path: '/',
  getParentRoute: () => LobbyRoute,
} as any)

const LobbyCharacterRoute = LobbyCharacterImport.update({
  path: '/character',
  getParentRoute: () => LobbyRoute,
} as any)

const LobbyCharacterSubraceRoute = LobbyCharacterSubraceImport.update({
  path: '/subrace',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

const LobbyCharacterRaceRoute = LobbyCharacterRaceImport.update({
  path: '/race',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

const LobbyCharacterOriginRoute = LobbyCharacterOriginImport.update({
  path: '/origin',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

const LobbyCharacterLoreRoute = LobbyCharacterLoreImport.update({
  path: '/lore',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

const LobbyCharacterClassRoute = LobbyCharacterClassImport.update({
  path: '/class',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

const LobbyCharacterBackgroundRoute = LobbyCharacterBackgroundImport.update({
  path: '/background',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

const LobbyCharacterAbilitiesRoute = LobbyCharacterAbilitiesImport.update({
  path: '/abilities',
  getParentRoute: () => LobbyCharacterRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/game': {
      preLoaderRoute: typeof GameImport
      parentRoute: typeof rootRoute
    }
    '/lobby': {
      preLoaderRoute: typeof LobbyImport
      parentRoute: typeof rootRoute
    }
    '/lobby/character': {
      preLoaderRoute: typeof LobbyCharacterImport
      parentRoute: typeof LobbyImport
    }
    '/lobby/': {
      preLoaderRoute: typeof LobbyIndexImport
      parentRoute: typeof LobbyImport
    }
    '/lobby/character/abilities': {
      preLoaderRoute: typeof LobbyCharacterAbilitiesImport
      parentRoute: typeof LobbyCharacterImport
    }
    '/lobby/character/background': {
      preLoaderRoute: typeof LobbyCharacterBackgroundImport
      parentRoute: typeof LobbyCharacterImport
    }
    '/lobby/character/class': {
      preLoaderRoute: typeof LobbyCharacterClassImport
      parentRoute: typeof LobbyCharacterImport
    }
    '/lobby/character/lore': {
      preLoaderRoute: typeof LobbyCharacterLoreImport
      parentRoute: typeof LobbyCharacterImport
    }
    '/lobby/character/origin': {
      preLoaderRoute: typeof LobbyCharacterOriginImport
      parentRoute: typeof LobbyCharacterImport
    }
    '/lobby/character/race': {
      preLoaderRoute: typeof LobbyCharacterRaceImport
      parentRoute: typeof LobbyCharacterImport
    }
    '/lobby/character/subrace': {
      preLoaderRoute: typeof LobbyCharacterSubraceImport
      parentRoute: typeof LobbyCharacterImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  GameRoute,
  LobbyRoute.addChildren([
    LobbyCharacterRoute.addChildren([
      LobbyCharacterAbilitiesRoute,
      LobbyCharacterBackgroundRoute,
      LobbyCharacterClassRoute,
      LobbyCharacterLoreRoute,
      LobbyCharacterOriginRoute,
      LobbyCharacterRaceRoute,
      LobbyCharacterSubraceRoute,
    ]),
    LobbyIndexRoute,
  ]),
])

/* prettier-ignore-end */
