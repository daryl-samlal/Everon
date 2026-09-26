import sampleConfig from '@/games/connections/sample-config.json'

export type ConnectionsCategory = {
  name: string
  items: string[]
}

export type ConnectionsConfig = {
  gameId: string
  title: string
  categories: ConnectionsCategory[]
}

export const wildernessConnections: ConnectionsConfig = sampleConfig
