import { useState } from 'react'
import { ArrowDown, ArrowLeft, BookOpen, Check, Gamepad2, LockKeyhole, X } from 'lucide-react'
import type { Lesson } from '@/data/lesson'
import type { DevotionalFeedPayload, FeedCard, FeedGame } from '@/data/devotional-feed'
import { Button } from '@/components/ui'
import { VerseSlicer } from '@/games/verse-slicer/VerseSlicer'
import './devotional-feed.css'

function MediaBackground({ card }: { card: FeedCard }) {
  if (card.backgroundType === 'image' && card.mediaUrl) return <img className="devotional-feed-media" src={card.mediaUrl} alt="" />
  if (card.backgroundType === 'video' && card.mediaUrl) return <video className="devotional-feed-media" src={card.mediaUrl} autoPlay muted loop playsInline aria-hidden="true" />
  return <div className={`devotional-feed-gradient ${card.mediaUrl ?? 'gradient-trust'}`} aria-hidden="true" />
}

function GameTile({ game, onPlay }: { game: FeedGame; onPlay: (game: FeedGame) => void }) {
  return <button type="button" disabled={!game.available} onClick={() => onPlay(game)} className="devotional-game-tile text-left disabled:cursor-not-allowed disabled:opacity-50"><span className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl">{game.icon}</span><span className="rounded-full bg-sun px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-ink">{game.badge}</span></span><span className="mt-7 block font-display text-xl font-bold">{game.title}</span><span className="mt-1 block text-sm leading-5 text-white/65">{game.description}</span>{game.available ? <span className="mt-5 block text-xs font-black uppercase tracking-widest text-sun">Play now</span> : <span className="mt-5 flex items-center gap-1 text-xs font-black uppercase tracking-widest text-white/45"><LockKeyhole size={13} /> Coming soon</span>}</button>
}

function FeedCardView({ card, onPlay }: { card: FeedCard; onPlay: (game: FeedGame) => void }) {
  return <article className="devotional-feed-card"><MediaBackground card={card} /><div className="devotional-feed-vignette" /><div className="relative z-10 flex h-full flex-col justify-end p-7 pb-14 text-white sm:p-12 sm:pb-16">{card.type === 'content' ? <div className="max-w-xl">{card.overlayText?.reference && <p className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-sun"><BookOpen size={15} /> {card.overlayText.reference}</p>}{card.overlayText?.title && <h2 className="font-display text-4xl font-bold leading-[1.02] sm:text-6xl">{card.overlayText.title}</h2>}{card.overlayText?.hook && <p className="mt-5 max-w-lg text-lg leading-7 text-white/80 sm:text-2xl sm:leading-9">{card.overlayText.hook}</p>}{card.overlayText?.insight && <><p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-sun">Core insight</p><p className="max-w-lg text-xl font-medium leading-8 text-white/85 sm:text-3xl sm:leading-10">{card.overlayText.insight}</p></>}</div> : <div className="w-full"><p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-sun"><Gamepad2 size={16} /> Play & practice</p><h2 className="font-display text-4xl font-bold sm:text-6xl">Make it stick.</h2><div className="mt-8 grid gap-3 sm:grid-cols-3">{card.games?.map((game) => <GameTile key={game.gameId} game={game} onPlay={onPlay} />)}</div></div>}<div className="mt-9 flex items-center gap-2 text-xs font-bold text-white/45"><ArrowDown size={15} /> Swipe for the next card</div></div></article>
}

function DevotionalSequence({ payload, lesson, onPlay }: { payload: DevotionalFeedPayload; lesson: Lesson; onPlay: (game: FeedGame, lesson: Lesson) => void }) {
  return <section className="devotional-feed-sequence" aria-label={payload.title}><div className="devotional-feed-sequence-heading"><span className="text-xs font-black uppercase tracking-[.2em] text-sun">Devotional {payload.devotionalId}</span><span className="text-xs font-bold text-white/45">{payload.cards.length} cards</span></div><div className="devotional-feed-cards">{payload.cards.map((card) => <FeedCardView key={card.cardIndex} card={card} onPlay={(game) => onPlay(game, lesson)} />)}</div></section>
}

export function DevotionalFeed({ payloads, lessons, onExit }: { payloads: DevotionalFeedPayload[]; lessons: Lesson[]; onExit: () => void }) {
  const [activeGame, setActiveGame] = useState<FeedGame | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [triviaOpen, setTriviaOpen] = useState(false)
  const playGame = (game: FeedGame, lesson: Lesson) => {
    setActiveLesson(lesson)
    if (game.title === 'Verse Slicer') setActiveGame(game)
    else setTriviaOpen(true)
  }
  return <div className="devotional-feed-shell"><div className="devotional-feed-toolbar"><button type="button" onClick={onExit} aria-label="Back" title="Back"><ArrowLeft size={19} /></button><span className="truncate font-display text-sm font-bold">Everon devotionals</span><span className="text-xs font-bold text-white/50">{payloads.length} lessons</span></div><div className="devotional-feed-scroll">{payloads.map((payload, index) => <DevotionalSequence key={payload.devotionalId} payload={payload} lesson={lessons[index]} onPlay={playGame} />)}</div>{(activeGame || triviaOpen) && activeLesson && <div className="devotional-game-modal"><div className="devotional-game-modal-inner"><button type="button" className="absolute right-4 top-4 z-20 rounded-xl p-2 text-ink/50 hover:bg-ink/5" onClick={() => { setActiveGame(null); setTriviaOpen(false); setActiveLesson(null) }} aria-label="Close game"><X size={20} /></button>{activeGame ? <VerseSlicer config={activeLesson.game} onExit={() => { setActiveGame(null); setActiveLesson(null) }} /> : <div className="p-8 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#fff5d6] text-sun"><Check size={30} /></div><h2 className="mt-5 font-display text-3xl font-bold">Trivia is ready</h2><p className="mt-2 text-sm text-ink/55">Jump back to Games to play this round.</p><Button className="mt-6" onClick={() => { setTriviaOpen(false); setActiveLesson(null) }}>Back to feed</Button></div>}</div></div>}</div>
}