# 🌤 AtmosIQ — Weather Analytics Dashboard

> A production-grade weather analytics web app built with React, Redux Toolkit, Firebase, Tailwind CSS, and the OpenWeatherMap API.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)


---

## ✨ Features

| Category | Feature |
|---|---|
| **Dashboard** | Hero card for primary city + grid of all saved cities |
| **Live Data** | Current weather, 5-day & hourly forecasts via OpenWeatherMap |
| **Real-time** | Auto-refresh every 60 seconds with 60s client-side cache |
| **Charts** | Interactive temperature, precipitation & wind charts (Recharts) |
| **Charts** | 24h / 48h / 5-Day date-range toggling on all charts |
| **Analytics** | UV Index (color-coded severity), pressure, visibility, cloudiness |
| **Search** | Debounced city autocomplete using OpenWeatherMap Geocoding API |
| **Favorites** | Pin / unpin cities, persisted across sessions via localStorage |
| **Unit Toggle** | Celsius ↔ Fahrenheit — instant, no re-fetch |
| **Auth** | Firebase Email/Password + Google Sign-In, protected routes |
| **Design** | Dark theme, weather-condition gradients, fully responsive |

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| State | Redux Toolkit + React-Redux |
| Styling | Tailwind CSS v3 |
| Auth | Firebase Authentication |
| API | OpenWeatherMap  |
| Charts | Recharts |
| HTTP | Axios |
| Routing | React Router DOM v6 |

---

## 📂 Project Structure

```
weather-dashboard/
├── src/
│   ├── app/
│   │   └── store.js                     # Redux store with localStorage persistence
│   ├── features/
│   │   ├── weather/
│   │   │   ├── weatherSlice.js          # Thunks, 60s cache, selectors
│   │   │   └── weatherAPI.js            # Axios: current, forecast, search, UV
│   │   ├── favorites/
│   │   │   └── favoritesSlice.js        # Add / remove / reorder cities
│   │   ├── settings/
│   │   │   └── settingsSlice.js         # Unit preference (C°↔F°)
│   │   └── auth/
│   │       └── authSlice.js             # Firebase auth state in Redux
│   ├── firebase/
│   │   └── firebaseConfig.js            # Firebase initialisation (guarded)
│   ├── context/
│   │   └── AuthContext.jsx              # onAuthStateChanged → Redux sync
│   ├── pages/
│   │   ├── Dashboard.jsx                # Hero card + city grid
│   │   ├── CityDetail.jsx               # Full analytics for one city
│   │   ├── Login.jsx                    # Email/password + Google sign-in
│   │   └── Register.jsx                 # Account creation
│   ├── components/
│   │   ├── Navbar.jsx                   # Search bar, unit toggle, user menu
│   │   ├── CityCard.jsx                 # Summary card + HeroCard export
│   │   ├── ProtectedRoute.jsx           # Auth guard
│   │   ├── ErrorBoundary.jsx            # App-level crash protection
│   │   └── Charts/
│   │       ├── TemperatureChart.jsx     # Line chart (temp + feels-like)
│   │       ├── PrecipitationChart.jsx   # Combo bar+line (rain + humidity)
│   │       └── WindChart.jsx            # Area chart (wind speed)
│   ├── hooks/
│   │   ├── useWeather.js                # Fetch + auto-refresh every 60s
│   │   └── useSearch.js                 # Debounced geocoding autocomplete
│   ├── utils/
│   │   └── helpers.js                   # Temp conversion, icons, formatters
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                        # Tailwind directives + global base
├── .env                                 # Local secrets (not committed)
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- A free [OpenWeatherMap](https://openweathermap.org/api) API key
- A [Firebase](https://console.firebase.google.com) project with Authentication enabled



> ⚠️ **Important:** OpenWeatherMap API keys can take up to **2 hours** to activate after creation.

<!-- ### 3. Enable Firebase Authentication

In the [Firebase Console](https://console.firebase.google.com):
1. Go to **Authentication → Sign-in methods**
2. Enable **Email/Password**
3. Enable **Google**

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

--- -->


