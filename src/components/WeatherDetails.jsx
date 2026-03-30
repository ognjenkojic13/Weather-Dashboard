export default function WeatherDetails({
  humidity,
  windSpeed,
  windDir,
  windGusts,
  feelsLike,
  pressure,
  visibility,
  cloudCover,
  precipitation,
  sunrise,
  sunset,
}) {


  return (
    <div className="weather-details">
      {items.map((item) => (
        <div key={item.label} className="detail-card">
          <span className="detail-icon">{item.icon}</span>
          <span className="detail-label">{item.label}</span>
          <span className="detail-value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
