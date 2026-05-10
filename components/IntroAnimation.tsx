'use client'

import { useEffect, useRef, useState } from 'react'

interface IntroProps {
  onComplete: () => void
}

// ============================================================================
// FLORES 100% SIN PUNTAS (solo elipses y círculos)
// ============================================================================

// ROSA – pétalos en capas de elipses achatadas, centro suave
function roseSvg(size: number, base: string, dark: string, light: string, hasLeaf: boolean, rot: number): string {
  const cx = size / 2, cy = size / 2
  const totalH = size + (hasLeaf ? size * 0.35 : 0)
  let svg = `<svg width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<defs>`
  svg += `<radialGradient id="rg1" cx="35%" cy="30%"><stop offset="0%" stop-color="${light}"/><stop offset="100%" stop-color="${base}"/></radialGradient>`
  svg += `<radialGradient id="rg2" cx="45%" cy="45%"><stop offset="0%" stop-color="${base}"/><stop offset="100%" stop-color="${dark}"/></radialGradient>`
  svg += `</defs>`
  
  // Tallo y hojas (sin puntas)
  if (hasLeaf) {
    const stemY = cy + size * 0.4
    svg += `<path d="M${cx} ${stemY} Q${cx-2} ${stemY+size*0.2} ${cx} ${totalH-6}" stroke="#426B3A" stroke-width="${size*0.025}" fill="none" stroke-linecap="round"/>`
    svg += `<ellipse cx="${cx-14}" cy="${stemY-6}" rx="${size*0.09}" ry="${size*0.05}" fill="#4E7A44" transform="rotate(-30 ${cx-14} ${stemY-6})"/>`
    svg += `<ellipse cx="${cx+14}" cy="${stemY+2}" rx="${size*0.09}" ry="${size*0.05}" fill="#3D6636" transform="rotate(25 ${cx+14} ${stemY+2})"/>`
  }
  
  // Capas de pétalos (elipses superpuestas)
  const layers = [
    { count: 8, rx: size*0.31, ry: size*0.22, off: 0,   color: `url(#rg1)`, op: 0.7 },
    { count: 8, rx: size*0.26, ry: size*0.19, off: 22,  color: `url(#rg2)`, op: 0.8 },
    { count: 7, rx: size*0.21, ry: size*0.15, off: 45,  color: dark,         op: 0.9 },
    { count: 6, rx: size*0.16, ry: size*0.11, off: 67,  color: '#6A2020',    op: 0.96 },
    { count: 5, rx: size*0.11, ry: size*0.08, off: 80,  color: '#4A1515',    op: 1.0 }
  ]
  
  layers.forEach((layer, li) => {
    const step = 360 / layer.count
    for (let i = 0; i < layer.count; i++) {
      const angle = i * step + layer.off + (li * 12) + rot
      const rad = layer.rx * 0.8
      const dx = cx + Math.cos(angle * Math.PI/180) * rad
      const dy = cy + Math.sin(angle * Math.PI/180) * rad
      svg += `<g transform="translate(${dx},${dy}) rotate(${angle})">`
      svg += `<ellipse cx="0" cy="0" rx="${layer.rx}" ry="${layer.ry}" fill="${layer.color}" opacity="${layer.op}"/>`
      svg += `</g>`
    }
  })
  
  // Centro redondo (sin espiral puntiaguda)
  svg += `<circle cx="${cx}" cy="${cy}" r="${size*0.055}" fill="#2A0808" opacity="0.85"/>`
  for (let i = 0; i < 12; i++) {
    const r = size * 0.04 * (i / 12)
    const ang = i * 30
    const dx = cx + Math.cos(ang * Math.PI/180) * r
    const dy = cy + Math.sin(ang * Math.PI/180) * r
    svg += `<circle cx="${dx}" cy="${dy}" r="${size*0.008}" fill="#4A1515"/>`
  }
  
  svg += `</svg>`
  return svg
}

// MARGARITA – pétalos en elipses alargadas (punta redondeada por naturaleza)
function daisySvg(size: number): string {
  const cx = size/2, cy = size/2
  const petalCount = 18
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * 360 + (i % 3) * 2
    const petalLen = size * 0.42
    const petalWid = size * 0.045
    svg += `<g transform="translate(${cx},${cy}) rotate(${angle})">`
    svg += `<ellipse cx="0" cy="${-petalLen * 0.6}" rx="${petalWid}" ry="${petalLen * 0.5}" fill="#FFFDF5" opacity="0.95"/>`
    svg += `<line x1="0" y1="${-petalLen * 0.2}" x2="0" y2="${-petalLen * 0.9}" stroke="#E8DCC8" stroke-width="0.7" opacity="0.5"/>`
    svg += `</g>`
  }
  
  // Centro con relieve
  svg += `<circle cx="${cx}" cy="${cy}" r="${size*0.13}" fill="#F0C860"/>`
  svg += `<circle cx="${cx}" cy="${cy}" r="${size*0.09}" fill="#D4A020"/>`
  for (let i = 0; i < 80; i++) {
    const ang = Math.random() * Math.PI * 2
    const r = Math.random() * size * 0.11
    const dx = cx + Math.cos(ang) * r
    const dy = cy + Math.sin(ang) * r
    svg += `<circle cx="${dx}" cy="${dy}" r="${size*0.007}" fill="#B87A0A" opacity="0.7"/>`
  }
  svg += `</svg>`
  return svg
}

