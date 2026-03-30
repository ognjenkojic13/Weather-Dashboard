import { useState, useEffect, useRef, useMemo } from 'react'
import TempWaveGraph from './TempWaveGraph'
import SearchBar from './SearchBar'
import { formatTemp } from '../utils/formatters'
import { getWindDirection } from '../utils/helpers'
import { getWeatherDescription } from '../services/weatherApi'

const ACCENTS = {
  clear:        { day: '#fbbf24', night: '#a5b4fc' },
  clouds:       '#94a3b8',
  rain:         '#60a5fa',
  drizzle:      '#7dd3fc',
  thunderstorm: '#c084fc',
  snow:         '#bae6fd',
  fog:          '#9ca3af',
}

function getAccent(condition, isDay) {
  const a = ACCENTS[condition] || '#ffffff'
  return typeof a === 'object' ? (isDay ? a.day : a.night) : a
}

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target)
  const prevRef = useRef(target)
  const rafRef  = useRef(null)

  useEffect(() => {
    const from = prevRef.current
    const to   = target
    if (from === to) return
    cancelAnimationFrame(rafRef.current)
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(from + (to - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else prevRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

export default function WeatherDashboard({
  data, unit, isDay, localTime, localDate,
  onSearch, onUnitToggle, loading, recentSearches, condition,
}) {
  const { location, weather } = data
  const current = weather.current
  const daily   = weather.daily
  const hourly  = weather.hourly

  const rawTemp     = Math.round(current.temperature_2m ?? 0)
  const animatedRaw = useCountUp(rawTemp)
  const displayTemp = unit === 'F'
    ? `${Math.round(animatedRaw * 9 / 5 + 32)}°F`
    : `${animatedRaw}°C`

  const feelsLike = formatTemp(current.apparent_temperature, unit)
  const tempMax   = daily?.temperature_2m_max?.[0] != null ? formatTemp(daily.temperature_2m_max[0], unit) : null
  const tempMin   = daily?.temperature_2m_min?.[0] != null ? formatTemp(daily.temperature_2m_min[0], unit) : null

  const description = getWeatherDescription(current.weather_code)
  const words    = description.split(' ')
  const headWord = words[0]
  const subWords = words.slice(1).join(' ')

  const windSpeed = current.wind_speed_10m != null ? `${current.wind_speed_10m.toFixed(0)} km/h` : '—'
  const windDir   = getWindDirection(current.wind_direction_10m || 0)
  const humidity  = current.relative_humidity_2m != null ? `${current.relative_humidity_2m}%` : '—'
  const pressure  = current.pressure_msl ? `${Math.round(current.pressure_msl)} hPa` : '—'
  const visibility = current.visibility != null ? `${(current.visibility / 1000).toFixed(0)} km` : '—'
  const precipitation = current.precipitation != null ? `${current.precipitation} mm` : '—'

  const tempTrend = useMemo(() => {
    if (!hourly?.temperature_2m) return null
    const curr   = hourly.temperature_2m[0]
    const before = hourly.temperature_2m[3]
    if (curr == null || before == null) return null
    const diff = curr - before
    if (Math.abs(diff) < 0.5) return 'stable'
    return diff > 0 ? 'up' : 'down'
  }, [hourly])

  const currentHourIndex = useMemo(() => {
    if (!hourly?.time) return 0
    const nowHour = `${new Date().getHours().toString().padStart(2, '0')}:00`
    const idx = hourly.time.findIndex(t => t?.split('T')[1]?.slice(0, 5) === nowHour)
    return idx >= 0 ? idx : 0
  }, [hourly])

  const nextHours = useMemo(() => {
    if (!hourly) return []
    return Array.from({ length: 24 }, (_, i) => {
      const idx = currentHourIndex + i
      return {
        time: hourly.time[idx]?.split('T')[1]?.slice(0, 5),
        temp: formatTemp(hourly.temperature_2m[idx], unit),
        pop:  hourly.precipitation_probability[idx],
        isCurrent: i === 0,
      }
    })
  }, [hourly, currentHourIndex, unit])

  const accent = getAccent(condition, isDay)

  const stats = [
    { label: 'Humidity',   value: humidity },
    { label: 'Wind',       value: `${windSpeed} ${windDir}` },
    { label: 'Visibility', value: visibility },
    { label: 'Pressure',   value: pressure },
    { label: 'Precip.',    value: precipitation },
  ]

  return (
    <div className="dashboard" style={{ '--accent': accent }}>

      <header className="dash-header">
        <div className="dash-brand">
          <span className="dash-brand-icon"></span>
          <span className="dash-brand-text">Weather app</span>
        </div>
        <div className="dash-search-wrap">
          <SearchBar onSearch={onSearch} recentSearches={recentSearches} loading={loading} />
        </div>
        <div className="dash-header-right">
          {loading && <span className="dash-loading-dot" title="Loading…" />}
          <div className="dash-datetime">
            <span className="dash-time">{localTime}</span>
            <span className="dash-date">{localDate}</span>
          </div>
          <button className="unit-toggle" onClick={onUnitToggle}>°{unit === 'C' ? 'F' : 'C'}</button>
        </div>
      </header>

      <main className="dash-main">

        <div className="dash-city-overlay">
          <div className={`dash-city-name${location.name.length > 20 ? ' dash-city-name--wrap' : ''}`}>
            {location.name.toUpperCase()}
          </div>
          {location.country && <div className="dash-city-country">{location.country}</div>}
        </div>

        <div className="dash-left">
          <div className="condition-hero">
            <span className="condition-word">{headWord}</span>
            {subWords && (
              <span className="condition-sub" style={{ color: accent }}>{subWords}</span>
            )}
          </div>
          <div className="dash-stats">
            {stats.map(s => (
              <StatRow key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>

        <div className="dash-center" />

        <div className="dash-right">
          <div className="dash-temp-wrap">
            <span className="dash-temp">{displayTemp}</span>
            {tempTrend && tempTrend !== 'stable' && (
              <span className={`dash-trend dash-trend--${tempTrend}`}>
                {tempTrend === 'up' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <span className="dash-feels">Feels like {feelsLike}</span>
          {tempMax && tempMin && (
            <div className="dash-hi-lo">
              <span className="dash-hi">{tempMax}</span>
              <span className="dash-sep"> / </span>
              <span className="dash-lo">{tempMin}</span>
            </div>
          )}
        </div>

      </main>

      <div className="dash-hourly">
        {nextHours.map((h, i) => (
          <div
            key={i}
            className={`hour-item${h.isCurrent ? ' hour-item--current' : ''}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <span className="hi-time">{h.isCurrent ? 'Now' : h.time}</span>
            <span className="hi-temp">{h.temp}</span>
            {h.pop > 0 && <span className="hi-pop">{h.pop}%</span>}
          </div>
        ))}
      </div>

      <div className="dash-bottom">
        <TempWaveGraph daily={daily} unit={unit} accent={accent} />
      </div>

    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}
