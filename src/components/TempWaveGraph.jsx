import { useMemo } from 'react'
import { formatTemp } from '../utils/formatters'

const W = 1000
const H = 110
const PAD_X = 60
const PAD_Y = 18
const PAD_BOTTOM = 22   

function smoothPath(points) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx = (prev.x + curr.x) / 2
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
}

export default function TempWaveGraph({ daily, unit, accent }) {
  const days = useMemo(() => {
    if (!daily?.time) return []
    return daily.time.map((date, i) => ({
      date,
      max: daily.temperature_2m_max[i],
      min: daily.temperature_2m_min[i],
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    }))
  }, [daily])

  if (days.length < 2) return null

  const allTemps = days.flatMap((d) => [d.max, d.min])
  const minTemp = Math.min(...allTemps) - 2
  const maxTemp = Math.max(...allTemps) + 2
  const range = maxTemp - minTemp || 1

  function toY(val) {
    return PAD_Y + ((maxTemp - val) / range) * (H - PAD_Y - PAD_BOTTOM)
  }
  function toX(i) {
    return PAD_X + (i / (days.length - 1)) * (W - PAD_X * 2)
  }

  const highPoints = days.map((d, i) => ({ x: toX(i), y: toY(d.max) }))
  const lowPoints  = days.map((d, i) => ({ x: toX(i), y: toY(d.min) }))

  const highPath = smoothPath(highPoints)
  const lowPath  = smoothPath(lowPoints)

  const areaHigh = highPath + ` L ${highPoints.at(-1).x} ${H} L ${highPoints[0].x} ${H} Z`
  const areaLow  = lowPath  + ` L ${lowPoints.at(-1).x}  ${H} L ${lowPoints[0].x}  ${H} Z`

  return (
    <div className="wave-graph">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="wave-svg">
        <defs>
          <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        <path d={areaHigh} fill="url(#gradHigh)" />
        <path d={areaLow}  fill="url(#gradLow)" />

        <path d={highPath} fill="none" stroke={accent || 'rgba(255,255,255,0.7)'} strokeWidth="2" opacity="0.85" />
        <path d={lowPath}  fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="6 4" />

        {days.map((d, i) => {
          const hx = highPoints[i].x
          const hy = highPoints[i].y
          const lx = lowPoints[i].x
          const ly = lowPoints[i].y
          return (
            <g key={d.date}>
              <text x={hx} y={H - 10} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="inherit">
                {d.label}
              </text>
              <circle cx={hx} cy={hy} r="3.5" fill="white" opacity="0.9" />
              <text x={hx} y={hy - 7} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.85)" fontFamily="inherit" fontWeight="600">
                {formatTemp(d.max, unit)}
              </text>
              <circle cx={lx} cy={ly} r="2.5" fill="white" opacity="0.5" />
              <text x={lx} y={ly - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="inherit">
                {formatTemp(d.min, unit)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
