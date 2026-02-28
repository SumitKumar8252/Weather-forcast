# 🌤 AtmosIQ — Weather Analytics Dashboard

A production-grade Weather Analytics Dashboard built with React, Redux Toolkit, Recharts, and the OpenWeatherMap API.

---

## 📁 Folder Structure

```
weather-dashboard/
├── public/
├── src/
│   ├── app/
│   │   └── store.js                  ← Redux store (with localStorage persistence)
│   ├── features/
│   │   ├── weather/
│   │   │   ├── weatherSlice.js       ← Async thunks, caching logic, selectors
│   │   │   └── weatherAPI.js         ← Axios API calls (current, forecast, search)
│   │   ├── favorites/
│   │   │   └── favoritesSlice.js     ← Add/remove/reorder favorite cities
│   │   └── settings/
│   │       └── settingsSlice.js      ← Celsius ↔ Fahrenheit preference
│   ├── pages/
│   │   ├── Dashboard.jsx             ← City cards grid, main screen
│   │   ├── Dashboard.module.css
│   │   ├── CityDetail.jsx            ← Deep analytics for a single city
│   │   └── CityDetail.module.css
│   ├── components/
│   │   ├── Navbar.jsx                ← Search bar, unit toggle
│   │   ├── Navbar.module.css
│   │   ├── CityCard.jsx              ← Summary card with live data
│   │   ├── CityCard.module.css
│   │   └── Charts/
│   │       ├── TemperatureChart.jsx  ← Line chart (temp + feels like)
│   │       ├── PrecipitationChart.jsx← Combo bar+line (rain chance + humidity)
│   │       └── WindChart.jsx         ← Area chart (wind speed)
│   ├── hooks/
│   │   ├── useWeather.js             ← Fetch + auto-refresh every 60s
│   │   └── useSearch.js              ← Debounced city autocomplete
│   ├── utils/
│   │   └── helpers.js                ← Temp conversion, icons, data formatters
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── vite.config.js
└── package.json
```

---

## 🚀 Setup Instructions

### 1. Clone and install
```bash
git clone <your-repo>
cd weather-dashboard
npm install
```

### 2. Get a free API key
- Go to https://openweathermap.org/api
- Sign up → My API Keys → Copy your key
- The free tier includes current weather, 5-day forecast, and geocoding

### 3. Create your `.env` file
```bash
cp .env.example .env
```
Then edit `.env`:
```
VITE_WEATHER_API_KEY=paste_your_key_here
```

### 4. Run the dev server
```bash
npm run dev
```
Open http://localhost:5173

---

## 🔑 Key Architecture Decisions

### State Shape (Redux)
```js
{
  weather: {
    cities: {
      "London": {
        current: { ... },      // OpenWeatherMap /weather response
        forecast: [ ... ],     // OpenWeatherMap /forecast list
        lastFetched: 1234567   // Unix ms timestamp for cache check
      }
    },
    loading: { "London": false },
    errors:  { "London": null }
  },
  favorites: {
    list: ["London", "New York"]  // Persisted to localStorage
  },
  settings: {
    unit: "celsius"               // Persisted to localStorage
  }
}
```

### Caching (60s)
In `weatherSlice.js`, every `fetchCityWeather` thunk checks `lastFetched` before making an API call:
```js
if (existing && now - existing.lastFetched < 60000) return null // use cache
```

### Auto-refresh
`useWeather.js` sets a `setInterval` that re-runs the fetch every 60 seconds. The cache check means it only hits the network if data is actually stale.

### Temperature conversion
All temperatures are stored in **Celsius** internally. Conversion happens only at display time via `formatTemp(tempC, unit)` in `utils/helpers.js`. This means toggling Celsius/Fahrenheit instantly updates every number on screen without any re-fetching.

### Debounced Search
`useSearch.js` waits 300ms after the user stops typing before calling the geocoding API, preventing rate limit abuse.

---

## ✅ Features Checklist

| Feature | Status |
|---------|--------|
| City cards on dashboard | ✅ |
| Real-time weather (OpenWeatherMap) | ✅ |
| Auto-refresh every 60s | ✅ |
| 60s cache (no duplicate API calls) | ✅ |
| Search with autocomplete (debounced) | ✅ |
| Favorite cities (persisted) | ✅ |
| 5-day forecast | ✅ |
| Hourly charts (temp, rain, wind) | ✅ |
| Celsius ↔ Fahrenheit toggle | ✅ |
| Responsive design (mobile) | ✅ |
| Loading skeletons | ✅ |
| Error handling | ✅ |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI framework |
| `react-router-dom` | Page routing |
| `@reduxjs/toolkit` | State management |
| `react-redux` | React-Redux bindings |
| `axios` | HTTP requests |
| `recharts` | Charts (line, bar, area) |
| `vite` | Dev server + bundler |

---

## 🔮 Bonus Features (To Add)

### Google Sign-In with Firebase
```bash
npm install firebase
```
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Google Sign-In under Authentication
3. Add `firebaseConfig` to a new `src/firebase.js` file
4. After login, save/load favorites from Firestore using the user's UID

### Bonus: Redux Persist (simpler persistence)
```bash
npm install redux-persist
```
Replace the manual `localStorage` sync in `store.js` with `redux-persist` for more robust persistence.
