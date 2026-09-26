import type { VerseSlicerConfig } from '@/games/verse-slicer/verse-slicer-engine'

export type Lesson = {
  lessonId: string
  category: string
  reference: string
  translation: string
  devotional: { title: string; hook: string; insight: string }
  game: VerseSlicerConfig
}

export const featuredLesson: Lesson = {
  lessonId: 'proverbs-3-5',
  category: 'Trust',
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

export const devotionalLessons: Lesson[] = [
  featuredLesson,
  {
    lessonId: 'philippians-4-6',
    category: 'Peace',
    reference: 'Philippians 4:6',
    translation: 'ESV',
    devotional: {
      title: 'Bring Everything to God',
      hook: 'An anxious mind does not have to carry every question alone.',
      insight: 'Prayer turns worry into an honest conversation with God, one request and one moment of gratitude at a time.',
    },
    game: {
      reference: 'Philippians 4:6',
      translation: 'ESV',
      scrambledWords: ['anything', 'in', 'everything', 'by', 'prayer', 'do', 'not', 'be', 'anxious'],
      correctOrder: ['do', 'not', 'be', 'anxious', 'about', 'anything'],
      speedSettings: { fallSpeed: 'medium', spawnIntervalMs: 1500 },
    },
  },
  {
    lessonId: 'micah-6-8',
    category: 'Purpose',
    reference: 'Micah 6:8',
    translation: 'ESV',
    devotional: {
      title: 'A Life That Matters',
      hook: 'Purpose can become wonderfully simple when we stop trying to impress the world.',
      insight: 'Justice, mercy, and humility are not grand performances. They are daily ways to reflect God in the places we already are.',
    },
    game: {
      reference: 'Micah 6:8',
      translation: 'ESV',
      scrambledWords: ['to', 'walk', 'humbly', 'with', 'your', 'God', 'love', 'mercy'],
      correctOrder: ['to', 'do', 'justice', 'and', 'to', 'love', 'kindness'],
      speedSettings: { fallSpeed: 'medium', spawnIntervalMs: 1500 },
    },
  },
]