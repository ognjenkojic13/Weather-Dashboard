import ForecastCard from './ForecastCard'

export default function Forecast({ data, unit }) {
  const daily = data.weather.daily
  if (!daily) return null

  const dailyItems = Array.from({ length: daily.time?.length || 0 }, (_, i) => ({
    date: daily.time[i],
    weatherCode: daily.weather_code[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    precipSum: daily.precipitation_sum[i],
    precipProb: daily.precipitation_probability_max[i],
    windMax: daily.wind_speed_10m_max[i],
  }))

  return (
    <div className="forecast-section">
      <h3 className="forecast-title">7-Day Forecast</h3>
      <div className="forecast-cards">
        {dailyItems.map((item, i) => (
          <ForecastCard key={i} item={item} type="daily" unit={unit} />
        ))}
      </div>
    </div>
  )
}
