export default function WeatherVisual({ condition, isDay }) {
  if (condition === 'clear' && isDay) return <SunVisual />
  if (condition === 'clear' && !isDay) return <MoonVisual />
  if (condition === 'thunderstorm') return <ThunderVisual />
  if (condition === 'snow') return <SnowVisual />
  if (condition === 'rain' || condition === 'drizzle') return <RainCloudVisual />
  if (condition === 'fog') return <FogVisual />
  return <CloudVisual />
}

function SunVisual() {
  return (
    <div className="visual-sun">
      <div className="visual-sun-core" />
      <div className="visual-sun-glow" />
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="visual-sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
      ))}
    </div>
  )
}

function MoonVisual() {
  return (
    <div className="visual-moon">
      <div className="visual-moon-body" />
      {[{ top: '15%', left: '60%', s: 6 }, { top: '50%', left: '75%', s: 4 }, { top: '30%', left: '85%', s: 5 }].map((star, i) => (
        <div key={i} className="visual-star" style={{ top: star.top, left: star.left, width: star.s, height: star.s }} />
      ))}
    </div>
  )
}

function CloudVisual() {
  return (
    <div className="visual-cloud-wrap">
      <div className="visual-cloud">
        <div className="cloud-body" />
        <div className="cloud-bump cloud-bump-1" />
        <div className="cloud-bump cloud-bump-2" />
        <div className="cloud-bump cloud-bump-3" />
        <div className="cloud-shadow" />
      </div>
    </div>
  )
}

function RainCloudVisual() {
  return (
    <div className="visual-cloud-wrap">
      <div className="visual-cloud visual-cloud-dark">
        <div className="cloud-body" />
        <div className="cloud-bump cloud-bump-1" />
        <div className="cloud-bump cloud-bump-2" />
        <div className="cloud-bump cloud-bump-3" />
      </div>
      <div className="visual-rain-drops">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="visual-drop" style={{ left: `${8 + i * 9}%`, animationDelay: `${(i * 0.18).toFixed(2)}s` }} />
        ))}
      </div>
    </div>
  )
}

function ThunderVisual() {
  return (
    <div className="visual-cloud-wrap">
      <div className="visual-cloud visual-cloud-thunder">
        <div className="cloud-body" />
        <div className="cloud-bump cloud-bump-1" />
        <div className="cloud-bump cloud-bump-2" />
        <div className="cloud-bump cloud-bump-3" />
      </div>
      <div className="visual-lightning"></div>
      <div className="visual-rain-drops">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="visual-drop" style={{ left: `${5 + i * 12}%`, animationDelay: `${(i * 0.15).toFixed(2)}s` }} />
        ))}
      </div>
    </div>
  )
}

function SnowVisual() {
  return (
    <div className="visual-cloud-wrap">
      <div className="visual-cloud">
        <div className="cloud-body" />
        <div className="cloud-bump cloud-bump-1" />
        <div className="cloud-bump cloud-bump-2" />
        <div className="cloud-bump cloud-bump-3" />
      </div>
      <div className="visual-snowflakes">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="visual-snowflake" style={{ left: `${5 + i * 12}%`, animationDelay: `${(i * 0.22).toFixed(2)}s` }}></div>
        ))}
      </div>
    </div>
  )
}

function FogVisual() {
  return (
    <div className="visual-fog-wrap">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`visual-fog-line vfl-${i}`} />
      ))}
    </div>
  )
}
