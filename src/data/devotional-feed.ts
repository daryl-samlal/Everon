import type { Lesson } from '@/data/lesson'

export type FeedGame = {
  gameId: string
  engineType?: 'verse-slicer' | 'trivia' | 'pinpoint' | 'versele' | 'scribe-error' | 'connections'
  title: string
  description: string
  badge: string
  icon: string
  available?: boolean
}

export type FeedCard = {
  cardIndex: number
  type?: 'content' | 'game-grid'
  cardType?: 'textual' | 'image' | 'video' | 'game-grid'
  backgroundType: 'image' | 'video' | 'gradient'
  mediaUrl?: string
  cardTitle?: string
  cardSubtitle?: string
  overlayText?: { title?: string; reference?: string; hook?: string; insight?: string }
  games?: FeedGame[]
}

export type DevotionalPackage = {
  devotionalId: string
  title: string
  reference: string
  translation: string
  cards: FeedCard[]
}

export type DevotionalFeedPayload = DevotionalPackage

export function createDevotionalFeed(lesson: Lesson): DevotionalFeedPayload {
  if (lesson.cards?.length) return { devotionalId: lesson.lessonId, title: lesson.devotional.title, reference: lesson.reference, translation: lesson.translation, cards: lesson.cards }

  return {
    devotionalId: lesson.lessonId,
    title: lesson.devotional.title,
    reference: lesson.reference,
    translation: lesson.translation,
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
        mediaUrl: 'gradient-arcade-dark',
        cardTitle: 'Lock it in.',
        cardSubtitle: "Choose a game to lock in today's verse.",
        overlayText: { reference: `${lesson.reference} · ${lesson.translation}` },
        games: [
          { gameId: `verse-slicer-${lesson.lessonId}`, engineType: 'verse-slicer', title: 'Verse Slicer', description: 'Tap words in chronological order.', badge: 'Arcade', icon: '⚡' },
          { gameId: 'pinpoint-joseph-01', engineType: 'pinpoint', title: 'Pinpoint', description: 'Guess the biblical answer before the clues run out.', badge: 'Logic', icon: '◎' },
          { gameId: 'versele-prov-3-5', engineType: 'versele', title: 'Versele', description: 'Uncover every word in the memory verse.', badge: 'Words', icon: '▦' },
          { gameId: 'connections-wilderness-01', engineType: 'connections', title: 'Bible Connections', description: 'Group the theme words together.', badge: 'Puzzle', icon: '◈' },
        ],
      },
    ],
  }
}