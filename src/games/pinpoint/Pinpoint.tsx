import { FormEvent, useState } from 'react'
import { Check, Lightbulb, RotateCcw, Send, Star, X } from 'lucide-react'
import { Button, Card, Progress } from '@/components/ui'
import type { PinpointConfig } from '@/data/pinpoint'
import './pinpoint.css'

function normalizeAnswer(answer: string) {
  return answer.trim().toLocaleLowerCase()
}

export function Pinpoint({ config, onExit }: { config: PinpointConfig; onExit: () => void }) {
  const [clueIndex, setClueIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [complete, setComplete] = useState(false)
  const currentPoints = config.pointsPerClue[clueIndex] ?? 0
  const clueNumber = clueIndex + 1

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!answer.trim() || result === 'correct') return

    const isCorrect = config.acceptedAnswers.some((acceptedAnswer) => normalizeAnswer(acceptedAnswer) === normalizeAnswer(answer))
    setResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(currentPoints)
      setComplete(true)
    }
  }

  const revealNextClue = () => {
    if (clueIndex >= config.clues.length - 1 || complete) return
    setClueIndex((current) => current + 1)
    setAnswer('')
    setResult(null)
  }

  const restart = () => {
    setClueIndex(0)
    setAnswer('')
    setScore(0)
    setResult(null)
    setComplete(false)
  }

  if (complete) return <Card className="overflow-hidden pinpoint-card"><div className="bg-ink px-6 py-10 text-center text-white"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-sun text-ink"><Star size={40} fill="currentColor" /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-sun">Pinpoint found</p><h2 className="mt-2 font-display text-4xl font-bold">+{score} points</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/65">You found {config.title.replace('Pinpoint: ', '')} with {clueNumber} clue{clueNumber === 1 ? '' : 's'}.</p></div><div className="flex gap-3 p-5"><Button className="flex-1" onClick={onExit}>Back to games</Button><Button variant="outline" onClick={restart} aria-label="Play Pinpoint again"><RotateCcw size={18} /></Button></div></Card>

  return <Card className="overflow-hidden pinpoint-card"><div className="flex items-center justify-between border-b border-ink/5 px-4 py-3 sm:px-5"><button type="button" onClick={onExit} className="rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Exit Pinpoint"><X size={19} /></button><div className="text-center"><p className="font-display text-sm font-bold">{config.title}</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{config.category}</p></div><span className="flex items-center gap-1 rounded-full bg-[#fff5d6] px-2.5 py-1 text-xs font-bold text-[#9a7900]"><Star size={13} fill="currentColor" /> {currentPoints}</span></div><div className="p-5 sm:p-7"><div className="flex items-center justify-between text-xs font-bold text-ink/45"><span>Clue {clueNumber} of {config.clues.length}</span><span>{score} pts banked</span></div><Progress value={(clueNumber / config.clues.length) * 100} /><div key={clueIndex} className="pinpoint-clue mt-8 rounded-[1.5rem] bg-[#fffaf0] p-6"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sun text-ink"><Lightbulb size={22} /></div><p className="text-xs font-bold uppercase tracking-widest text-coral">Your clue</p><p className="mt-3 font-display text-2xl font-bold leading-tight">{config.clues[clueIndex]}</p></div><form onSubmit={submitAnswer} className="mt-7"><label htmlFor="pinpoint-answer" className="text-sm font-bold">What is your answer?</label><div className="mt-2 flex flex-col gap-3 sm:flex-row"><input id="pinpoint-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); if (result) setResult(null) }} placeholder="Type a name, theme, or place" autoComplete="off" className="min-h-12 min-w-0 flex-1 rounded-2xl border-2 border-ink/10 px-4 outline-none transition focus:border-coral" /><Button type="submit" disabled={!answer.trim()}><Send className="mr-2" size={17} />Submit</Button></div></form>{result === 'wrong' && <p role="alert" className="mt-4 flex items-center gap-2 rounded-2xl bg-[#fff0ee] px-4 py-3 text-sm font-bold text-coral"><X size={17} /> Not quite. Try again or reveal another clue.</p>}{result === 'correct' && <p role="status" className="mt-4 flex items-center gap-2 rounded-2xl bg-[#eaf8ef] px-4 py-3 text-sm font-bold text-[#287846]"><Check size={17} /> Correct!</p>}<Button type="button" variant="outline" className="mt-5 w-full" onClick={revealNextClue} disabled={clueIndex >= config.clues.length - 1}>Reveal next clue <Lightbulb className="ml-2" size={17} /></Button><p className="mt-3 text-center text-xs text-ink/40">Earlier answers earn more points.</p></div></Card>
}