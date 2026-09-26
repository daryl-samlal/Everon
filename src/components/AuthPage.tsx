import { FormEvent, useState } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'

type AuthMode = 'login' | 'signup'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (!supabase) {
      setError('Authentication is not configured. Add the Supabase environment variables and try again.')
      return
    }

    setSubmitting(true)
    const result = isSignup
      ? await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName.trim() || 'New player' } },
      })
      : await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    if (isSignup && !result.data.session) {
      setMessage('Account created. Check your email to confirm your account, then log in.')
      setMode('login')
      setPassword('')
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#f7f9f7] px-5 py-10">
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center justify-center gap-2">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sun"><BookOpen size={22} strokeWidth={2.5} /></span>
        <span className="font-display text-2xl font-bold tracking-tight">everon<span className="text-coral">.</span></span>
      </div>
      <Card className="p-6 sm:p-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-widest text-coral">Your community awaits</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/55">{isSignup ? 'Join the games, track your progress, and grow together.' : 'Log in to continue your Everon journey.'}</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {isSignup && <label className="block text-sm font-bold">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 font-normal outline-none transition focus:border-coral" placeholder="How should we call you?" autoComplete="name" /></label>}
          <label className="block text-sm font-bold">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 font-normal outline-none transition focus:border-coral" placeholder="you@example.com" autoComplete="email" /></label>
          <label className="block text-sm font-bold">Password<input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border-2 border-ink/10 bg-white px-4 font-normal outline-none transition focus:border-coral" placeholder="At least 6 characters" autoComplete={isSignup ? 'new-password' : 'current-password'} /></label>
          {error && <p role="alert" className="rounded-2xl bg-[#fff0ee] px-4 py-3 text-sm font-bold text-coral">{error}</p>}
          {message && <p role="status" className="rounded-2xl bg-[#eaf8ef] px-4 py-3 text-sm font-bold text-[#287846]">{message}</p>}
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'} <ArrowRight className="ml-2" size={18} /></Button>
        </form>
        <div className="mt-6 border-t border-ink/5 pt-5 text-center text-sm text-ink/55">
          {isSignup ? 'Already have an account?' : 'New to Everon?'}{' '}
          <button type="button" onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError(null); setMessage(null) }} className="font-bold text-coral">{isSignup ? 'Log in' : 'Create an account'}</button>
        </div>
      </Card>
    </div>
  </main>
}
