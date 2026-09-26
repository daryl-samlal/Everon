import sampleConfig from '@/games/scribe-error/sample-config.json'

export type ScribeError = {
  wordIndex: number
  corruptedWord: string
  correctWord: string
}

export type ScribeErrorConfig = {
  gameId: string
  reference: string
  corruptedText: string[]
  errors: ScribeError[]
}

export const psalm23ScribeError: ScribeErrorConfig = sampleConfig