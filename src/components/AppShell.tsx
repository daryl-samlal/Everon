import { BookOpen, Gamepad2, Home, LogOut, Plus, Trophy, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/devotionals', label: 'Devotionals', icon: BookOpen },
  { to: '/games', label: 'Games', icon: Gamepad2 },
  { to: '/leaderboard', label: 'Ranks', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export function AppShell() {
  return <div className="min-h-screen bg-[#f7f9f7] pb-24">
    <header className="safe-top sticky top-0 z-20 border-b border-ink/5 bg-[#f7f9f7]/95 px-5 pb-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2" aria-label="Everon home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-sun"><BookOpen size={20} strokeWidth={2.5} /></span>
          <span className="font-display text-xl font-bold tracking-tight">everon<span className="text-coral">.</span></span>
        </NavLink>
        <div className="flex items-center gap-2"><NavLink to="/create-game" className="flex items-center gap-2 rounded-xl bg-coral px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#dd5c50]" title="Create a game"><Plus size={16} /> <span className="hidden sm:inline">Create game</span></NavLink><div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-ink/60 shadow-sm sm:flex"><span className="h-2 w-2 rounded-full bg-[#65c18c]" /> Group online</div><button type="button" onClick={() => supabase?.auth.signOut()} className="rounded-xl p-2 text-ink/45 transition hover:bg-ink/5 hover:text-ink" aria-label="Log out" title="Log out"><LogOut size={19} /></button></div>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-6"><Outlet /></main>
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-ink/5 bg-white/95 px-4 pt-3 shadow-[0_-8px_28px_rgba(16,42,67,.07)] backdrop-blur-md">
      <div className="mx-auto flex max-w-lg justify-around">
        {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cn('flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-bold transition', isActive ? 'text-coral' : 'text-ink/40')}><Icon size={21} strokeWidth={2.25} /><span>{label}</span></NavLink>)}
      </div>
    </nav>
  </div>
}
