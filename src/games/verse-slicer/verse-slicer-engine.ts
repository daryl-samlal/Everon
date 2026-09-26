export type FallSpeed = 'slow' | 'medium' | 'fast'

export type VerseSlicerConfig = {
  gameId?: string
  reference: string
  translation: string
  scrambledWords: string[]
  correctOrder: string[]
  speedSettings: { fallSpeed: FallSpeed; spawnIntervalMs: number }
}

export type SlicerWord = { id: string; text: string; left: number; lane: number }
export type SlicerState = {
  activeWords: SlicerWord[]
  nextIndex: number
  score: number
  combo: number
  lives: number
  timeRemaining: number
  status: 'playing' | 'complete' | 'game-over'
  feedback: 'correct' | 'wrong' | null
}

export const GAME_DURATION_SECONDS = 60
export const STARTING_LIVES = 3

export function createInitialState(): SlicerState {
  return { activeWords: [], nextIndex: 0, score: 0, combo: 0, lives: STARTING_LIVES, timeRemaining: GAME_DURATION_SECONDS, status: 'playing', feedback: null }
}

export function createWord(text: string, index: number): SlicerWord {
  return { id: `${index}-${text}`, text, left: 8 + ((index * 37) % 82), lane: index % 4 }
}

export function selectWord(state: SlicerState, word: SlicerWord, config: VerseSlicerConfig): SlicerState {
  if (state.status !== 'playing') return state
  const activeWords = state.activeWords.filter((activeWord) => activeWord.id !== word.id)
  if (word.text !== config.correctOrder[state.nextIndex]) {
    const lives = state.lives - 1
    return { ...state, activeWords, combo: 0, lives, feedback: 'wrong', status: lives === 0 ? 'game-over' : 'playing' }
  }
  const nextIndex = state.nextIndex + 1
  return { ...state, activeWords, nextIndex, score: state.score + 100 + state.combo * 25, combo: state.combo + 1, feedback: 'correct', status: nextIndex === config.correctOrder.length ? 'complete' : 'playing' }
}

export function tick(state: SlicerState): SlicerState {
  if (state.status !== 'playing') return state
  const timeRemaining = Math.max(0, state.timeRemaining - 1)
  return { ...state, timeRemaining, status: timeRemaining === 0 ? 'game-over' : 'playing', feedback: null }
}