import { FormEvent, useEffect, useRef, useState } from 'react'
import { Check, Clock3, RotateCcw, Send, Target, X } from 'lucide-react'
import { Button, Card, Progress } from '@/components/ui'
import type { VerseleConfig } from '@/data/versele'
import './versele.css'

function normalizeWord(word: string) {
  return word.trim().toLocaleLowerCase()
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

export function Versele({ config, onExit }: { config: VerseleConfig; onExit: () => void }) {
  const [revealed, setRevealed] = useState<boolean[]>(() => config.targetWords.map(() => false))
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [incorrectGuesses, setIncorrectGuesses] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    if (completed) return
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [completed])

  const submitGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedGuess = normalizeWord(guess)
    if (!normalizedGuess || completed) return

    const matches = config.targetWords.map((word) => normalizeWord(word) === normalizedGuess)
    const isCorrect = matches.some(Boolean)
    const nextRevealed = revealed.map((isRevealed, index) => isRevealed || matches[index])
    setAttempts((current) => current + 1)
    setRevealed(nextRevealed)
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (!isCorrect) setIncorrectGuesses((current) => current + 1)
    if (nextRevealed.every(Boolean)) {
      setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000))
      setCompleted(true)
    }
    setGuess('')
  }

  const restart = () => {
    startedAt.current = Date.now()
    setRevealed(config.targetWords.map(() => false))
    setGuess('')
    setAttempts(0)
    setIncorrectGuesses(0)
    setElapsedSeconds(0)
    setCompleted(false)
    setFeedback(null)
  }

  return <Card className="relative overflow-hidden"><div className="flex items-center justify-between border-b border-ink/5 px-4 py-3 sm:px-5"><button type="button" onClick={onExit} className="rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Exit Versele"><X size={19} /></button><div className="text-center"><p className="font-display text-sm font-bold">Versele</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{config.reference} · {config.translation}</p></div><span className="flex items-center gap-1 text-xs font-bold text-ink/45"><Clock3 size={14} /> {formatTime(elapsedSeconds)}</span></div><div className="p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-coral">Verse memory</p><h2 className="mt-1 font-display text-3xl font-bold">Find every word</h2></div><span className="text-xs font-bold text-ink/45">{revealed.filter(Boolean).length}/{config.targetWords.length}</span></div><Progress value={(revealed.filter(Boolean).length / config.targetWords.length) * 100} /><div className="versele-grid mt-8 grid gap-2" aria-label={`${config.targetWords.length} word verse grid`}>{config.targetWords.map((word, index) => <div key={`${word}-${index}`} className={`versele-word flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 text-center ${revealed[index] ? 'border-[#65c18c] bg-[#eaf8ef] text-[#287846]' : 'border-ink/10 bg-[#f7f9f7] text-ink/35'}`}><span className="font-display text-lg font-bold leading-none">{revealed[index] ? word : word.split('').map(() => '_').join(' ')}</span><span className="mt-2 text-[10px] font-bold uppercase tracking-widest">{word.length} letters</span></div>)}</div><form onSubmit={submitGuess} className="mt-8"><label htmlFor="versele-guess" className="text-sm font-bold">Guess any word</label><div className="mt-2 flex flex-col gap-3 sm:flex-row"><input id="versele-guess" value={guess} onChange={(event) => { setGuess(event.target.value); setFeedback(null) }} placeholder="Type a word from the verse" autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-2xl border-2 border-ink/10 px-4 outline-none transition focus:border-coral" /><Button type="submit" disabled={!guess.trim() || completed}><Send className="mr-2" size={17} />Guess</Button></div></form>{feedback === 'correct' && <p role="status" className="mt-4 flex items-center gap-2 rounded-2xl bg-[#eaf8ef] px-4 py-3 text-sm font-bold text-[#287846]"><Check size={17} /> Word found. Keep going.</p>}{feedback === 'wrong' && <p role="alert" className="mt-4 flex items-center gap-2 rounded-2xl bg-[#fff0ee] px-4 py-3 text-sm font-bold text-coral"><X size={17} /> That word is not in this verse.</p>}<div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-ink/[.04] p-3 text-center"><div><p className="font-display text-xl font-bold">{attempts}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Attempts</p></div><div><p className="font-display text-xl font-bold">{incorrectGuesses}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Incorrect</p></div><div><p className="flex items-center justify-center gap-1 font-display text-xl font-bold"><Target size={16} className="text-coral" /> {config.targetWords.length - revealed.filter(Boolean).length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">To find</p></div></div></div>{completed && <div className="versele-success-modal absolute inset-0 z-10 grid place-items-center bg-ink/70 p-5"><div className="w-full max-w-sm rounded-[1.75rem] bg-white p-7 text-center shadow-2xl"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf8ef] text-[#287846]"><Check size={34} /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-coral">Verse complete</p><h2 className="mt-2 font-display text-3xl font-bold">You found it.</h2><p className="mt-3 text-sm leading-6 text-ink/55">{config.reference} · {config.translation}</p><div className="mt-6 grid grid-cols-2 gap-3 text-center"><div className="rounded-2xl bg-[#f7f9f7] p-3"><p className="font-display text-2xl font-bold">{attempts}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Attempts</p></div><div className="rounded-2xl bg-[#f7f9f7] p-3"><p className="font-display text-2xl font-bold">{formatTime(elapsedSeconds)}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Time</p></div></div><p className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-[#287846]"><Check size={17} /> Full reference: {config.reference}</p><div className="mt-6 flex gap-3"><Button className="flex-1" onClick={onExit}>Back to games</Button><Button variant="outline" onClick={restart} aria-label="Play Versele again"><RotateCcw size={18} /></Button></div></div></div>}</Card>
}
