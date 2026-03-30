import { useEffect, useRef } from 'react'

const PARTICLES = {
  rain: 120,
  drizzle: 60,
  thunderstorm: 150,
  snow: 80,
  clear: 0,
  clouds: 0,
  fog: 0,
}

export default function WeatherBackground({ condition, isDay, photoUrl, precipitation, snowfall }) {
  const isRaining = (condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm') && precipitation > 0
  const isSnowing = condition === 'snow' && snowfall > 0
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = PARTICLES[condition] || 0
    particlesRef.current = []

    if (isRaining) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 6 + 8,
          opacity: Math.random() * 0.5 + 0.3,
          angle: 15,
        })
      }
    } else if (isSnowing) {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1.5 + 0.5,
          drift: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.6 + 0.4,
        })
      }
    }

    let lightningTimer = 0

    function drawRain(ctx, canvas, thunder) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (thunder) {
        lightningTimer--
        if (lightningTimer <= 0) {
          if (Math.random() < 0.01) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            lightningTimer = 10
          }
        }
      }

      ctx.save()
      particlesRef.current.forEach((drop) => {
        ctx.beginPath()
        const angleRad = (drop.angle * Math.PI) / 180
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(
          drop.x + Math.sin(angleRad) * drop.length,
          drop.y + Math.cos(angleRad) * drop.length
        )
        ctx.strokeStyle = `rgba(174, 214, 241, ${drop.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()

        drop.y += drop.speed
        drop.x += Math.sin((drop.angle * Math.PI) / 180) * drop.speed * 0.3

        if (drop.y > canvas.height || drop.x > canvas.width) {
          drop.x = Math.random() * canvas.width
          drop.y = -drop.length
        }
      })
      ctx.restore()
    }

    function drawSnow(ctx, canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      particlesRef.current.forEach((flake) => {
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        flake.y += flake.speed
        flake.x += flake.drift

        if (flake.y > canvas.height) {
          flake.y = -flake.radius
          flake.x = Math.random() * canvas.width
        }
        if (flake.x > canvas.width) flake.x = 0
        if (flake.x < 0) flake.x = canvas.width
      })
      ctx.restore()
    }

    function drawSunParticles(ctx, canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      particlesRef.current.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 220, 100, ${p.opacity})`
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      })
      ctx.restore()
    }

    function animate() {
      if (!canvas) return
      if (isRaining && condition !== 'thunderstorm') {
        drawRain(ctx, canvas, false)
      } else if (isRaining && condition === 'thunderstorm') {
        drawRain(ctx, canvas, true)
      } else if (isSnowing) {
        drawSnow(ctx, canvas)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [condition, isDay, isRaining, isSnowing])

  const bgClass = getBgClass(condition, isDay)

  return (
    <div className={`weather-bg ${bgClass}`}>
      {photoUrl && (
        <div
          className="city-photo"
          style={{ backgroundImage: `url(${photoUrl})` }}
        />
      )}
      <div className="bg-overlay" />
      <canvas ref={canvasRef} className="weather-canvas" />

      {condition === 'clear' && isDay && <SunEffect />}
      {condition === 'clear' && !isDay && <StarsEffect />}
      {condition === 'fog' && <FogEffect />}
      {condition === 'clouds' && <CloudEffect />}
    </div>
  )
}

function StarsEffect() {
  const stars = Array.from({ length: 80 }, (_, i) => {
    const seed1 = (i * 7919 + 12345) % 10000
    const seed2 = (i * 6271 + 54321) % 10000
    const seed3 = (i * 3571 + 99999) % 10000
    return {
      x: (seed1 / 10000) * 100,
      y: (seed2 / 10000) * 70,
      size: (seed3 % 3) + 1,
      delay: (seed1 % 40) / 10,
      duration: 2 + (seed2 % 30) / 10,
    }
  })
  return (
    <div className="stars-container">
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function SunEffect() {
  return (
    <div className="sun-container">
      <div className="sun">
        <div className="sun-core" />
        <div className="sun-rays">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="sun-ray"
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FogEffect() {
  return (
    <div className="fog-container">
      <div className="fog-layer fog-1" />
      <div className="fog-layer fog-2" />
      <div className="fog-layer fog-3" />
    </div>
  )
}

function CloudEffect() {
  return (
    <div className="cloud-container">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
    </div>
  )
}

function getBgClass(condition, isDay) {
  if (!condition) return 'bg-default'
  if (condition === 'clear') return isDay ? 'bg-clear-day' : 'bg-clear-night'
  if (condition === 'clouds') return 'bg-clouds'
  if (condition === 'rain' || condition === 'drizzle') return 'bg-rain'
  if (condition === 'thunderstorm') return 'bg-thunderstorm'
  if (condition === 'snow') return 'bg-snow'
  if (condition === 'fog') return 'bg-fog'
  return 'bg-default'
}
