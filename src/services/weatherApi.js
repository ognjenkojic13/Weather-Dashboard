import axios from 'axios'

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export function getWeatherCondition(code) {
  if (code === 0) return 'clear'
  if (code <= 2) return 'clouds'       
  if (code === 3) return 'clouds'      
  if (code <= 49) return 'fog'         
  if (code <= 59) return 'drizzle'     
  if (code <= 69) return 'rain'        
  if (code <= 79) return 'snow'        
  if (code <= 84) return 'rain'        
  if (code <= 86) return 'snow'        
  if (code <= 99) return 'thunderstorm'
  return 'clear'
}

export function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Heavy freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snowfall',
    73: 'Moderate snowfall',
    75: 'Heavy snowfall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  }
  return descriptions[code] || 'Unknown'
}

export async function searchCity(name) {
  if (!name || !name.trim()) throw new Error('EMPTY_INPUT')

  const response = await axios.get(GEO_URL, {
    params: { name: name.trim(), count: 1, language: 'en', format: 'json' },
  })

  const results = response.data?.results
  if (!results || results.length === 0) throw new Error('CITY_NOT_FOUND')

  return results[0] 
}

export async function fetchWeather(cityName) {
  const location = await searchCity(cityName)

  const response = await axios.get(FORECAST_URL, {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'visibility',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'weather_code',
        'wind_speed_10m',
        'apparent_temperature',
        'visibility',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'sunrise',
        'sunset',
      ].join(','),
      timezone: location.timezone || 'auto',
      forecast_days: 7,
      wind_speed_unit: 'kmh',
    },
  })

  return { location, weather: response.data }
}

export async function fetchCityPhoto(cityName) {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`,
      { headers: { Accept: 'application/json' } }
    )
    return response.data?.originalimage?.source || response.data?.thumbnail?.source || null
  } catch {
    return null
  }
}
