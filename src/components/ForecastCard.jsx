import { formatTemp } from '../utils/formatters'
import { getWeatherIcon } from '../utils/helpers'

export default function ForecastCard({ item, type, unit }) {
  if (type === 'hourly') {
    const icon = getWeatherIcon(item.weatherCode, true)
    const temp = formatTemp(item.temp, unit)
    const time = item.time ? item.time.split('T')[1]?.slice(0, 5) : ''

    return (
      <div className="forecast-card">
        <span className="fc-time">{time}</span>
        <span className="fc-icon">{icon}</span>
        <span className="fc-temp">{temp}</span>
        {item.precipProb > 0 && (
          <span className="fc-pop"> {item.precipProb}%</span>
        )}
      </div>
    )
  }

  if (type === 'daily') {
    const icon = getWeatherIcon(item.weatherCode, true)
    const tempMax = formatTemp(item.tempMax, unit)
    const tempMin = formatTemp(item.tempMin, unit)

    const dateObj = item.date ? new Date(item.date) : null
    const dayLabel = dateObj
      ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : ''

    return (
      <div className="forecast-card forecast-card-daily">
        <span className="fc-time">{dayLabel}</span>
        <span className="fc-icon">{icon}</span>
        <div className="fc-temp-range">
          <span className="fc-temp-max">{tempMax}</span>
          <span className="fc-temp-divider">/</span>
          <span className="fc-temp-min">{tempMin}</span>
        </div>
        {item.precipProb > 0 && (
          <span className="fc-pop"> {item.precipProb}%</span>
        )}
        {item.windMax != null && (
          <span className="fc-wind"> {item.windMax.toFixed(0)} km/h</span>
        )}
      </div>
    )
  }

  return null
}