// PEONÍA – abundantes elipses superpuestas, sin vértices
function peonySvg(size: number): string {
  const cx = size/2, cy = size/2
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<defs>`
  svg += `<radialGradient id="pg" cx="40%" cy="35%"><stop offset="0%" stop-color="#FFE4F0"/><stop offset="60%" stop-color="#F8A0B8"/><stop offset="100%" stop-color="#D86888"/></radialGradient>`
  svg += `</defs>`
  
  const layers = [
    { count: 10, rx: size*0.32, ry: size*0.22, off: 0,  op: 0.65 },
    { count: 12, rx: size*0.26, ry: size*0.18, off: 22, op: 0.75 },
    { count: 14, rx: size*0.20, ry: size*0.14, off: 44, op: 0.85 },
    { count: 12, rx: size*0.15, ry: size*0.11, off: 66, op: 0.95 },
    { count: 8,  rx: size*0.10, ry: size*0.08, off: 88, op: 1.0 }
  ]
  
  layers.forEach((l, li) => {
    const step = 360 / l.count
    for (let i = 0; i < l.count; i++) {
      const angle = i * step + l.off + li * 15
      const rad = l.rx * 0.7
      const dx = cx + Math.cos(angle * Math.PI/180) * rad
      const dy = cy + Math.sin(angle * Math.PI/180) * rad
      svg += `<g transform="translate(${dx},${dy}) rotate(${angle})">`
      svg += `<ellipse cx="0" cy="0" rx="${l.rx}" ry="${l.ry}" fill="url(#pg)" opacity="${l.op}"/>`
      svg += `</g>`
    }
  })
  
  // Estambres
  for (let i = 0; i < 50; i++) {
    const ang = Math.random() * 360
    const r = size * 0.12 + Math.random() * size * 0.08
    const dx = cx + Math.cos(ang * Math.PI/180) * r
    const dy = cy + Math.sin(ang * Math.PI/180) * r
    svg += `<circle cx="${dx}" cy="${dy}" r="${size*0.008}" fill="#FFD966"/>`
  }
  svg += `<circle cx="${cx}" cy="${cy}" r="${size*0.055}" fill="#A03050"/>`
  svg += `</svg>`
  return svg
}

// TULIPÁN – pétalos en forma de elipses alargadas y curvas suaves (sin puntas)
function tulipSvg(size: number, color: string, dark: string): string {
  const cx = size/2, cy = size/2
  const totalH = size * 1.4
  let svg = `<svg width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}" xmlns="http://www.w3.org/2000/svg">`
  
  // Tallo y hojas
  svg += `<path d="M${cx} ${cy+12} Q${cx-2} ${cy+42} ${cx} ${totalH-6}" stroke="#426B3A" stroke-width="${size*0.024}" fill="none" stroke-linecap="round"/>`
  svg += `<ellipse cx="${cx-18}" cy="${cy+6}" rx="${size*0.1}" ry="${size*0.045}" fill="#4E7A44" transform="rotate(-35 ${cx-18} ${cy+6})"/>`
  svg += `<ellipse cx="${cx+20}" cy="${cy+10}" rx="${size*0.1}" ry="${size*0.045}" fill="#3D6636" transform="rotate(30 ${cx+20} ${cy+10})"/>`
  
  // Pétalos con curvas de Bézier pero sin puntas pronunciadas (uso de elipses también)
  // Alternativa: elipses alargadas para simular la copa
  svg += `<ellipse cx="${cx-12}" cy="${cy-18}" rx="${size*0.16}" ry="${size*0.28}" fill="${color}" opacity="0.9" transform="rotate(-15 ${cx-12} ${cy-18})"/>`
  svg += `<ellipse cx="${cx+12}" cy="${cy-18}" rx="${size*0.16}" ry="${size*0.28}" fill="${dark}" opacity="0.85" transform="rotate(15 ${cx+12} ${cy-18})"/>`
  svg += `<ellipse cx="${cx}" cy="${cy-22}" rx="${size*0.14}" ry="${size*0.32}" fill="${color}" opacity="0.95"/>`
  
  // Detalle interior
  svg += `<ellipse cx="${cx}" cy="${cy-26}" rx="${size*0.09}" ry="${size*0.18}" fill="${color}" opacity="0.6"/>`
  
  // Anteras redondas
  for (let i = 0; i < 5; i++) {
    const ang = -20 + i * 10
    const ax = cx + Math.sin(ang * Math.PI/180) * size*0.18
    const ay = cy - size*0.16 + Math.cos(ang * Math.PI/180) * size*0.1
    svg += `<line x1="${cx + Math.sin(ang * Math.PI/180)*size*0.06}" y1="${cy - size*0.14}" x2="${ax}" y2="${ay}" stroke="#5A3E1A" stroke-width="1.2"/>`
    svg += `<circle cx="${ax}" cy="${ay}" r="${size*0.011}" fill="#FFC040"/>`
  }
  svg += `</svg>`
  return svg
}

