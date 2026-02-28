import { useSelector } from 'react-redux'
import { selectFavorites } from '../features/favorites/favoritesSlice'
import CityCard, { HeroCard } from '../components/CityCard'

function Dashboard() {
  const favorites = useSelector(selectFavorites)

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 max-sm:px-4 max-sm:py-5">

      {/* ── Top bar ── */}
      <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">My Weather</h1>
          <p className="text-[#8899bb] text-sm mt-0.5">{dateStr} · {timeStr}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.72rem] font-semibold text-[#10b981]"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse-glow" />
          Live · auto-refresh 60s
        </div>
      </div>

      {/* ── Empty state ── */}
      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            🌍
          </div>
          <h2 className="font-display text-xl font-bold text-[#8899bb]">No cities yet</h2>
          <p className="text-sm text-[#4a5a7a] max-w-xs">
            Use the search bar above to find a city and pin it to your dashboard.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#8899bb] mt-2 px-4 py-2 rounded-full"
            style={{ border: '1px dashed rgba(255,255,255,0.12)' }}>
            <span>🔍</span> Search for a city to get started
          </div>
        </div>
      )}

      {/* ── Hero card (first city) ── */}
      {favorites.length >= 1 && (
        <div className="mb-6">
          <HeroCard city={favorites[0]} />
        </div>
      )}

      {/* ── Section label for other cities ── */}
      {favorites.length > 1 && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[#8899bb] text-xs font-semibold uppercase tracking-widest">Other Cities</h2>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[#4a5a7a] text-xs">{favorites.length - 1} saved</span>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
          >
            {favorites.slice(1).map(city => (
              <CityCard key={city} city={city} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
