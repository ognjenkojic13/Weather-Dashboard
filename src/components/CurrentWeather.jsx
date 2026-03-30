import WeatherDetails from './WeatherDetails'
import { formatTemp, capitalize } from '../utils/formatters'
import { getWeatherIcon, getWindDirection } from '../utils/helpers'
import { getWeatherDescription } from '../services/weatherApi'

export default function CurrentWeather({ data, unit, isDay }) {
  const { location, weather } = data
  const current = weather.current
  const daily = weather.daily

  const temp = formatTemp(current.temperature_2m, unit)
  const feelsLike = formatTemp(current.apparent_temperature, unit)
  const tempMin = daily?.temperature_2m_min?.[0] != null
    ? formatTemp(daily.temperature_2m_min[0], unit) : null
  const tempMax = daily?.temperature_2m_max?.[0] != null
    ? formatTemp(daily.temperature_2m_max[0], unit) : null

  const weatherCode = current.weather_code
  const icon = getWeatherIcon(weatherCode, isDay)
  const description = getWeatherDescription(weatherCode)

  const windDir = getWindDirection(current.wind_direction_10m || 0)

  const sunrise = daily?.sunrise?.[0]
    ? daily.sunrise[0].split('T')[1]?.slice(0, 5) : null
  const sunset = daily?.sunset?.[0]
    ? daily.sunset[0].split('T')[1]?.slice(0, 5) : null

  const countryFlag = location.country_code
    ? String.fromCodePoint(
        ...location.country_code.toUpperCase().split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
      )
    : ''

  const locationLine = [location.admin1, location.country].filter(Boolean).join(', ')

  return (
    <div className="current-weather">
      <div className="current-weather-top">
        <div className="city-info">
          <h2 className="city-name">
            {countryFlag && <span className="country-flag">{countryFlag}</span>}
            {location.name}
          </h2>
          {locationLine && <p className="city-region">{locationLine}</p>}
          <p className="coordinates">
             {location.latitude?.toFixed(2)}°, {location.longitude?.toFixed(2)}°
          </p>
          {location.population && (
            <p className="coordinates">
               {location.population.toLocaleString()} inhabitants
            </p>
          )}
        </div>

        <div className="temp-display">
          <span className="weather-icon-large">{icon}</span>
          <span className="temperature">{temp}</span>
        </div>
      </div>

      <div className="weather-description-row">
        <span className="description">{description}</span>
        {tempMin && tempMax && (
          <span className="temp-range">{tempMax} / {tempMin}</span>
        )}
      </div>

      <WeatherDetails
        humidity={current.relative_humidity_2m}
        windSpeed={current.wind_speed_10m}
        windDir={windDir}
        windGusts={current.wind_gusts_10m}
        feelsLike={feelsLike}
        pressure={current.pressure_msl}
        visibility={current.visibility}
        cloudCover={current.cloud_cover}
        precipitation={current.precipitation}
        sunrise={sunrise}
        sunset={sunset}
      />
    </div>
  )
}
