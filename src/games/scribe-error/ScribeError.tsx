import { useEffect, useMemo, useState } from 'react'
import { Clock3, Heart, RotateCcw, ScrollText, Trophy, X } from 'lucide-react'
import { Button, Card, Progress } from '@/components/ui'
import type { ScribeErrorConfig } from '@/data/scribe-error'
import './scribe-error.css'

const ROUND_SECONDS = 45

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function ScribeError({ config, onExit }: { config: ScribeErrorConfig; onExit: () => void }) {
  const errorIndices = useMemo(() => new Set(config.errors.map((error) => error.wordIndex)), [config.errors])
  const [foundIndices, setFoundIndices] = useState<number[]>([])
  const [lives, setLives] = useState(3)
  const [remainingSeconds, setRemainingSeconds] = useState(ROUND_SECONDS)
  const [status, setStatus] = useState<'playing' | 'complete' | 'over'>('playing')

  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => setRemainingSeconds((current) => {
      if (current <= 1) {
        setStatus('over')
        return 0
      }
      return current - 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [status])

  const chooseWord = (wordIndex: number) => {
    if (status !== 'playing' || foundIndices.includes(wordIndex)) return
    if (errorIndices.has(wordIndex)) {
      const nextFoundIndices = [...foundIndices, wordIndex]
      setFoundIndices(nextFoundIndices)
      if (nextFoundIndices.length === config.errors.length) setStatus('complete')
      return
    }
    setLives((current) => {
      const nextLives = current - 1
      if (nextLives <= 0) setStatus('over')
      return nextLives
    })
  }

  const restart = () => {
    setFoundIndices([])
    setLives(3)
    setRemainingSeconds(ROUND_SECONDS)
    setStatus('playing')
  }

  const score = status === 'complete' ? 100 + remainingSeconds * 5 : 0
  const finished = status !== 'playing'

  return <Card className="relative overflow-hidden"><div className="flex items-center justify-between border-b border-ink/5 px-4 py-3 sm:px-5"><button type="button" onClick={onExit} className="rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Exit Scribe Error"><X size={19} /></button><div className="text-center"><p className="font-display text-sm font-bold">Scribe Error</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{config.reference}</p></div><span className={`flex items-center gap-1 text-xs font-bold ${remainingSeconds <= 10 ? 'text-coral' : 'text-ink/45'}`}><Clock3 size={14} /> {formatTime(remainingSeconds)}</span></div><div className="p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coral"><ScrollText size={15} /> Manuscript review</p><h2 className="mt-1 font-display text-3xl font-bold">Find the errors</h2></div><span className="flex items-center gap-1 text-xs font-bold text-ink/45">{[0, 1, 2].map((life) => <Heart key={life} size={15} fill={life < lives ? 'currentColor' : 'none'} className={life < lives ? 'text-coral' : 'text-ink/20'} />)}</span></div><p className="mt-2 text-sm leading-6 text-ink/55">Tap the three words that do not belong in this verse.</p><Progress value={(foundIndices.length / config.errors.length) * 100} /><div className="mt-8 rounded-[1.5rem] bg-[#fffaf0] p-5 sm:p-7"><div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center font-display text-xl font-bold leading-relaxed sm:text-2xl">{config.corruptedText.map((word, index) => { const found = foundIndices.includes(index); return <button key={`${word}-${index}`} type="button" onClick={() => chooseWord(index)} disabled={finished || found} className={`scribe-error-word rounded-xl px-1.5 py-1 transition ${found ? 'bg-[#65c18c] text-white line-through' : 'text-ink hover:bg-sun/40'} ${finished && !found ? 'cursor-default' : ''}`} aria-label={found ? `${word}, error found` : `Review word ${word}`}>{word}</button> })}</div></div><div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-ink/[.04] p-3 text-center"><div><p className="font-display text-xl font-bold">{foundIndices.length}/{config.errors.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Errors found</p></div><div><p className="font-display text-xl font-bold">{lives}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Lives left</p></div></div></div>{finished && <div className="absolute inset-0 z-10 grid place-items-center bg-ink/75 p-5"><div className="w-full max-w-sm rounded-[1.75rem] bg-white p-7 text-center shadow-2xl"> <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${status === 'complete' ? 'bg-[#eaf8ef] text-[#287846]' : 'bg-[#fff0ee] text-coral'}`}>{status === 'complete' ? <Trophy size={34} /> : <X size={34} />}</div><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-coral">{status === 'complete' ? 'Manuscript restored' : 'The review ended'}</p><h2 className="mt-2 font-display text-3xl font-bold">{status === 'complete' ? `+${score} points` : 'Keep studying'}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{status === 'complete' ? `${config.reference} · ${config.errors.length} errors corrected.` : 'A careful scribe can try the manuscript again.'}</p><div className="mt-6 grid grid-cols-2 gap-3 text-center"><div className="rounded-2xl bg-[#f7f9f7] p-3"><p className="font-display text-2xl font-bold">{foundIndices.length}/{config.errors.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Corrected</p></div><div className="rounded-2xl bg-[#f7f9f7] p-3"><p className="font-display text-2xl font-bold">{formatTime(ROUND_SECONDS - remainingSeconds)}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Time used</p></div></div><div className="mt-6 flex gap-3"><Button className="flex-1" onClick={onExit}>Back to games</Button><Button variant="outline" onClick={restart} aria-label="Play Scribe Error again"><RotateCcw size={18} /></Button></div></div></div>}</Card>
}