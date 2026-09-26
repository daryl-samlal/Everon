import { useEffect, useState } from 'react'
import { devotionalLessons, type Lesson } from '@/data/lesson'
import { createDevotionalFeed } from '@/data/devotional-feed'
import { loadDevotionals } from '@/data/devotionals'
import { DevotionalFeed } from '@/components/DevotionalFeed'

export function DevotionalExperience() {
  const [lessons, setLessons] = useState<Lesson[]>(devotionalLessons)
  useEffect(() => { loadDevotionals().then(setLessons) }, [])
  return <DevotionalFeed payloads={lessons.map(createDevotionalFeed)} lessons={lessons} onExit={() => window.history.back()} />
}