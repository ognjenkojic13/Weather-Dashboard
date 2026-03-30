import ForecastCard from './ForecastCard'

export default function HourlyStrip({ data, unit }) {
  const hourly = data.weather.hourly
  if (!hourly) return null

  const items = Array.from({ length: Math.min(24, hourly.time?.length || 0) }, (_, i) => ({
    time: hourly.time[i],
    temp: hourly.temperature_2m[i],
    weatherCode: hourly.weather_code[i],
    precipProb: hourly.precipitation_probability[i],
  }))

  return (
    <div className="hourly-strip">
      <div className="hourly-strip-cards">
        {items.map((item, i) => (
          <ForecastCard key={i} item={item} type="hourly" unit={unit} />
        ))}
      </div>
    </div>
  )
}
