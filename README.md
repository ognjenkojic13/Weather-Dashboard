<img width="1264" height="695" alt="wad" src="https://github.com/user-attachments/assets/b2db503f-d3d2-4d71-a0b7-d372a7e20fb0" />
# WeatherScope

A responsive weather dashboard built with React and Vite. Search any city and get current conditions, an hourly strip, and a 7-day temperature graph — all with dynamic backgrounds that change based on weather and time of day.

## Features

- City search with recent searches (up to 5, persisted in localStorage)
- Current temperature with animated count-up transition
- Feels like, hi/lo, humidity, wind, pressure, visibility, precipitation
- Temperature trend indicator (rising / falling)
- 24-hour hourly strip with precipitation probability
- 7-day temperature wave graph
- °C / °F toggle
- Dynamic weather backgrounds (clear, clouds, rain, snow, thunderstorm, fog) with day/night variants
- City photo pulled from Wikipedia
- Local time and date displayed in the city's timezone
- Loading and error states
- Fully responsive (mobile, tablet, desktop)

## Tech Stack

- React 18
- Vite
- Axios
- [Open-Meteo API](https://open-meteo.com/) — free, no API key required
- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) — for city photos

## Getting Started

### Prerequisites

- Node.js 18+

### Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── WeatherDashboard.jsx   # Main dashboard layout
│   ├── SearchBar.jsx          # Search input with recent suggestions
│   ├── WeatherBackground.jsx  # Animated background (weather + city photo)
│   ├── TempWaveGraph.jsx      # 7-day SVG temperature graph
│   ├── HourlyStrip.jsx        # Hourly forecast row
│   ├── CurrentWeather.jsx
│   ├── WeatherDetails.jsx
│   ├── WeatherVisual.jsx
│   ├── Forecast.jsx
│   ├── ForecastCard.jsx
│   ├── Loading.jsx
│   └── ErrorMessage.jsx
├── services/
│   └── weatherApi.js          # All API calls (geocoding, forecast, city photo)
├── utils/
│   ├── formatters.js          # Temperature formatting, capitalization
│   └── helpers.js             # localStorage, wind direction
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```

## API Notes

This app uses **Open-Meteo**, which is completely free and requires no API key. No `.env` file is needed.

Data fetched per search:
- Geocoding via `geocoding-api.open-meteo.com`
- Current conditions, 24h hourly, and 7-day daily forecast via `api.open-meteo.com`
- City thumbnail via Wikipedia REST API (best-effort, silently skipped if unavailable)

## Error Handling

| Scenario | Behavior |
|---|---|
| Empty input | Inline error message |
| City not found | "City not found" error |
| Network error | "Check your connection" error |
| Missing API fields | Fallback values shown, app does not crash |

## Responsive Breakpoints

| Range | Layout |
|---|---|
| ≤ 767px | Single column, stacked |
| 768px – 1023px | Tablet layout |
| ≥ 1024px | Full dashboard layout |
