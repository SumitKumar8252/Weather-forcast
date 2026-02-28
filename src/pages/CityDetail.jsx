import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { addFavorite, removeFavorite, selectFavorites } from '../features/favorites/favoritesSlice'
import { selectUnit } from '../features/settings/settingsSlice'
import useWeather from '../hooks/useWeather'
import {
  formatTemp, getWeatherIcon, groupForecastByDay,
  formatHourlyData, windDirection, staleness, uvLabel
} from '../utils/helpers'
import TemperatureChart from '../components/Charts/TemperatureChart'
import PrecipitationChart from '../components/Charts/PrecipitationChart'
import WindChart from '../components/Charts/WindChart'

const CHART_TABS = ['Temperature', 'Precipitation', 'Wind']
const RANGE_TABS = [
  { label: '24h', slots: 8 },
  { label: '48h', slots: 16 },
  { label: '5 Day', slots: 40 },
]

function CityDetail() {
  const { cityName } = useParams()
  const city = decodeURIComponent(cityName)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const unit = useSelector(selectUnit)
  const favorites = useSelector(selectFavorites)
  const isFav = favorites.includes(city)
  const [activeTab, setActiveTab] = useState('Temperature')
  const [activeRange, setActiveRange] = useState('24h')

  const { data, loading, error, refresh } = useWeather(city)

  const toggleFav = () => isFav ? dispatch(removeFavorite(city)) : dispatch(addFavorite(city))

  if (loading && !data) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="spinner" />
          <p className="text-text-muted mt-4">Loading weather data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-accent-red">⚠️ {error}</p>
          <button
            className="text-sm text-text-secondary px-3.5 py-2 border border-white/[0.08] rounded-lg bg-bg-card hover:text-text-primary hover:border-white/[0.16] transition-all duration-200"
            onClick={() => navigate('/')}
          >← Back</button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { current, forecast, uvi } = data
  const dailyForecast = groupForecastByDay(forecast)
  const rangeSlots = RANGE_TABS.find(r => r.label === activeRange)?.slots ?? 8
  const hourlyData = formatHourlyData(forecast, unit, rangeSlots)
  const icon = getWeatherIcon(current.weather[0].description)
  const uvInfo = uvi != null ? uvLabel(uvi) : null

  const chartData = {
    Temperature: <TemperatureChart data={hourlyData} unit={unit} />,
    Precipitation: <PrecipitationChart data={hourlyData} />,
    Wind: <WindChart data={hourlyData} />,
  }

  // Build stat cards, inserting UV index when available
  const statCards = [
    { label: 'Humidity', value: `${current.main.humidity}%`, icon: '💧' },
    { label: 'Wind', value: `${Math.round(current.wind.speed * 3.6)} km/h ${windDirection(current.wind.deg)}`, icon: '💨' },
    { label: 'Pressure', value: `${current.main.pressure} hPa`, icon: '🌡️' },
    { label: 'Visibility', value: `${(current.visibility / 1000).toFixed(1)} km`, icon: '👁️' },
    { label: 'Cloudiness', value: `${current.clouds.all}%`, icon: '☁️' },
    { label: 'Sea Level', value: `${current.main.sea_level || current.main.pressure} hPa`, icon: '🌊' },
  ]
  if (uvInfo) {
    statCards.push({ label: 'UV Index', value: `${uvi.toFixed(1)} — ${uvInfo.label}`, icon: '🔆', uvColor: uvInfo.color })
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8 pb-16 max-sm:px-4 max-sm:py-5 max-sm:pb-12">

      {/* Top nav */}
      <div className="flex justify-between items-center mb-8">
        <button
          className="text-sm text-text-secondary px-3.5 py-2 border border-white/[0.08] rounded-lg bg-bg-card hover:text-text-primary hover:border-white/[0.16] transition-all duration-200"
          onClick={() => navigate('/')}
        >← Dashboard</button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-text-muted">{staleness(data.lastFetched)}</span>
          <button
            className="px-3 py-2 border border-white/[0.08] rounded-lg bg-bg-card text-text-secondary text-base hover:border-accent hover:text-accent hover:rotate-[30deg] transition-all duration-200"
            onClick={refresh} title="Refresh"
          >↻</button>
          <button
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${isFav
                ? 'bg-accent-warm/10 border-accent-warm text-accent-warm'
                : 'bg-bg-card border-white/[0.08] text-text-secondary hover:border-accent-warm hover:text-accent-warm'
              }`}
            onClick={toggleFav}
          >{isFav ? '★ Saved' : '☆ Save'}</button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative flex justify-between items-center mb-8 p-10 bg-bg-card border border-white/[0.08] rounded-card overflow-hidden animate-fade-up before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/[0.08] before:to-transparent before:pointer-events-none max-sm:flex-col max-sm:gap-4 max-sm:text-center max-sm:p-6">
        <div className="z-[1]">
          <h1 className="font-display text-5xl max-sm:text-3xl font-extrabold text-text-primary leading-none mb-1.5 tracking-[-1.5px]">
            {current.name}
          </h1>
          <p className="text-sm text-text-secondary capitalize mb-5">
            {current.sys.country} · {current.weather[0].description}
          </p>
          <div className="font-display text-[5rem] max-sm:text-[3.5rem] font-extrabold text-text-primary leading-none tracking-[-3px]">
            {formatTemp(current.main.temp, unit)}
          </div>
          <p className="text-sm text-text-muted mt-2">
            Feels like {formatTemp(current.main.feels_like, unit)} · H:{formatTemp(current.main.temp_max, unit)} L:{formatTemp(current.main.temp_min, unit)}
          </p>
        </div>
        <div className="text-[7rem] max-sm:text-[4rem] leading-none opacity-85" style={{ filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.3))' }}>
          {icon}
        </div>
      </div>

      {/* Stats grid — includes UV index when available */}
      <div className="grid gap-3 mb-10" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {statCards.map(({ label, value, icon: si, uvColor }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-4 bg-bg-card border border-white/[0.08] rounded-[10px] animate-fade-up transition-colors duration-200 hover:border-white/[0.16]"
          >
            <span className="text-2xl">{si}</span>
            <div>
              <p className="text-[0.72rem] text-text-muted mb-0.5">{label}</p>
              <p
                className="text-[0.95rem] font-semibold"
                style={{ color: uvColor ?? '#f0f4ff' }}
              >{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 5-day forecast */}
      <section className="mb-9">
        <h2 className="font-display text-[1.2rem] font-bold text-text-primary mb-4">5-Day Forecast</h2>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {dailyForecast.slice(0, 6).map((day) => (
            <div
              key={day.date}
              className="flex-none min-w-[140px] flex flex-col items-center gap-1.5 px-4 py-5 bg-bg-card border border-white/[0.08] rounded-[10px] text-center transition-all duration-200 hover:border-white/[0.16] hover:-translate-y-0.5"
            >
              <p className="text-[0.78rem] text-text-muted font-medium">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <span className="text-[1.8rem]">{getWeatherIcon(day.condition)}</span>
              <p className="text-[0.72rem] text-text-secondary capitalize">{day.condition}</p>
              <div className="flex gap-2 text-sm font-semibold">
                <span className="text-accent-warm">{formatTemp(day.max, unit)}</span>
                <span className="text-accent-cool">{formatTemp(day.min, unit)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts with tab + date-range selector */}
      <section className="mb-9">
        {/* Header row: chart type tabs (left) + date range (right) */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-[1.2rem] font-bold text-text-primary">Hourly Trends</h2>
            {/* Chart type tabs */}
            <div className="flex gap-1 ml-3">
              {CHART_TABS.map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-[7px] border text-xs transition-all duration-150 ${activeTab === t
                      ? 'bg-accent border-accent text-white'
                      : 'bg-bg-card border-white/[0.08] text-text-secondary hover:border-white/[0.16] hover:text-text-primary'
                    }`}
                  onClick={() => setActiveTab(t)}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Date range selector */}
          <div className="flex gap-1 bg-bg-secondary border border-white/[0.08] rounded-[8px] p-0.5">
            {RANGE_TABS.map(({ label }) => (
              <button
                key={label}
                className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-all duration-150 ${activeRange === label
                    ? 'bg-bg-card text-text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                  }`}
                onClick={() => setActiveRange(label)}
              >{label}</button>
            ))}
          </div>
        </div>

        <div className="bg-bg-card border border-white/[0.08] rounded-card px-4 pt-6 pb-2">
          {chartData[activeTab]}
        </div>
      </section>
    </div>
  )
}

export default CityDetail
