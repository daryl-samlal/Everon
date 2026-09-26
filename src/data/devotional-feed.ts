import type { Lesson } from '@/data/lesson'

export type FeedGame = {
  gameId: string
  title: string
  description: string
  badge: string
  icon: string
  available: boolean
}

export type FeedCard = {
  cardIndex: number
  type: 'content' | 'game-grid'
  backgroundType: 'image' | 'video' | 'gradient'
  mediaUrl?: string
  overlayText?: { title?: string; reference?: string; hook?: string; insight?: string }
  games?: FeedGame[]
}

export type DevotionalFeedPayload = {
  devotionalId: string
  title: string
  cards: FeedCard[]
}

export function createDevotionalFeed(lesson: Lesson): DevotionalFeedPayload {
  return {
    devotionalId: lesson.lessonId,
    title: lesson.devotional.title,
    cards: [
      {
        cardIndex: 1,
        type: 'content',
        backgroundType: 'gradient',
        mediaUrl: 'gradient-trust',
        overlayText: { title: lesson.devotional.title, reference: `${lesson.reference} · ${lesson.translation}`, hook: lesson.devotional.hook },
      },
      {
        cardIndex: 2,
        type: 'content',
        backgroundType: 'gradient',
        mediaUrl: 'gradient-insight',
        overlayText: { insight: lesson.devotional.insight },
      },
      {
        cardIndex: 3,
        type: 'game-grid',
        backgroundType: 'gradient',
        mediaUrl: 'gradient-games',
        games: [
          { gameId: `verse-slicer-${lesson.lessonId}`, title: 'Verse Slicer', description: 'Tap words in chronological order.', badge: 'Arcade', icon: '⚡', available: true },
          { gameId: `trivia-${lesson.lessonId}`, title: 'Bible Trivia', description: 'Test what stayed with you.', badge: 'Quiz', icon: '✦', available: true },
          { gameId: `connections-${lesson.lessonId}`, title: 'Bible Connections', description: 'Group the theme words together.', badge: 'Puzzle', icon: '◈', available: false },
        ],
      },
    ],
  }
}