import { useState, useEffect, useCallback } from 'react'
import WeatherDashboard from './components/WeatherDashboard'
import SearchBar from './components/SearchBar'
import Loading from './components/Loading'
import ErrorMessage from './components/ErrorMessage'
import WeatherBackground from './components/WeatherBackground'
import { fetchWeather, fetchCityPhoto, getWeatherCondition } from './services/weatherApi'
import { getLocalStorage, setLocalStorage } from './utils/helpers'

export default function App() {
  const [data, setData] = useState(null)
  const [cityPhoto, setCityPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('C')
  const [recentSearches, setRecentSearches] = useState(() =>
    getLocalStorage('recentSearches', [])
  )

  const search = useCallback(async (city) => {
    if (!city?.trim()) { setError('Please enter a city name.'); return }
    setLoading(true)
    setError(null)
    setCityPhoto(null)
    try {
      const result = await fetchWeather(city)
      setData(result)
      const name = result.location.name
      const newRecent = [name, ...recentSearches.filter(s => s.toLowerCase() !== name.toLowerCase())].slice(0, 5)
      setRecentSearches(newRecent)
      setLocalStorage('recentSearches', newRecent)
      setLocalStorage('lastCity', name)
      fetchCityPhoto(name).then(setCityPhoto)
    } catch (err) {
      if (err.message === 'EMPTY_INPUT')      setError('Please enter a city name.')
      else if (err.message === 'CITY_NOT_FOUND') setError(`City "${city}" not found.`)
      else if (err.code === 'ERR_NETWORK')    setError('Network error. Check your connection.')
      else                                    setError('Something went wrong. Please try again.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [recentSearches])

  useEffect(() => {
    const last = getLocalStorage('lastCity', null)
    if (last) search(last)
  }, [])

  const weatherCode = data?.weather?.current?.weather_code
  const condition   = weatherCode != null ? getWeatherCondition(weatherCode) : null
  const isDay       = data?.weather?.current?.is_day === 1
  const precipitation = data?.weather?.current?.precipitation ?? 0
  const snowfall      = data?.weather?.current?.snowfall ?? 0

  const localTime = (() => {
    if (!data) return null
    try {
      return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: data.weather.timezone })
    } catch { return null }
  })()

  const localDate = (() => {
    if (!data) return null
    try {
      return new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: data.weather.timezone })
    } catch { return null }
  })()

  return (
    <div className="app">
      <WeatherBackground
        condition={condition}
        isDay={isDay}
        photoUrl={cityPhoto}
        precipitation={precipitation}
        snowfall={snowfall}
      />

      {!data && (
        <div className="splash-screen">
          <div className="splash-inner">
            <h1 className="splash-title">WeatherApp</h1>
            <p className="splash-sub">Enter a city to see the weather</p>
            <SearchBar onSearch={search} recentSearches={recentSearches} loading={loading} />
            {loading && <Loading />}
            {error && !loading && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
          </div>
        </div>
      )}

      {data && (
        <WeatherDashboard
          data={data}
          unit={unit}
          isDay={isDay}
          localTime={localTime}
          localDate={localDate}
          condition={condition}
          precipitation={precipitation}
          snowfall={snowfall}
          onSearch={search}
          onUnitToggle={() => setUnit(u => u === 'C' ? 'F' : 'C')}
          loading={loading}
          recentSearches={recentSearches}
        />
      )}
    </div>
  )
}
