import { devotionalLessons } from '@/data/lesson'
import { createDevotionalFeed } from '@/data/devotional-feed'
import { DevotionalFeed } from '@/components/DevotionalFeed'

export function DevotionalExperience() {
  return <DevotionalFeed payloads={devotionalLessons.map(createDevotionalFeed)} lessons={devotionalLessons} onExit={() => window.history.back()} />
}