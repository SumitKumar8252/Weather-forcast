import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFavorite } from '../features/favorites/favoritesSlice'
import { selectUnit } from '../features/settings/settingsSlice'
import useWeather from '../hooks/useWeather'
import { formatTemp, getWeatherIcon, groupForecastByDay, staleness } from '../utils/helpers'

// Condition → gradient palette
function getConditionStyle(description = '') {
  const d = description.toLowerCase()
  if (d.includes('thunder')) return { from: '#1a1035', via: '#312e81', accent: '#818cf8' }
  if (d.includes('rain') || d.includes('drizzle')) return { from: '#0c1a2e', via: '#1e3a5f', accent: '#60a5fa' }
  if (d.includes('snow')) return { from: '#0f172a', via: '#1e3a5f', accent: '#bae6fd' }
  if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return { from: '#111827', via: '#1f2937', accent: '#9ca3af' }
  if (d.includes('cloud')) return { from: '#0f1929', via: '#1e293b', accent: '#94a3b8' }
  if (d.includes('clear')) return { from: '#0c1f3f', via: '#1a3a6b', accent: '#fbbf24' }
  return { from: '#0f172a', via: '#1e3a5f', accent: '#3b82f6' }
}

// Large hero card — primary city
export function HeroCard({ city }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const unit = useSelector(selectUnit)
  const { data, loading, error } = useWeather(city)

  if (loading && !data) {
    return (
      <div className="relative rounded-[24px] overflow-hidden p-8 h-[320px]"
        style={{ background: 'linear-gradient(135deg, #0c1f3f 0%, #1a3a6b 100%)' }}>
        <div className="skeleton w-48 h-8 mb-4 opacity-40" />
        <div className="skeleton w-32 h-20 mb-3 opacity-40" />
        <div className="skeleton w-56 h-5 opacity-40" />
      </div>
    )
  }
  if (error || !data) return null

  const { current, forecast } = data
  const cs = getConditionStyle(current.weather[0].description)
  const icon = getWeatherIcon(current.weather[0].description)
  const daily = groupForecastByDay(forecast).slice(0, 3)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div
      className="relative rounded-[24px] overflow-hidden cursor-pointer group"
      style={{ background: `linear-gradient(135deg, ${cs.from} 0%, ${cs.via} 100%)` }}
      onClick={() => navigate(`/city/${encodeURIComponent(city)}`)}
    >
      {/* Subtle mesh overlay */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />

      {/* Remove button */}
      <button
        className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs flex items-center justify-center hover:bg-red-500/40 hover:text-white transition-all"
        onClick={e => { e.stopPropagation(); dispatch(removeFavorite(city)) }}
      >✕</button>

      <div className="relative z-[1] p-8 max-sm:p-6">
        {/* Greeting + city */}
        <p className="text-white/50 text-sm mb-1">{greeting}</p>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white text-4xl max-sm:text-3xl font-extrabold leading-none tracking-tight">
              {current.name}
            </h2>
            <p className="text-white/60 text-sm mt-1">{current.sys.country} · {current.weather[0].description}</p>
          </div>
          <span className="text-7xl max-sm:text-5xl leading-none" style={{ filter: `drop-shadow(0 0 20px ${cs.accent}60)` }}>
            {icon}
          </span>
        </div>

        {/* Big temp + H/L */}
        <div className="flex items-end gap-4 mt-4 mb-6">
          <span className="text-white text-[5.5rem] max-sm:text-[4rem] font-extrabold leading-none tracking-[-4px]">
            {formatTemp(current.main.temp, unit)}
          </span>
          <div className="mb-3 text-white/60 text-sm leading-relaxed">
            <div>Feels {formatTemp(current.main.feels_like, unit)}</div>
            <div className="flex gap-2">
              <span style={{ color: cs.accent }}>H:{formatTemp(current.main.temp_max, unit)}</span>
              <span className="text-white/40">L:{formatTemp(current.main.temp_min, unit)}</span>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { label: 'Humidity', val: `${current.main.humidity}%`, icon: '💧' },
            { label: 'Wind', val: `${Math.round(current.wind.speed * 3.6)} km/h`, icon: '💨' },
            { label: 'Visibility', val: `${(current.visibility / 1000).toFixed(1)} km`, icon: '👁' },
            { label: 'Pressure', val: `${current.main.pressure} hPa`, icon: '🌡️' },
          ].map(({ label, val, icon: ic }) => (
            <div key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span>{ic}</span>
              <span>{val}</span>
            </div>
          ))}
        </div>

        {/* Mini 3-day forecast strip */}
        <div className="flex gap-3 pt-5 border-t border-white/10">
          {daily.map(day => (
            <div key={day.date} className="flex items-center gap-2 flex-1">
              <span className="text-white/50 text-xs font-medium w-8">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-lg">{getWeatherIcon(day.condition)}</span>
              <div className="text-xs font-semibold ml-auto flex gap-1.5">
                <span style={{ color: cs.accent }}>{formatTemp(day.max, unit)}</span>
                <span className="text-white/40">{formatTemp(day.min, unit)}</span>
              </div>
            </div>
          ))}

          {/* Updated time */}
          <div className="ml-auto self-end text-white/30 text-[0.7rem]">
            {staleness(data.lastFetched)}
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px ${cs.accent}40` }} />
    </div>
  )
}

// Compact card — secondary cities
function CityCard({ city }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const unit = useSelector(selectUnit)
  const { data, loading, error } = useWeather(city)

  if (loading && !data) {
    return (
      <div className="relative bg-[#111827] border border-white/[0.08] rounded-[20px] p-5 overflow-hidden">
        <div className="skeleton w-28 h-5 mb-3 opacity-40" />
        <div className="skeleton w-20 h-10 mb-2 opacity-40" />
        <div className="skeleton w-36 h-4 opacity-40" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative bg-[#111827] border border-red-500/20 rounded-[20px] p-5 flex flex-col items-center gap-2 text-center">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-bold text-white">{city}</p>
        <p className="text-xs text-[#4a5a7a]">{error}</p>
        <button
          className="text-xs px-3 py-1 border border-white/10 rounded-lg text-[#8899bb] hover:border-red-500/50 hover:text-red-400 transition-all"
          onClick={() => dispatch(removeFavorite(city))}
        >Remove</button>
      </div>
    )
  }

  if (!data) return null

  const { current, forecast } = data
  const cs = getConditionStyle(current.weather[0].description)
  const icon = getWeatherIcon(current.weather[0].description)
  const daily = groupForecastByDay(forecast).slice(0, 3)

  return (
    <div
      className="relative rounded-[20px] overflow-hidden cursor-pointer group transition-transform duration-200 hover:-translate-y-1"
      style={{ background: `linear-gradient(145deg, ${cs.from} 0%, ${cs.via} 100%)` }}
      onClick={() => navigate(`/city/${encodeURIComponent(city)}`)}
    >
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />

      {/* Remove */}
      <button
        className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-white/10 border border-white/15 text-white/50 text-[0.65rem] flex items-center justify-center hover:bg-red-500/40 hover:text-white transition-all"
        onClick={e => { e.stopPropagation(); dispatch(removeFavorite(city)) }}
      >✕</button>

      <div className="relative z-[1] p-5">
        {/* City name + icon */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">{current.name}</h3>
            <p className="text-white/50 text-xs mt-0.5">{current.sys.country}</p>
          </div>
          <span className="text-3xl leading-none">{icon}</span>
        </div>

        {/* Temp */}
        <div className="text-white text-4xl font-extrabold leading-none tracking-tight mb-1">
          {formatTemp(current.main.temp, unit)}
        </div>
        <p className="text-white/50 text-xs capitalize mb-4">{current.weather[0].description}</p>

        {/* H/L + feels */}
        <div className="flex gap-3 text-xs mb-4">
          <span style={{ color: cs.accent }} className="font-semibold">H:{formatTemp(current.main.temp_max, unit)}</span>
          <span className="text-white/40 font-semibold">L:{formatTemp(current.main.temp_min, unit)}</span>
          <span className="text-white/40 ml-auto">Feels {formatTemp(current.main.feels_like, unit)}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-2 flex-wrap mb-4">
          {[
            { icon: '💧', val: `${current.main.humidity}%` },
            { icon: '💨', val: `${Math.round(current.wind.speed * 3.6)}km/h` },
          ].map(({ icon: ic, val }) => (
            <div key={val}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[0.72rem] text-white/70"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <span>{ic}</span><span>{val}</span>
            </div>
          ))}
        </div>

        {/* Mini forecast strip */}
        <div className="flex justify-between pt-3 border-t border-white/[0.08]">
          {daily.map(day => (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <span className="text-white/40 text-[0.65rem]">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-base">{getWeatherIcon(day.condition)}</span>
              <span className="text-[0.65rem] font-semibold" style={{ color: cs.accent }}>
                {formatTemp(day.max, unit)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px ${cs.accent}50` }} />
    </div>
  )
}

export default CityCard
