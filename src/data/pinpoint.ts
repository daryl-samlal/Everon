import sampleConfig from '@/games/pinpoint/sample-config.json'

export type PinpointConfig = {
  gameId: string
  title: string
  category: string
  clues: string[]
  acceptedAnswers: string[]
  pointsPerClue: number[]
}

export const josephPinpoint: PinpointConfig = sampleConfig