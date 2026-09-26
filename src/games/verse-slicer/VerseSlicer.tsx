import { useEffect, useState } from 'react'
import { ArrowRight, Clock3, Heart, Medal, RotateCcw, Sparkles, Target, X } from 'lucide-react'
import { Button, Card, Progress } from '@/components/ui'
import './verse-slicer.css'
import { createInitialState, createWord, selectWord, tick, type SlicerState, type VerseSlicerConfig } from './verse-slicer-engine'

function shuffledWords(words: string[]) {
  return [...words].sort(() => Math.random() - 0.5)
}

export function VerseSlicer({ config, onExit, onComplete }: { config: VerseSlicerConfig; onExit: () => void; onComplete?: (score: number) => void }) {
  const [state, setState] = useState<SlicerState>(createInitialState)
  const [spawnIndex, setSpawnIndex] = useState(0)
  const [wordStream] = useState(() => shuffledWords(config.scrambledWords))

  useEffect(() => {
    const timer = window.setInterval(() => setState((current) => tick(current)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const spawnTimer = window.setInterval(() => {
      setState((current) => {
        if (current.status !== 'playing' || spawnIndex >= wordStream.length) return current
        return { ...current, activeWords: [...current.activeWords, createWord(wordStream[spawnIndex], spawnIndex)] }
      })
      setSpawnIndex((current) => Math.min(current + 1, wordStream.length))
    }, config.speedSettings.spawnIntervalMs)
    return () => window.clearInterval(spawnTimer)
  }, [config.speedSettings.spawnIntervalMs, spawnIndex, wordStream])

  const restart = () => { setState(createInitialState()); setSpawnIndex(0) }
  useEffect(() => {
    if (state.status === 'complete') onComplete?.(state.score)
  }, [onComplete, state.score, state.status])

  if (state.status !== 'playing') {
    const won = state.status === 'complete'
    return <Card className="overflow-hidden"><div className="bg-ink px-6 py-10 text-center text-white"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-sun text-ink">{won ? <Medal size={42} /> : <Clock3 size={40} />}</div><p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-sun">{won ? 'Verse captured' : 'Round over'}</p><h2 className="mt-2 font-display text-4xl font-bold">{won ? `+${state.score} points` : 'Keep practicing'}</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/65">{won ? `${config.reference} · ${config.translation}` : 'The next round is a fresh chance to build your recall.'}</p></div><div className="flex gap-3 p-5"><Button className="flex-1" onClick={onExit}>Back to games</Button><Button variant="outline" onClick={restart} aria-label="Play Verse Slicer again"><RotateCcw size={18} /></Button></div></Card>
  }

  const progress = (state.nextIndex / config.correctOrder.length) * 100
  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-ink/5 px-3 py-2 sm:px-4"><button onClick={onExit} className="rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Exit Verse Slicer"><X size={18} /></button><div className="min-w-0 text-center"><p className="truncate font-display text-sm font-bold">Verse Slicer</p><p className="truncate text-[10px] font-bold text-ink/45">{config.reference} · {config.translation}</p></div><div className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff5d6] px-2 py-1 text-[10px] font-bold text-[#9a7900]"><Clock3 size={12} /> {state.timeRemaining}s</div></div><div className="grid grid-cols-3 gap-1 px-3 py-2 text-center sm:px-5"><div><p className="font-display text-lg font-bold">{state.score}</p><p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Score</p></div><div><p className="flex items-center justify-center gap-1 font-display text-lg font-bold">{state.combo}<Sparkles size={12} className="text-sun" /></p><p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Combo</p></div><div><p className="flex items-center justify-center gap-1 font-display text-lg font-bold">{state.lives}<Heart size={12} className="text-coral" fill="currentColor" /></p><p className="text-[9px] font-bold uppercase tracking-widest text-ink/40">Lives</p></div></div><div className="px-3 sm:px-5"><Progress value={progress} /></div><div className={`verse-slicer-arena relative mt-3 h-[30rem] overflow-hidden px-3 py-5 sm:h-[36rem] ${state.feedback === 'correct' ? 'verse-slicer-correct' : state.feedback === 'wrong' ? 'verse-slicer-wrong' : ''}`}><div className="absolute inset-x-5 top-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[.18em] text-white/50"><span className="flex items-center gap-1"><Target size={13} /> Tap the next word</span><span>{state.nextIndex}/{config.correctOrder.length}</span></div>{state.activeWords.map((word) => <button key={word.id} type="button" onClick={() => setState((current) => selectWord(current, word, config))} className="verse-slicer-word absolute min-h-12 max-w-[calc(100%-2rem)] rounded-2xl border border-white/30 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-sun hover:bg-sun" style={{ left: `${word.left}%`, top: `${16 + word.lane * 13}%` }}>{word.text}</button>)}{state.activeWords.length === 0 && <div className="absolute inset-0 grid place-items-center px-8 text-center text-sm font-bold leading-6 text-white/60">Get ready. The words are on their way.</div>}</div><div className="flex items-center justify-between px-3 py-3 text-xs font-bold text-ink/45 sm:px-5"><span>Tap in exact verse order</span><span className="flex items-center gap-1"><ArrowRight size={14} /> Stay sharp</span></div></Card>
}