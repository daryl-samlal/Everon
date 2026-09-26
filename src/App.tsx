import { useEffect, useState } from 'react'
import { ArrowRight, Check, Flame, LockKeyhole, Medal, RotateCcw, Sparkles, Star, Trophy, X } from 'lucide-react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { AuthPage } from '@/components/AuthPage'
import { AppShell } from '@/components/AppShell'
import { GameCreator } from '@/components/GameCreator'
import { Button, Card, Progress } from '@/components/ui'
import { triviaQuestions } from '@/data/trivia'
import { featuredLesson } from '@/data/lesson'
import { supabase } from '@/lib/supabase'
import type { ScoreEntry } from '@/lib/types'
import { VerseSlicer } from '@/games/verse-slicer/VerseSlicer'
import { DevotionalExperience } from '@/components/DevotionalExperience'
import { Devotionals } from '@/components/Devotionals'
import { DevotionalCreator } from '@/components/DevotionalCreator'

const leaderboard: ScoreEntry[] = [
  { name: 'Maya R.', score: 1840, badge: '1st' },
  { name: 'Jordan K.', score: 1620, badge: '2nd' },
  { name: 'Eli B.', score: 1410, badge: '3rd' },
  { name: 'You', score: 980, badge: '4th' },
]

function Home() {
  const navigate = useNavigate()
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase()
  return <div className="space-y-6 animate-[fade-in_.5s_ease-out]">
    <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-7 text-white shadow-xl sm:px-10 sm:py-10">
      <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full border-[22px] border-sun/25" /><div className="absolute bottom-[-4rem] right-20 h-36 w-36 rounded-full bg-coral/20" />
      <div className="relative max-w-xl"><div className="mb-4 flex items-center gap-2 text-sm font-bold text-sun"><Sparkles size={16} /> {today}</div><p className="text-xs font-bold uppercase tracking-[.18em] text-white/55">Today's devotional · {featuredLesson.category}</p><h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">{featuredLesson.devotional.title}</h1><p className="mt-4 max-w-sm text-sm leading-6 text-white/70">{featuredLesson.devotional.hook}</p><Button className="mt-7" onClick={() => navigate('/devotionals')}>Read devotional <ArrowRight className="ml-2" size={18} /></Button></div>
    </section>
    <div className="grid grid-cols-2 gap-3"><Card className="p-5"><div className="mb-4 flex items-center justify-between"><Flame className="text-coral" size={23} /><span className="text-xs font-bold text-ink/40">STREAK</span></div><p className="font-display text-3xl font-bold">7 <span className="text-base font-medium text-ink/50">days</span></p><p className="mt-1 text-xs text-ink/50">Keep showing up</p></Card><Card className="p-5"><div className="mb-4 flex items-center justify-between"><Star className="text-sun" size={23} fill="currentColor" /><span className="text-xs font-bold text-ink/40">POINTS</span></div><p className="font-display text-3xl font-bold">980</p><p className="mt-1 text-xs text-ink/50">This month</p></Card></div>
    <section><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-coral">Your journey</p><h2 className="mt-1 font-display text-2xl font-bold">Keep exploring</h2></div><button onClick={() => navigate('/games')} className="text-sm font-bold text-ink/50">See all</button></div><Card className="flex items-center gap-4 p-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#fff5d6] text-sun"><Trophy size={26} /></div><div className="min-w-0 flex-1"><div className="flex justify-between text-sm font-bold"><span>First steps</span><span>2/3</span></div><Progress value={66} /><p className="mt-2 text-xs text-ink/50">Complete one more game to unlock your next badge.</p></div><LockKeyhole size={17} className="text-ink/25" /></Card></section>
  </div>
}

function Games() {
  const [playing, setPlaying] = useState<'verse' | 'trivia' | null>(null)
  return <div className="space-y-6">{playing === null ? <DevotionalExperience /> : playing === 'verse' ? <VerseSlicer config={featuredLesson.game} onExit={() => setPlaying(null)} /> : <TriviaGame onExit={() => setPlaying(null)} />}</div>
}

