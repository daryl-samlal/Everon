import sampleConfig from '@/games/versele/sample-config.json'

export type VerseleConfig = {
  gameId: string
  reference: string
  translation: string
  targetWords: string[]
}

export const proverbsVersele: VerseleConfig = sampleConfig