// ============================================================================
// VARIANTES Y GENERACIÓN (colores originales)
// ============================================================================
type FlowerKind = 'rose' | 'daisy' | 'peony' | 'tulip'
interface Variant {
  kind: FlowerKind
  main: string
  dark: string
  light?: string
}

const variants: Variant[] = [
  { kind: 'rose', main: '#C4706A', dark: '#8C3A3A', light: '#F0A0A0' },
  { kind: 'rose', main: '#B05878', dark: '#7A2848', light: '#F0A0C0' },
  { kind: 'rose', main: '#C84040', dark: '#8C1010', light: '#F09090' },
  { kind: 'rose', main: '#D4A070', dark: '#9C6030', light: '#F8D0A0' },
  { kind: 'rose', main: '#A06090', dark: '#682060', light: '#E0A0D0' },
  { kind: 'rose', main: '#C890B0', dark: '#8C5080', light: '#F0C8E0' },
  { kind: 'daisy', main: '#FFF5E8', dark: '#E8D8B8', light: '#FFFFFF' },
  { kind: 'peony', main: '#F8A0B8', dark: '#C84868', light: '#FFE0EC' },
  { kind: 'tulip', main: '#E05070', dark: '#A02040' },
  { kind: 'tulip', main: '#E07030', dark: '#A04010' },
]

function buildFlower(v: Variant, size: number, hasLeaf: boolean, rot: number): string {
  switch (v.kind) {
    case 'rose': return roseSvg(size, v.main, v.dark, v.light!, hasLeaf, rot)
    case 'daisy': return daisySvg(size)
    case 'peony': return peonySvg(size)
    case 'tulip': return tulipSvg(size, v.main, v.dark)
    default: return ''
  }
}

interface FlowerItem {
  x: number; y: number; size: number; delay: number; rot: number; html: string
}

function generateFlowers(W: number, H: number): FlowerItem[] {
  const rings = [
    { count: 1, rx: 0, ry: 0, sz: [105, 120] },
    { count: 6, rx: 0.08, ry: 0.1, sz: [85, 102] },
    { count: 10, rx: 0.16, ry: 0.19, sz: [72, 90] },
    { count: 14, rx: 0.26, ry: 0.3, sz: [62, 80] },
    { count: 18, rx: 0.38, ry: 0.42, sz: [54, 70] },
    { count: 22, rx: 0.52, ry: 0.56, sz: [46, 62] },
    { count: 28, rx: 0.68, ry: 0.72, sz: [40, 54] },
    { count: 32, rx: 0.86, ry: 0.9, sz: [34, 48] }
  ]
  const items: FlowerItem[] = []
  let delay = 0
  rings.forEach((ring, ri) => {
    if (ring.rx === 0) {
      const v = variants.find(v => v.kind === 'rose')!
      items.push({ x: W/2, y: H/2, size: 118, delay: 0, rot: 0, html: buildFlower(v, 118, true, 0) })
      delay = 120
      return
    }
    for (let i = 0; i < ring.count; i++) {
      const angle = (i / ring.count) * Math.PI * 2 + ri * 0.32
      const jx = (Math.random() - 0.5) * W * 0.045
      const jy = (Math.random() - 0.5) * H * 0.045
      const x = W/2 + Math.cos(angle) * ring.rx * W + jx
      const y = H/2 + Math.sin(angle) * ring.ry * H + jy
      const sz = ring.sz[0] + Math.random() * (ring.sz[1] - ring.sz[0])
      const rot = Math.random() * 70 - 35
      const v = variants[Math.floor(Math.random() * variants.length)]
      const leaf = ri < 5 && v.kind === 'rose'
      items.push({ x, y, size: Math.round(sz), delay: delay + i * 20, rot, html: buildFlower(v, Math.round(sz), leaf, rot) })
    }
    delay += ring.count * 20 + 35
  })
  return items
}

