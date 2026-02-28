// Temperature conversion
export const convertTemp = (tempC, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round(tempC * 9/5 + 32)
  }
  return Math.round(tempC)
}

export const unitSymbol = (unit) => unit === 'fahrenheit' ? '°F' : '°C'

export const formatTemp = (tempC, unit) =>
  `${convertTemp(tempC, unit)}${unitSymbol(unit)}`

// Weather condition → emoji icon
export const getWeatherIcon = (condition) => {
  const c = condition?.toLowerCase() || ''
  if (c.includes('thunder')) return '⛈️'
  if (c.includes('drizzle')) return '🌦️'
  if (c.includes('rain')) return '🌧️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️'
  if (c.includes('cloud')) return '☁️'
  if (c.includes('clear')) return '☀️'
  return '🌤️'
}

// Wind direction from degrees
export const windDirection = (deg) => {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

// Group 3-hourly forecast into daily buckets
export const groupForecastByDay = (forecastList) => {
  const days = {}
  forecastList?.forEach((item) => {
    const date = item.dt_txt.split(' ')[0]
    if (!days[date]) days[date] = []
    days[date].push(item)
  })
  return Object.entries(days).map(([date, items]) => {
    const temps = items.map((i) => i.main.temp)
    return {
      date,
      min: Math.min(...temps),
      max: Math.max(...temps),
      condition: items[Math.floor(items.length / 2)].weather[0].description,
      icon: items[Math.floor(items.length / 2)].weather[0].icon,
      items,
    }
  })
}

// Format hourly data for charts — count controls how many 3-hour slots to include
// 8 slots ≈ 24h, 16 slots ≈ 48h, 40 slots ≈ 5 days
export const formatHourlyData = (forecastList, unit, count = 8) => {
  return forecastList?.slice(0, count).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: convertTemp(item.main.temp, unit),
    feelsLike: convertTemp(item.main.feels_like, unit),
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed * 3.6), // m/s to km/h
    precipitation: (item.pop * 100).toFixed(0),
  })) || []
}

// UV Index label
export const uvLabel = (uvi) => {
  if (uvi <= 2) return { label: 'Low', color: '#4ade80' }
  if (uvi <= 5) return { label: 'Moderate', color: '#facc15' }
  if (uvi <= 7) return { label: 'High', color: '#fb923c' }
  if (uvi <= 10) return { label: 'Very High', color: '#f87171' }
  return { label: 'Extreme', color: '#c084fc' }
}

// Time since last fetch
export const staleness = (lastFetched) => {
  if (!lastFetched) return null
  const seconds = Math.floor((Date.now() - lastFetched) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  return `${Math.floor(seconds / 60)}m ago`
}
