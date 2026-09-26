import type { VerseSlicerConfig } from '@/games/verse-slicer/verse-slicer-engine'

export type Lesson = {
  lessonId: string
  reference: string
  translation: string
  devotional: { title: string; hook: string; insight: string }
  game: VerseSlicerConfig
}

export const featuredLesson: Lesson = {
  lessonId: 'proverbs-3-5',
  reference: 'Proverbs 3:5',
  translation: 'ESV',
  devotional: {
    title: 'Leaning Not on Your Own Understanding',
    hook: 'We love having a plan, but what happens when life throws a curveball?',
    insight: "Solomon reminds us that human wisdom is limited, but God's perspective is infinite. Trusting with 'all your heart' means letting go of the need to control every outcome.",
  },
  game: {
    reference: 'Proverbs 3:5',
    translation: 'ESV',
    scrambledWords: ['on', 'heart', 'your', 'all', 'LORD', 'the', 'in', 'Trust', 'with'],
    correctOrder: ['Trust', 'in', 'the', 'LORD', 'with', 'all', 'your', 'heart'],
    speedSettings: { fallSpeed: 'medium', spawnIntervalMs: 1500 },
  },
}