// ============================================================================
// COMPONENTE PRINCIPAL (con sobre elegante)
// ============================================================================
export default function IntroAnimation({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState<'envelope' | 'roses' | 'done'>('envelope')
  const [flapOpen, setFlapOpen] = useState(false)
  const [letterUp, setLetterUp] = useState(false)
  const [slideOut, setSlideOut] = useState(false)
  const [flowers, setFlowers] = useState<FlowerItem[]>([])
  const [bloomed, setBloomed] = useState<Set<number>>(new Set())
  const stageRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  useEffect(() => {
    addTimer(() => setFlapOpen(true), 550)
    addTimer(() => setLetterUp(true), 1050)
    addTimer(() => {
      setPhase('roses')
      const W = stageRef.current?.offsetWidth ?? window.innerWidth
      const H = stageRef.current?.offsetHeight ?? window.innerHeight
      const generated = generateFlowers(W, H)
      setFlowers(generated)
      generated.forEach((item, idx) => {
        addTimer(() => setBloomed(prev => new Set(prev).add(idx)), item.delay)
      })
      const lastDelay = generated[generated.length-1]?.delay ?? 3500
      addTimer(() => setSlideOut(true), lastDelay + 550)
      addTimer(() => { setPhase('done'); onComplete() }, lastDelay + 1600)
    }, 1900)
    return () => timers.current.forEach(clearTimeout)
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div
      ref={stageRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#F9F5F0',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transition: 'transform 1s cubic-bezier(0.65,0,0.35,1), opacity 1s ease',
        transform: slideOut ? 'translateY(-100vh)' : 'translateY(0)',
        opacity: slideOut ? 0 : 1,
      }}
    >
      {phase === 'envelope' && (
        <div style={{ transform: 'translateY(-8px)' }}>
          <svg width="220" height="160" viewBox="0 0 220 160" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.08))' }}>
            <defs>
              <linearGradient id="envBase" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F8E8E8"/>
                <stop offset="100%" stopColor="#F0D8D8"/>
              </linearGradient>
              <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E0C0C0"/>
                <stop offset="100%" stopColor="#D0B0B0"/>
              </linearGradient>
            </defs>
            <rect x="0" y="40" width="220" height="520" rx="4" fill="url(#envBase)" stroke="#C8A0A0" strokeWidth="0.8"/>
            <path d="M0 160 L78 102" stroke="#C8A0A0" strokeWidth="0.5" opacity="0.4"/>
            <path d="M220 160 L142 102" stroke="#C8A0A0" strokeWidth="0.5" opacity="0.4"/>
            <path d="M0 40 L110 106 L220 40" fill="none" stroke="#C8A0A0" strokeWidth="0.8" opacity="0.5"/>
            <g style={{ transformOrigin: '110px 40px', transform: flapOpen ? 'rotateX(-170deg)' : 'rotateX(0deg)', transition: 'transform 0.7s ease' }}>
              <path d="M0 40 L110 40 L220 40 L110 108 Z" fill="url(#flapGrad)" stroke="#C8A0A0" strokeWidth="0.8"/>
            </g>
            <g style={{ transform: letterUp ? 'translateY(-16px)' : 'translateY(48px)', opacity: letterUp ? 1 : 0, transition: 'transform 0.7s cubic-bezier(0.34,1.3,0.64,1), opacity 0.6s' }}>
              <rect x="55" y="68" width="110" height="72" rx="2" fill="white" stroke="#E0C0C0" strokeWidth="0.6"/>
              <text x="110" y="102" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="20" fontWeight="400" fill="#7A4040" letterSpacing="6">ALESLI</text>
              <text x="110" y="125" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="9" fill="#B08080" letterSpacing="4">FLORES</text>
              <line x1="75" y1="108" x2="145" y2="108" stroke="#E8C8C8" strokeWidth="0.5"/>
            </g>
          </svg>
        </div>
      )}

      {phase === 'roses' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {flowers.map((f, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: f.x, top: f.y,
                marginLeft: -f.size / 2,
                marginTop: -f.size * 0.55,
                transform: bloomed.has(idx) ? `scale(1) rotate(${f.rot}deg)` : `scale(0) rotate(${f.rot}deg)`,
                opacity: bloomed.has(idx) ? 1 : 0,
                transition: 'transform 0.45s cubic-bezier(0.2,1.1,0.4,1), opacity 0.3s',
                willChange: 'transform',
              }}
              dangerouslySetInnerHTML={{ __html: f.html }}
            />
          ))}
        </div>
      )}
    </div>
  )
}