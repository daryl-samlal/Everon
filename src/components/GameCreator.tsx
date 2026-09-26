import { FormEvent, useState } from 'react'
import { ArrowLeft, Check, Gamepad2, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'

type GameForm = {
  name: string
  category: string
  reference: string
  translation: string
  verseText: string
  difficulty: string
}

const initialForm: GameForm = {
  name: '',
  category: 'Memory verse',
  reference: '',
  translation: 'ESV',
  verseText: '',
  difficulty: 'medium',
}

function wordsFromVerse(verseText: string) {
  return verseText.trim().split(/\s+/).filter(Boolean)
}

function shuffledWords(words: string[]) {
  return words.map((word, index) => ({ word, sort: (index * 17 + 11) % (words.length || 1) })).sort((a, b) => a.sort - b.sort).map(({ word }) => word)
}

export function GameCreator() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof GameForm, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSaved(false)
    if (!supabase) {
      setError('Connect Supabase before saving a game.')
      return
    }

    const words = wordsFromVerse(form.verseText)
    if (words.length < 2) {
      setError('Add the complete verse text before saving.')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You need to be signed in to save a game.')
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from('game_definitions').insert({
      owner_id: user.id,
      name: form.name.trim(),
      category: form.category,
      game_type: 'verse-slicer',
      reference: form.reference.trim(),
      translation: form.translation.trim() || 'ESV',
      verse_text: form.verseText.trim(),
      game_config: {
        gameId: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        reference: form.reference.trim(),
        translation: form.translation.trim() || 'ESV',
        scrambledWords: shuffledWords(words),
        correctOrder: words,
        difficulty: form.difficulty,
        speedSettings: { fallSpeed: form.difficulty === 'easy' ? 'slow' : form.difficulty === 'hard' ? 'fast' : 'medium', spawnIntervalMs: form.difficulty === 'easy' ? 900 : form.difficulty === 'hard' ? 450 : 650 },
      },
    })
    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSaved(true)
    setForm(initialForm)
  }

  return <div className="mx-auto max-w-3xl space-y-6"><div className="flex items-start gap-3"><button onClick={() => navigate('/games')} className="mt-1 rounded-xl p-2 text-ink/45 hover:bg-ink/5" aria-label="Back to games"><ArrowLeft size={20} /></button><div><p className="text-xs font-bold uppercase tracking-widest text-coral">Game studio</p><h1 className="mt-1 font-display text-4xl font-bold tracking-tight">Create a game</h1><p className="mt-2 max-w-lg text-sm leading-6 text-ink/55">Turn a memory verse into a playable Verse Slicer round. Your game will be saved to your account.</p></div></div><Card className="overflow-hidden"><div className="flex items-center gap-3 bg-ink px-6 py-5 text-white"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun text-ink"><Gamepad2 size={22} /></span><div><p className="font-display text-lg font-bold">Verse Slicer</p><p className="text-xs text-white/60">Words are generated from the verse text.</p></div></div><form onSubmit={submit} className="space-y-5 p-6"><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2 text-sm font-bold">Game name<input required maxLength={120} value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Sunday memory challenge" className="mt-1 min-h-12 w-full rounded-2xl border-2 border-ink/10 px-4 font-normal outline-none transition focus:border-coral" /></label><label className="space-y-2 text-sm font-bold">Category<select value={form.category} onChange={(event) => update('category', event.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 font-normal outline-none focus:border-coral"><option>Memory verse</option><option>Youth group</option><option>Small group</option><option>Sunday school</option></select></label><label className="space-y-2 text-sm font-bold">Verse reference<input required value={form.reference} onChange={(event) => update('reference', event.target.value)} placeholder="John 3:16" className="mt-1 min-h-12 w-full rounded-2xl border-2 border-ink/10 px-4 font-normal outline-none transition focus:border-coral" /></label><label className="space-y-2 text-sm font-bold">Translation<input value={form.translation} onChange={(event) => update('translation', event.target.value)} placeholder="ESV" className="mt-1 min-h-12 w-full rounded-2xl border-2 border-ink/10 px-4 font-normal outline-none transition focus:border-coral" /></label></div><label className="block space-y-2 text-sm font-bold">Verse text<textarea required rows={6} value={form.verseText} onChange={(event) => update('verseText', event.target.value)} placeholder="For God so loved the world..." className="mt-1 w-full rounded-2xl border-2 border-ink/10 px-4 py-3 font-normal leading-6 outline-none transition focus:border-coral" /><span className="block text-xs font-normal text-ink/45">Punctuation stays attached to each word so the original verse can be reconstructed.</span></label><label className="block space-y-2 text-sm font-bold">Difficulty<select value={form.difficulty} onChange={(event) => update('difficulty', event.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 font-normal outline-none focus:border-coral"><option value="easy">Easy · slower words</option><option value="medium">Medium · standard pace</option><option value="hard">Hard · faster pace</option></select></label>{error && <p role="alert" className="rounded-2xl bg-[#fff0ee] px-4 py-3 text-sm font-bold text-coral">{error}</p>}{saved && <p role="status" className="flex items-center gap-2 rounded-2xl bg-[#eaf8ef] px-4 py-3 text-sm font-bold text-[#287846]"><Check size={18} /> Game saved to your library.</p>}<div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => navigate('/games')}>Cancel</Button><Button type="submit" disabled={saving}><Save className="mr-2" size={17} />{saving ? 'Saving...' : 'Save game'}</Button></div></form></Card></div>
}