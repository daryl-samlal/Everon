import { useState } from 'react'
import { ArrowRight, BookOpen, Check, Flame, Lightbulb, Share2, Sparkles } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { featuredLesson, type Lesson } from '@/data/lesson'
import { VerseSlicer } from '@/games/verse-slicer/VerseSlicer'

function Completion({ lesson, score, onReplay }: { lesson: Lesson; score: number; onReplay: () => void }) {
  const [copied, setCopied] = useState(false)
  const summary = `Everon ${lesson.reference} ${lesson.translation}\n${'🟩'.repeat(lesson.game.correctOrder.length)}\nScore: ${score}`

  const share = async () => {
    if (navigator.share) await navigator.share({ title: 'Verse Slicer complete', text: summary })
    else { await navigator.clipboard.writeText(summary); setCopied(true) }
  }

  return <Card className="overflow-hidden animate-[fade-in_.45s_ease-out]"><div className="bg-ink px-6 py-10 text-center text-white sm:px-10"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-sun text-ink"><Check size={42} strokeWidth={3} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-sun">Verse locked in</p><h2 className="mt-2 font-display text-4xl font-bold">+{score} points</h2><p className="mt-3 text-sm text-white/65">{lesson.reference} · {lesson.translation}</p><div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold"><Flame size={17} className="text-coral" fill="currentColor" /> Streak badge earned</div></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-widest text-coral">Your share summary</p><div className="mt-3 rounded-2xl bg-mist p-4 font-mono text-sm leading-7 text-ink">{lesson.reference} · {lesson.translation}<br />{'🟩'.repeat(lesson.game.correctOrder.length)}<br />Score: {score}</div><div className="mt-5 flex gap-3"><Button className="flex-1" onClick={share}><Share2 size={17} className="mr-2" />{copied ? 'Copied' : 'Share result'}</Button><Button variant="outline" onClick={onReplay}>Play again</Button></div></div></Card>
}

export function DevotionalExperience() {
  const [mode, setMode] = useState<'devotional' | 'game' | 'complete'>('devotional')
  const [score, setScore] = useState(0)
  const lesson = featuredLesson

  if (mode === 'game') return <VerseSlicer config={lesson.game} onExit={() => setMode('devotional')} onComplete={(finalScore) => { setScore(finalScore); setMode('complete') }} />
  if (mode === 'complete') return <Completion lesson={lesson} score={score} onReplay={() => setMode('game')} />

  return <div className="mx-auto max-w-3xl space-y-5 animate-[fade-in_.45s_ease-out]"><section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12"><div className="absolute -right-10 -top-12 h-44 w-44 rounded-full border-[22px] border-sun/25" /><div className="relative"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-sun"><BookOpen size={16} /> Today's devotional</div><p className="mt-8 text-sm font-bold text-white/60">{lesson.reference} · {lesson.translation}</p><h1 className="mt-3 max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">{lesson.devotional.title}</h1><p className="mt-5 max-w-lg text-base leading-7 text-white/75">{lesson.devotional.hook}</p></div></section><Card className="p-6 sm:p-8"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fff5d6] text-[#9a7900]"><Lightbulb size={22} /></span><div><p className="text-xs font-bold uppercase tracking-widest text-coral">Core insight</p><p className="mt-2 text-base leading-7 text-ink/70">{lesson.devotional.insight}</p></div></div><Button className="mt-7 w-full justify-center sm:w-auto" onClick={() => setMode('game')}>Play Verse Slicer to Lock In This Verse <ArrowRight size={18} className="ml-2" /></Button></Card><div className="flex items-center justify-center gap-2 text-xs font-bold text-ink/40"><Sparkles size={14} className="text-sun" /> Read it. Play it. Remember it.</div></div>
}