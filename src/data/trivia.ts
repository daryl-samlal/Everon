import type { Question } from '@/lib/types'

export const triviaQuestions: Question[] = [
  {
    id: 1,
    prompt: 'Who built the ark before the great flood?',
    reference: 'Genesis 6–9',
    answers: ['Moses', 'Noah', 'Abraham', 'Joshua'],
    correctAnswer: 'Noah',
  },
  {
    id: 2,
    prompt: 'What is the shortest verse in the Bible?',
    reference: 'John 11:35',
    answers: ['Jesus wept.', 'Pray continually.', 'God is love.', 'Rejoice always.'],
    correctAnswer: 'Jesus wept.',
  },
  {
    id: 3,
    prompt: 'How many disciples did Jesus choose?',
    reference: 'Luke 6:13',
    answers: ['7', '10', '12', '40'],
    correctAnswer: '12',
  },
  {
    id: 4,
    prompt: 'Which book begins with “In the beginning God created…”?',
    reference: 'Genesis 1:1',
    answers: ['Exodus', 'Psalms', 'Genesis', 'Matthew'],
    correctAnswer: 'Genesis',
  },
]
