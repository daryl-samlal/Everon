import { devotionalLessons, type Lesson } from '@/data/lesson'
import { supabase } from '@/lib/supabase'

export type DevotionalDraft = Pick<Lesson, 'category' | 'reference' | 'translation'> & {
  title: string
  hook: string
  insight: string
}

const localKey = 'everon-devotionals'

function readLocal(): Lesson[] {
  try {
    const stored = localStorage.getItem(localKey)
    return stored ? [...devotionalLessons, ...JSON.parse(stored) as Lesson[]] : devotionalLessons
  } catch {
    return devotionalLessons
  }
}

export async function loadDevotionals() {
  if (!supabase) return readLocal()
  const { data, error } = await supabase.from('devotionals').select('*').order('created_at', { ascending: false })
  if (error || !data) return readLocal()
  return [...devotionalLessons, ...data.map((item) => ({
    lessonId: item.id,
    category: item.category,
    reference: item.reference,
    translation: item.translation,
    devotional: { title: item.title, hook: item.hook, insight: item.insight },
    game: devotionalLessons[0].game,
  }))]
}

export async function saveDevotional(draft: DevotionalDraft) {
  const lesson: Lesson = {
    lessonId: `local-${Date.now()}`,
    category: draft.category,
    reference: draft.reference,
    translation: draft.translation,
    devotional: { title: draft.title, hook: draft.hook, insight: draft.insight },
    game: devotionalLessons[0].game,
  }

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('You must be signed in to create a devotional.')
    const { error } = await supabase.from('devotionals').insert({
      owner_id: user.id, title: draft.title, category: draft.category, reference: draft.reference,
      translation: draft.translation, hook: draft.hook, insight: draft.insight,
    })
    if (error) throw error
  } else {
    const saved = JSON.parse(localStorage.getItem(localKey) || '[]') as Lesson[]
    localStorage.setItem(localKey, JSON.stringify([...saved, lesson]))
  }
}