function TriviaGame({ onExit }: { onExit: () => void }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const question = triviaQuestions[questionIndex]
  const complete = questionIndex >= triviaQuestions.length
  if (complete) return <Card className="p-7 text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-[#fff5d6] text-sun"><Medal size={42} /></div><p className="mt-6 text-xs font-bold uppercase tracking-widest text-coral">Round complete</p><h2 className="mt-2 font-display text-4xl font-bold">You scored {score}</h2><p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink/55">Every question is a chance to remember what matters.</p><div className="mt-7 flex gap-3"><Button className="flex-1" onClick={onExit}>Back to games</Button><Button variant="outline" onClick={() => { setQuestionIndex(0); setScore(0); setSelected(null) }} aria-label="Play again"><RotateCcw size={18} /></Button></div></Card>
  const answer = (value: string) => { if (selected) return; setSelected(value); if (value === question.correctAnswer) setScore((current) => current + 100) }
  const next = () => { setSelected(null); setQuestionIndex((current) => current + 1) }
  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-ink/5 px-5 py-4"><button onClick={onExit} className="rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Exit game"><X size={20} /></button><span className="text-sm font-bold text-ink/45">{questionIndex + 1} / {triviaQuestions.length}</span><span className="flex items-center gap-1 rounded-full bg-[#fff5d6] px-3 py-1 text-xs font-bold text-[#9a7900]"><Star size={13} fill="currentColor" /> {score}</span></div><div className="p-6"><Progress value={(questionIndex / triviaQuestions.length) * 100} /><p className="mt-8 text-xs font-bold uppercase tracking-widest text-coral">{question.reference}</p><h2 className="mt-3 font-display text-2xl font-bold leading-tight">{question.prompt}</h2><div className="mt-7 space-y-3">{question.answers.map((choice) => { const isCorrect = selected && choice === question.correctAnswer; const isWrong = selected === choice && !isCorrect; return <button key={choice} onClick={() => answer(choice)} className={`flex min-h-14 w-full items-center rounded-2xl border-2 px-4 text-left text-sm font-bold transition ${isCorrect ? 'border-[#65c18c] bg-[#eaf8ef] text-[#287846]' : isWrong ? 'border-coral bg-[#fff0ee] text-coral' : 'border-ink/10 hover:border-ink/30'}`}>{isCorrect ? <Check size={18} className="mr-3" /> : isWrong ? <X size={18} className="mr-3" /> : <span className="mr-3 h-2 w-2 rounded-full bg-ink/20" />}{choice}</button> })}</div>{selected && <div className="mt-6 flex items-center justify-between"><p className="text-sm font-bold text-ink/60">{selected === question.correctAnswer ? 'That’s right!' : `The answer is ${question.correctAnswer}.`}</p><Button onClick={next}>Next <ArrowRight className="ml-2" size={17} /></Button></div>}</div></Card>
}

function Leaderboard() { return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-widest text-coral">The crew</p><h1 className="mt-1 font-display text-4xl font-bold tracking-tight">Top of the class</h1><p className="mt-2 text-sm text-ink/55">Your group’s best scores this month.</p></div><Card className="overflow-hidden"><div className="flex items-end justify-center gap-3 bg-ink px-5 pb-7 pt-8 text-white"><div className="text-center"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white/15 font-display text-lg font-bold">JK</div><p className="text-xs font-bold">Jordan</p><div className="mt-2 h-14 w-20 rounded-t-2xl bg-white/10 pt-3 text-xs font-bold">1,620</div></div><div className="text-center"><div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border-4 border-sun bg-[#274663] font-display text-lg font-bold">MR</div><p className="text-xs font-bold text-sun">Maya</p><div className="mt-2 h-20 w-20 rounded-t-2xl bg-sun pt-3 text-xs font-bold text-ink">1,840</div></div><div className="text-center"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white/15 font-display text-lg font-bold">EB</div><p className="text-xs font-bold">Eli</p><div className="mt-2 h-10 w-20 rounded-t-2xl bg-white/10 pt-3 text-xs font-bold">1,410</div></div></div><div className="divide-y divide-ink/5">{leaderboard.map((entry, index) => <div key={entry.name} className={`flex items-center gap-4 px-5 py-4 ${entry.name === 'You' ? 'bg-[#fffaf0]' : ''}`}><span className="w-5 text-sm font-bold text-ink/35">{index + 1}</span><div className="grid h-10 w-10 place-items-center rounded-full bg-mist text-xs font-bold">{entry.name.split(' ').map((part) => part[0]).join('')}</div><span className="flex-1 text-sm font-bold">{entry.name}</span><span className="font-display font-bold">{entry.score.toLocaleString()} <span className="text-xs font-normal text-ink/40">pts</span></span></div>)}</div></Card></div> }

function Profile() { return <div className="space-y-6"><div className="flex items-center gap-4"><div className="grid h-20 w-20 place-items-center rounded-[1.75rem] bg-coral text-2xl font-bold text-white">YO</div><div><p className="text-xs font-bold uppercase tracking-widest text-coral">Your profile</p><h1 className="mt-1 font-display text-3xl font-bold">Your journey</h1><p className="text-sm text-ink/50">Keep growing, one game at a time.</p></div></div><Card className="grid grid-cols-3 divide-x divide-ink/10 p-5 text-center"><div><p className="font-display text-2xl font-bold">980</p><p className="mt-1 text-[11px] font-bold uppercase text-ink/40">Points</p></div><div><p className="font-display text-2xl font-bold">7</p><p className="mt-1 text-[11px] font-bold uppercase text-ink/40">Day streak</p></div><div><p className="font-display text-2xl font-bold">4th</p><p className="mt-1 text-[11px] font-bold uppercase text-ink/40">Rank</p></div></Card><section><h2 className="mb-3 font-display text-xl font-bold">Badges</h2><div className="grid grid-cols-3 gap-3">{['First steps', 'On fire', 'Quiz master'].map((badge, index) => <Card key={badge} className="p-4 text-center"><div className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${index === 0 ? 'bg-[#fff5d6] text-sun' : 'bg-ink/5 text-ink/20'}`}><Medal size={24} /></div><p className="mt-3 text-xs font-bold">{badge}</p></Card>)}</div></section></div> }

function RequireAuth({ session, loading }: { session: Session | null; loading: boolean }) {
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f7f9f7] text-sm font-bold text-ink/50">Loading Everon...</main>
  return session ? <Outlet /> : <Navigate to="/auth" replace />
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => subscription.unsubscribe()
  }, [])

  return <Routes>
    <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage />} />
    <Route element={<RequireAuth session={session} loading={loading} />}>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/devotionals" element={<Devotionals />} />
        <Route path="/create-devotional" element={<DevotionalCreator />} />
        <Route path="/games" element={<Games />} />
        <Route path="/create-game" element={<GameCreator />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Route>
  </Routes>
}
