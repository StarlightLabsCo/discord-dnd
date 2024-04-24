/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as IndexImport } from './routes/index'
import { Route as LayoutLobbyImport } from './routes/_layout.lobby_'
import { Route as LayoutLobbyCharacterLayoutImport } from './routes/_layout.lobby.character._layout'
import { Route as LayoutLobbyCharacterLayoutSubraceImport } from './routes/_layout.lobby.character._layout.subrace'
import { Route as LayoutLobbyCharacterLayoutRaceImport } from './routes/_layout.lobby.character._layout.race'
import { Route as LayoutLobbyCharacterLayoutOriginImport } from './routes/_layout.lobby.character._layout.origin'
import { Route as LayoutLobbyCharacterLayoutLoreImport } from './routes/_layout.lobby.character._layout.lore'
import { Route as LayoutLobbyCharacterLayoutClassImport } from './routes/_layout.lobby.character._layout.class'
import { Route as LayoutLobbyCharacterLayoutBackgroundImport } from './routes/_layout.lobby.character._layout.background'
import { Route as LayoutLobbyCharacterLayoutAbilitiesImport } from './routes/_layout.lobby.character._layout.abilities'

// Create Virtual Routes

const LayoutLobbyCharacterImport = createFileRoute('/_layout/lobby/character')()

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutLobbyRoute = LayoutLobbyImport.update({
  path: '/lobby',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLobbyCharacterRoute = LayoutLobbyCharacterImport.update({
  path: '/lobby/character',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutLobbyCharacterLayoutRoute = LayoutLobbyCharacterLayoutImport.update(
  {
    id: '/_layout',
    getParentRoute: () => LayoutLobbyCharacterRoute,
  } as any,
)

const LayoutLobbyCharacterLayoutSubraceRoute =
  LayoutLobbyCharacterLayoutSubraceImport.update({
    path: '/subrace',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

const LayoutLobbyCharacterLayoutRaceRoute =
  LayoutLobbyCharacterLayoutRaceImport.update({
    path: '/race',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

const LayoutLobbyCharacterLayoutOriginRoute =
  LayoutLobbyCharacterLayoutOriginImport.update({
    path: '/origin',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

const LayoutLobbyCharacterLayoutLoreRoute =
  LayoutLobbyCharacterLayoutLoreImport.update({
    path: '/lore',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

const LayoutLobbyCharacterLayoutClassRoute =
  LayoutLobbyCharacterLayoutClassImport.update({
    path: '/class',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

const LayoutLobbyCharacterLayoutBackgroundRoute =
  LayoutLobbyCharacterLayoutBackgroundImport.update({
    path: '/background',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

const LayoutLobbyCharacterLayoutAbilitiesRoute =
  LayoutLobbyCharacterLayoutAbilitiesImport.update({
    path: '/abilities',
    getParentRoute: () => LayoutLobbyCharacterLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/lobby': {
      preLoaderRoute: typeof LayoutLobbyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/lobby/character': {
      preLoaderRoute: typeof LayoutLobbyCharacterImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/lobby/character/_layout': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutImport
      parentRoute: typeof LayoutLobbyCharacterRoute
    }
    '/_layout/lobby/character/_layout/abilities': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutAbilitiesImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
    '/_layout/lobby/character/_layout/background': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutBackgroundImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
    '/_layout/lobby/character/_layout/class': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutClassImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
    '/_layout/lobby/character/_layout/lore': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutLoreImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
    '/_layout/lobby/character/_layout/origin': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutOriginImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
    '/_layout/lobby/character/_layout/race': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutRaceImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
    '/_layout/lobby/character/_layout/subrace': {
      preLoaderRoute: typeof LayoutLobbyCharacterLayoutSubraceImport
      parentRoute: typeof LayoutLobbyCharacterLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  LayoutRoute.addChildren([
    LayoutLobbyRoute,
    LayoutLobbyCharacterRoute.addChildren([
      LayoutLobbyCharacterLayoutRoute.addChildren([
        LayoutLobbyCharacterLayoutAbilitiesRoute,
        LayoutLobbyCharacterLayoutBackgroundRoute,
        LayoutLobbyCharacterLayoutClassRoute,
        LayoutLobbyCharacterLayoutLoreRoute,
        LayoutLobbyCharacterLayoutOriginRoute,
        LayoutLobbyCharacterLayoutRaceRoute,
        LayoutLobbyCharacterLayoutSubraceRoute,
      ]),
    ]),
  ]),
])

/* prettier-ignore-end */
