'use client'

import { useEffect, useRef, useState } from 'react'

function roseSvg(size: number, base: string, dark: string, light: string, rot: number): string {
  const cx = size / 2, cy = size / 2
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<defs>`
  svg += `<radialGradient id="rg1_${size}_${Math.round(rot)}" cx="35%" cy="30%"><stop offset="0%" stop-color="${light}"/><stop offset="100%" stop-color="${base}"/></radialGradient>`
  svg += `<radialGradient id="rg2_${size}_${Math.round(rot)}" cx="45%" cy="45%"><stop offset="0%" stop-color="${base}"/><stop offset="100%" stop-color="${dark}"/></radialGradient>`
  svg += `</defs>`
  const layers = [
    { count: 8, rx: size*0.31, ry: size*0.22, off: 0,  color: `url(#rg1_${size}_${Math.round(rot)})`, op: 0.7 },
    { count: 8, rx: size*0.26, ry: size*0.19, off: 22, color: `url(#rg2_${size}_${Math.round(rot)})`, op: 0.8 },
    { count: 7, rx: size*0.21, ry: size*0.15, off: 45, color: dark,    op: 0.9 },
    { count: 6, rx: size*0.16, ry: size*0.11, off: 67, color: '#6A2020', op: 0.96 },
    { count: 5, rx: size*0.11, ry: size*0.08, off: 80, color: '#4A1515', op: 1.0 },
  ]
  layers.forEach((layer, li) => {
    const step = 360 / layer.count
    for (let i = 0; i < layer.count; i++) {
      const angle = i * step + layer.off + li * 12 + rot
      const rad = layer.rx * 0.8
      const dx = cx + Math.cos((angle * Math.PI) / 180) * rad
      const dy = cy + Math.sin((angle * Math.PI) / 180) * rad
      svg += `<g transform="translate(${dx},${dy}) rotate(${angle})">`
      svg += `<ellipse cx="0" cy="0" rx="${layer.rx}" ry="${layer.ry}" fill="${layer.color}" opacity="${layer.op}"/>`
      svg += `</g>`
    }
  })
  svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.055}" fill="#2A0808" opacity="0.85"/>`
  svg += `</svg>`
  return svg
}

const VARIANTS = [
  { main: '#C4706A', dark: '#8C3A3A', light: '#F0A0A0' },
  { main: '#B05878', dark: '#7A2848', light: '#F0A0C0' },
  { main: '#C84040', dark: '#8C1010', light: '#F09090' },
  { main: '#D4A070', dark: '#9C6030', light: '#F8D0A0' },
  { main: '#A06090', dark: '#682060', light: '#E0A0D0' },
  { main: '#C890B0', dark: '#8C5080', light: '#F0C8E0' },
]

interface Petal {
  id: number
  x: number
  startY: number
  size: number
  rot: number
  rotSpeed: number
  speed: number   // px per second
  opacity: number
  html: string
}

function makePetal(id: number, W: number): Petal {
  const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
  const size = 28 + Math.random() * 48
  const rot = Math.random() * 360
  return {
    id,
    x: Math.random() * (W + 100) - 50,
    startY: -size - Math.random() * 600,
    size,
    rot,
    rotSpeed: (Math.random() - 0.5) * 18,  // deg/s
    speed: 40 + Math.random() * 50,         // px/s — lento
    opacity: 0.18 + Math.random() * 0.28,
    html: roseSvg(size, v.main, v.dark, v.light, rot),
  }
}

export default function RoseBackground() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const petalsRef = useRef<Petal[]>([])
  const stateRef  = useRef<{ y: number; rot: number }[]>([])
  const rafRef    = useRef<number>(0)
  const lastRef   = useRef<number>(0)
  const [started, setStarted] = useState(false)
  const [, forceRender] = useState(0)

  useEffect(() => {
    const handleStart = () => setStarted(true)
    window.addEventListener('alesli-rose-background-start', handleStart)
    return () => window.removeEventListener('alesli-rose-background-start', handleStart)
  }, [])

  useEffect(() => {
    if (!started) return

    const W = window.innerWidth
    const count = Math.round(W / 120) + 6   // densidad moderada

    const petals: Petal[] = []
    for (let i = 0; i < count; i++) {
      const p = makePetal(i, W)
      // distribuir verticalmente al inicio para que no arranquen todos de arriba
      const H = window.innerHeight
      petals.push({ ...p, startY: -p.size + Math.random() * (H + p.size) })
    }
    petalsRef.current = petals
    stateRef.current  = petals.map(p => ({ y: p.startY, rot: p.rot }))
    forceRender(n => n + 1)

    const W2 = W
    let nextId = count

    function loop(ts: number) {
      const dt = lastRef.current ? Math.min((ts - lastRef.current) / 1000, 0.1) : 0
      lastRef.current = ts

      const H = window.innerHeight
      const states = stateRef.current
      const ps     = petalsRef.current

      for (let i = 0; i < ps.length; i++) {
        states[i].y   += ps[i].speed * dt
        states[i].rot += ps[i].rotSpeed * dt

        if (states[i].y > H + ps[i].size + 40) {
          // reciclar: volver arriba con nueva x
          const fresh = makePetal(nextId++, W2)
          ps[i]       = { ...fresh, startY: -fresh.size - 20 }
          states[i]   = { y: -fresh.size - 20, rot: fresh.rot }
        }
      }

      forceRender(n => n + 1)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [started])

  const petals = petalsRef.current
  const states = stateRef.current

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 40% 50%, #FDF6EF 0%, #F6EDE4 55%, #EFE0D4 100%)',
        opacity: started ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    >
      {petals.map((p, i) => {
        const st = states[i]
        if (!st) return null
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: st.y,
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop:  -p.size / 2,
              opacity: p.opacity,
              transform: `rotate(${st.rot}deg)`,
              willChange: 'transform, top',
              filter: 'drop-shadow(0 2px 6px rgba(120,60,60,0.15))',
            }}
            dangerouslySetInnerHTML={{ __html: p.html }}
          />
        )
      })}
    </div>
  )
}