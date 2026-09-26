import { useMemo, useState } from 'react'
import { RotateCcw, Sparkles, X } from 'lucide-react'
import { Button, Card, Progress } from '@/components/ui'
import type { ConnectionsCategory, ConnectionsConfig } from '@/data/connections'
import './connections.css'

const categoryColors = ['bg-[#eaf8ef] border-[#65c18c] text-[#287846]', 'bg-[#fff5d6] border-sun text-[#806300]', 'bg-[#eaf2fb] border-[#79a8d5] text-[#24567e]', 'bg-[#fff0ee] border-coral text-coral']

function shuffledItems(config: ConnectionsConfig) {
  return config.categories.flatMap((category) => category.items).sort(() => Math.random() - 0.5)
}

export function Connections({ config, onExit }: { config: ConnectionsConfig; onExit: () => void }) {
  const [items, setItems] = useState(() => shuffledItems(config))
  const [selected, setSelected] = useState<string[]>([])
  const [solvedCategories, setSolvedCategories] = useState<ConnectionsCategory[]>([])
  const [strikes, setStrikes] = useState(0)
  const [shake, setShake] = useState(false)

  const categoryByItem = useMemo(() => new Map(config.categories.flatMap((category) => category.items.map((item) => [item, category]))), [config.categories])
  const complete = solvedCategories.length === config.categories.length
  const gameOver = strikes >= 4 && !complete

  const toggleItem = (item: string) => {
    if (solvedCategories.some((category) => category.items.includes(item))) return
    setSelected((current) => current.includes(item) ? current.filter((selectedItem) => selectedItem !== item) : current.length < 4 ? [...current, item] : current)
  }

  const submitGroup = () => {
    if (selected.length !== 4 || complete || gameOver) return
    const category = categoryByItem.get(selected[0])
    const correct = category && selected.every((item) => category.items.includes(item)) && !solvedCategories.some((solved) => solved.name === category.name)
    if (correct) {
      setSolvedCategories((current) => [...current, category])
      setItems((current) => current.filter((item) => !selected.includes(item)))
      setSelected([])
      return
    }
    setStrikes((current) => current + 1)
    setShake(true)
    window.setTimeout(() => setShake(false), 420)
  }

  const restart = () => {
    setItems(shuffledItems(config))
    setSelected([])
    setSolvedCategories([])
    setStrikes(0)
    setShake(false)
  }

  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-ink/5 px-4 py-3 sm:px-5"><button type="button" onClick={onExit} className="rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Exit Connections"><X size={19} /></button><div className="text-center"><p className="font-display text-sm font-bold">Connections</p><p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{config.title}</p></div><span className="text-xs font-bold text-ink/45">{strikes}/4 strikes</span></div><div className="p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coral"><Sparkles size={15} /> Sort the story</p><h2 className="mt-1 font-display text-3xl font-bold">Find four alike</h2></div><span className="text-xs font-bold text-ink/45">{solvedCategories.length}/{config.categories.length} groups</span></div><p className="mt-2 text-sm leading-6 text-ink/55">Select four tiles that share a biblical connection.</p><Progress value={(solvedCategories.length / config.categories.length) * 100} /><div className="mt-6 space-y-2">{solvedCategories.map((category, index) => <div key={category.name} className={`connections-solved-row rounded-2xl border-2 p-3 ${categoryColors[index % categoryColors.length]}`}><p className="text-sm font-bold">{category.name}</p><p className="mt-1 text-xs font-medium opacity-80">{category.items.join(' · ')}</p></div>)}</div>{items.length > 0 && <div className={`connections-grid mt-6 grid gap-2 ${shake ? 'connections-grid-shake' : ''}`} aria-label="Connections tile grid">{items.map((item) => <button key={item} type="button" onClick={() => toggleItem(item)} aria-pressed={selected.includes(item)} className={`min-h-20 rounded-2xl border-2 px-2 py-3 text-center text-xs font-bold leading-tight transition sm:min-h-24 sm:px-3 sm:text-sm ${selected.includes(item) ? 'border-ink bg-ink text-white shadow-lg' : 'border-ink/10 bg-[#f7f9f7] hover:border-ink/30 hover:bg-white'}`}>{item}</button>)}</div>}{!complete && !gameOver && <div className="mt-6 flex items-center justify-between gap-3"><p className="text-xs font-bold text-ink/45">{selected.length}/4 selected</p><Button onClick={submitGroup} disabled={selected.length !== 4}>Submit group</Button></div>}{complete && <div className="mt-6 rounded-2xl bg-[#eaf8ef] p-4 text-center text-sm font-bold text-[#287846]">Every connection found. Nicely sorted.</div>}{gameOver && <div role="alert" className="mt-6 rounded-2xl bg-[#fff0ee] p-4 text-center text-sm font-bold text-coral">Four strikes. Review the clues and try again.</div>}</div>{(complete || gameOver) && <div className="mt-1 flex gap-3 border-t border-ink/5 p-5"><Button className="flex-1" onClick={complete ? onExit : restart}>{complete ? 'Back to games' : 'Try again'}</Button>{complete && <Button variant="outline" onClick={restart} aria-label="Play Connections again"><RotateCcw size={18} /></Button>}</div>}</Card>
}
