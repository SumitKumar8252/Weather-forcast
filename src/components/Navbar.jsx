import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { addFavorite } from '../features/favorites/favoritesSlice'
import { toggleUnit, selectUnit } from '../features/settings/settingsSlice'
import { selectUser } from '../features/auth/authSlice'
import useSearch from '../hooks/useSearch'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unit = useSelector(selectUnit)
  const user = useSelector(selectUser)
  const { query, setQuery, suggestions, searching, clear } = useSearch()
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const ref = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (cityName) => {
    dispatch(addFavorite(cityName))
    navigate(`/city/${encodeURIComponent(cityName)}`)
    clear()
    setOpen(false)
  }

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const initials = user
    ? (user.displayName
      ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : user.email?.[0]?.toUpperCase() ?? '?')
    : '?'

  return (
    <nav className="sticky top-0 z-[100] flex items-center gap-4 px-8 py-3.5 bg-[rgba(7,8,15,0.85)] backdrop-blur-[20px] border-b border-white/[0.08]">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
        <span className="text-2xl">🌤</span>
        <span className="font-display text-[1.3rem] font-extrabold text-text-primary tracking-tight sm:block hidden">AtmosIQ</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-[420px] relative" ref={ref}>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-bg-card border border-white/[0.08] rounded-[10px] transition-colors duration-200 focus-within:border-accent">
          <span className="text-sm opacity-50">🔍</span>
          <input
            className="flex-1 text-sm text-text-primary bg-transparent border-none outline-none placeholder:text-text-muted"
            placeholder="Search city..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => setOpen(true)}
          />
          {searching && (
            <span className="w-3.5 h-3.5 border-2 border-white/[0.08] border-t-accent rounded-full animate-spin-fast flex-shrink-0" />
          )}
        </div>
        {open && suggestions.length > 0 && (
          <ul className="absolute top-[calc(100%+6px)] left-0 right-0 bg-bg-card border border-white/[0.08] rounded-[10px] overflow-hidden list-none shadow-lg z-[200]">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="flex justify-between items-center px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-white/[0.04]"
                onClick={() => handleSelect(s.name)}
              >
                <span className="text-sm font-medium text-text-primary">{s.name}</span>
                <span className="text-xs text-text-secondary">{s.state ? `${s.state}, ` : ''}{s.country}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 ml-auto flex-shrink-0">
        {/* Unit toggle */}
        <button
          className="flex items-center gap-1 px-4 py-2 bg-bg-card border border-white/[0.08] rounded-lg text-sm font-semibold text-text-secondary transition-colors duration-200 hover:border-white/[0.16] flex-shrink-0"
          onClick={() => dispatch(toggleUnit())}
          title="Toggle temperature unit"
        >
          <span className={unit === 'celsius' ? 'text-accent' : ''}>°C</span>
          <span className="opacity-30">/</span>
          <span className={unit === 'fahrenheit' ? 'text-accent' : ''}>°F</span>
        </button>

        {/* User menu */}
        {user && (
          <div className="relative" ref={userMenuRef}>
            <button
              className="w-9 h-9 rounded-full border-2 border-white/[0.08] bg-bg-card flex items-center justify-center overflow-hidden transition-all duration-200 hover:border-accent hover:scale-105 p-0"
              onClick={() => setUserMenuOpen(v => !v)}
              title={user.displayName || user.email}
            >
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                : <span className="text-xs font-bold text-accent tracking-wide">{initials}</span>
              }
            </button>

            {userMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[200px] bg-bg-card border border-white/[0.08] rounded-[10px] shadow-lg z-[300] overflow-hidden animate-fade-up">
                <div className="flex flex-col gap-0.5 px-3.5 py-3">
                  <span className="text-sm font-semibold text-text-primary truncate">{user.displayName || 'User'}</span>
                  <span className="text-xs text-text-secondary truncate">{user.email}</span>
                </div>
                <hr className="border-none border-t border-white/[0.08] m-0" />
                <button
                  className="w-full text-left px-3.5 py-2.5 text-sm font-medium text-accent-red bg-transparent border-none cursor-pointer transition-colors duration-150 hover:bg-red-500/[0.08] font-body"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
