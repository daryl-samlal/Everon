import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { loadDevotionals } from '@/data/devotionals'
import type { Lesson } from '@/data/lesson'

export function Devotionals() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  useEffect(() => { loadDevotionals().then(setLessons) }, [])
  const groups = lessons.reduce<Record<string, Lesson[]>>((result, lesson) => {
    ;(result[lesson.category] ??= []).push(lesson)
    return result
  }, {})

  return <div className="space-y-7 animate-[fade-in_.45s_ease-out]"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-coral">Make space for what matters</p><h1 className="mt-1 font-display text-4xl font-bold tracking-tight">Devotionals</h1><p className="mt-2 text-sm text-ink/55">Short reflections for real life.</p></div><Link to="/create-devotional"><Button aria-label="Create devotional" title="Create devotional"><Plus size={18} /><span className="hidden sm:inline">Create</span></Button></Link></div>{Object.entries(groups).map(([category, categoryLessons]) => <section key={category}><div className="mb-3 flex items-center gap-3"><h2 className="font-display text-xl font-bold">{category}</h2><span className="h-px flex-1 bg-ink/10" /></div><div className="grid gap-3 sm:grid-cols-2">{categoryLessons.map((lesson) => <Card key={lesson.lessonId} className="p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#fff5d6] text-[#9a7900]"><BookOpen size={19} /></span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-coral">{lesson.reference} · {lesson.translation}</p><h3 className="mt-2 font-display text-xl font-bold leading-tight">{lesson.devotional.title}</h3><p className="mt-2 text-sm leading-6 text-ink/60">{lesson.devotional.hook}</p><Link to={`/games?lesson=${lesson.lessonId}`} className="mt-4 inline-flex items-center text-sm font-bold text-coral">Explore <ArrowRight size={16} className="ml-1" /></Link></div></div></Card>)}</div></section>)}</div>
}