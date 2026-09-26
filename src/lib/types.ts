export type GameId = 'trivia'

export type Question = {
  id: number
  prompt: string
  reference: string
  answers: string[]
  correctAnswer: string
}

export type ScoreEntry = {
  name: string
  score: number
  badge: string
}
