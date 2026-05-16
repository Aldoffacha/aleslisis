'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface IntroProps {
  onComplete: () => void
}

function roseSvg(size: number, base: string, dark: string, light: string, hasLeaf: boolean, rot: number): string {
  const cx = size / 2, cy = size / 2
  const totalH = size + (hasLeaf ? size * 0.35 : 0)
  let svg = `<svg width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<defs>`
  svg += `<radialGradient id="rg1_${size}" cx="35%" cy="30%"><stop offset="0%" stop-color="${light}"/><stop offset="100%" stop-color="${base}"/></radialGradient>`
  svg += `<radialGradient id="rg2_${size}" cx="45%" cy="45%"><stop offset="0%" stop-color="${base}"/><stop offset="100%" stop-color="${dark}"/></radialGradient>`
  svg += `</defs>`
  if (hasLeaf) {
    const stemY = cy + size * 0.4
    svg += `<path d="M${cx} ${stemY} Q${cx - 2} ${stemY + size * 0.2} ${cx} ${totalH - 6}" stroke="#426B3A" stroke-width="${size * 0.025}" fill="none" stroke-linecap="round"/>`
    svg += `<ellipse cx="${cx - 14}" cy="${stemY - 6}" rx="${size * 0.09}" ry="${size * 0.05}" fill="#4E7A44" transform="rotate(-30 ${cx - 14} ${stemY - 6})"/>`
    svg += `<ellipse cx="${cx + 14}" cy="${stemY + 2}" rx="${size * 0.09}" ry="${size * 0.05}" fill="#3D6636" transform="rotate(25 ${cx + 14} ${stemY + 2})"/>`
  }
  const layers = [
    { count: 8, rx: size * 0.31, ry: size * 0.22, off: 0,  color: `url(#rg1_${size})`, op: 0.7 },
    { count: 8, rx: size * 0.26, ry: size * 0.19, off: 22, color: `url(#rg2_${size})`, op: 0.8 },
    { count: 7, rx: size * 0.21, ry: size * 0.15, off: 45, color: dark,                op: 0.9 },
    { count: 6, rx: size * 0.16, ry: size * 0.11, off: 67, color: '#6A2020',           op: 0.96 },
    { count: 5, rx: size * 0.11, ry: size * 0.08, off: 80, color: '#4A1515',           op: 1.0 },
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
  for (let i = 0; i < 12; i++) {
    const r = size * 0.04 * (i / 12)
    const ang = i * 30
    const dx = cx + Math.cos((ang * Math.PI) / 180) * r
    const dy = cy + Math.sin((ang * Math.PI) / 180) * r
    svg += `<circle cx="${dx}" cy="${dy}" r="${size * 0.008}" fill="#4A1515"/>`
  }
  svg += `</svg>`
  return svg
}

function daisySvg(size: number): string {
  const cx = size / 2, cy = size / 2
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
  svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.13}" fill="#F0C860"/>`
  svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.09}" fill="#D4A020"/>`
  for (let i = 0; i < 80; i++) {
    const ang = Math.random() * Math.PI * 2
    const r = Math.random() * size * 0.11
    const dx = cx + Math.cos(ang) * r
    const dy = cy + Math.sin(ang) * r
    svg += `<circle cx="${dx}" cy="${dy}" r="${size * 0.007}" fill="#B87A0A" opacity="0.7"/>`
  }
  svg += `</svg>`
  return svg
}

function peonySvg(size: number): string {
  const cx = size / 2, cy = size / 2
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<defs>`
  svg += `<radialGradient id="pg_${size}" cx="40%" cy="35%"><stop offset="0%" stop-color="#FFE4F0"/><stop offset="60%" stop-color="#F8A0B8"/><stop offset="100%" stop-color="#D86888"/></radialGradient>`
  svg += `</defs>`
  const layers = [
    { count: 10, rx: size * 0.32, ry: size * 0.22, off: 0,  op: 0.65 },
    { count: 12, rx: size * 0.26, ry: size * 0.18, off: 22, op: 0.75 },
    { count: 14, rx: size * 0.20, ry: size * 0.14, off: 44, op: 0.85 },
    { count: 12, rx: size * 0.15, ry: size * 0.11, off: 66, op: 0.95 },
    { count: 8,  rx: size * 0.10, ry: size * 0.08, off: 88, op: 1.0  },
  ]
  layers.forEach((l, li) => {
    const step = 360 / l.count
    for (let i = 0; i < l.count; i++) {
      const angle = i * step + l.off + li * 15
      const rad = l.rx * 0.7
      const dx = cx + Math.cos((angle * Math.PI) / 180) * rad
      const dy = cy + Math.sin((angle * Math.PI) / 180) * rad
      svg += `<g transform="translate(${dx},${dy}) rotate(${angle})">`
      svg += `<ellipse cx="0" cy="0" rx="${l.rx}" ry="${l.ry}" fill="url(#pg_${size})" opacity="${l.op}"/>`
      svg += `</g>`
    }
  })
  for (let i = 0; i < 50; i++) {
    const ang = Math.random() * 360
    const r = size * 0.12 + Math.random() * size * 0.08
    const dx = cx + Math.cos((ang * Math.PI) / 180) * r
    const dy = cy + Math.sin((ang * Math.PI) / 180) * r
    svg += `<circle cx="${dx}" cy="${dy}" r="${size * 0.008}" fill="#FFD966"/>`
  }
  svg += `<circle cx="${cx}" cy="${cy}" r="${size * 0.055}" fill="#A03050"/>`
  svg += `</svg>`
  return svg
}

function tulipSvg(size: number, color: string, dark: string): string {
  const cx = size / 2, cy = size / 2
  const totalH = size * 1.4
  let svg = `<svg width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<path d="M${cx} ${cy + 12} Q${cx - 2} ${cy + 42} ${cx} ${totalH - 6}" stroke="#426B3A" stroke-width="${size * 0.024}" fill="none" stroke-linecap="round"/>`
  svg += `<ellipse cx="${cx - 18}" cy="${cy + 6}" rx="${size * 0.1}" ry="${size * 0.045}" fill="#4E7A44" transform="rotate(-35 ${cx - 18} ${cy + 6})"/>`
  svg += `<ellipse cx="${cx + 20}" cy="${cy + 10}" rx="${size * 0.1}" ry="${size * 0.045}" fill="#3D6636" transform="rotate(30 ${cx + 20} ${cy + 10})"/>`
  svg += `<ellipse cx="${cx - 12}" cy="${cy - 18}" rx="${size * 0.16}" ry="${size * 0.28}" fill="${color}" opacity="0.9" transform="rotate(-15 ${cx - 12} ${cy - 18})"/>`
  svg += `<ellipse cx="${cx + 12}" cy="${cy - 18}" rx="${size * 0.16}" ry="${size * 0.28}" fill="${dark}" opacity="0.85" transform="rotate(15 ${cx + 12} ${cy - 18})"/>`
  svg += `<ellipse cx="${cx}" cy="${cy - 22}" rx="${size * 0.14}" ry="${size * 0.32}" fill="${color}" opacity="0.95"/>`
  svg += `<ellipse cx="${cx}" cy="${cy - 26}" rx="${size * 0.09}" ry="${size * 0.18}" fill="${color}" opacity="0.6"/>`
  for (let i = 0; i < 5; i++) {
    const ang = -20 + i * 10
    const ax = cx + Math.sin((ang * Math.PI) / 180) * size * 0.18
    const ay = cy - size * 0.16 + Math.cos((ang * Math.PI) / 180) * size * 0.1
    svg += `<line x1="${cx + Math.sin((ang * Math.PI) / 180) * size * 0.06}" y1="${cy - size * 0.14}" x2="${ax}" y2="${ay}" stroke="#5A3E1A" stroke-width="1.2"/>`
    svg += `<circle cx="${ax}" cy="${ay}" r="${size * 0.011}" fill="#FFC040"/>`
  }
  svg += `</svg>`
  return svg
}

type FlowerKind = 'rose' | 'daisy' | 'peony' | 'tulip'
interface Variant { kind: FlowerKind; main: string; dark: string; light?: string }

const variants: Variant[] = [
  { kind: 'rose',  main: '#C4706A', dark: '#8C3A3A', light: '#F0A0A0' },
  { kind: 'rose',  main: '#B05878', dark: '#7A2848', light: '#F0A0C0' },
  { kind: 'rose',  main: '#C84040', dark: '#8C1010', light: '#F09090' },
  { kind: 'rose',  main: '#D4A070', dark: '#9C6030', light: '#F8D0A0' },
  { kind: 'rose',  main: '#A06090', dark: '#682060', light: '#E0A0D0' },
  { kind: 'rose',  main: '#C890B0', dark: '#8C5080', light: '#F0C8E0' },
  { kind: 'daisy', main: '#FFF5E8', dark: '#E8D8B8', light: '#FFFFFF' },
  { kind: 'peony', main: '#F8A0B8', dark: '#C84868', light: '#FFE0EC' },
  { kind: 'tulip', main: '#E05070', dark: '#A02040' },
  { kind: 'tulip', main: '#E07030', dark: '#A04010' },
]

function buildFlower(v: Variant, size: number, hasLeaf: boolean, rot: number): string {
  switch (v.kind) {
    case 'rose':  return roseSvg(size, v.main, v.dark, v.light!, hasLeaf, rot)
    case 'daisy': return daisySvg(size)
    case 'peony': return peonySvg(size)
    case 'tulip': return tulipSvg(size, v.main, v.dark)
    default:      return ''
  }
}

interface FlowerItem { x: number; y: number; size: number; delay: number; rot: number; html: string }

function generateFlowers(W: number, H: number): FlowerItem[] {
  const golden = 2.399963229
  const total  = 90
  const items: FlowerItem[] = []
  for (let i = 0; i < total; i++) {
    const angle      = i * golden
    const radius     = Math.sqrt(i / total) * Math.min(W, H) * 0.56
    const x          = W / 2 + Math.cos(angle) * radius * (W / Math.min(W, H))
    const y          = H / 2 + Math.sin(angle) * radius * (H / Math.min(W, H))
    const sizeFactor = 1 - (radius / (Math.min(W, H) * 0.58)) * 0.44
    const sz         = Math.round(38 + sizeFactor * 108)
    const rot        = Math.random() * 54 - 27
    const delay      = i === 0 ? 40 : 100 + Math.sqrt(i) * 145 + Math.random() * 55
    const v          = variants[Math.floor(Math.random() * variants.length)]
    const leaf       = i === 0 || (radius < Math.min(W, H) * 0.25 && v.kind === 'rose')
    items.push({ x, y, size: sz, rot, delay, html: buildFlower(v, sz, leaf, rot) })
  }
  return items
}

export default function IntroAnimation({ onComplete }: IntroProps) {
  const [phase,      setPhase]      = useState<'envelope' | 'flowers' | 'done'>('envelope')
  const [flapOpen,   setFlapOpen]   = useState(false)
  const [letterUp,   setLetterUp]   = useState(false)
  const [slideOut,   setSlideOut]   = useState(false)
  const [flowers,    setFlowers]    = useState<FlowerItem[]>([])
  const [bloomed,    setBloomed]    = useState<Set<number>>(new Set())
  const [showText,   setShowText]   = useState(false)
  const [started,    setStarted]    = useState(false)
  const [sealFallen, setSealFallen] = useState(false)
  const [wigglePhase, setWigglePhase] = useState<'idle' | 'wiggle' | 'rest'>('idle')

  const audioRef      = useRef<HTMLAudioElement>(null)
  const audioFlores   = useRef<HTMLAudioElement>(null)
  const audioAlesli   = useRef<HTMLAudioElement>(null)
  const timers        = useRef<ReturnType<typeof setTimeout>[]>([])
  const wiggleTimers  = useRef<ReturnType<typeof setTimeout>[]>([])
  const flowersRef    = useRef<FlowerItem[]>([])

  const add = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
    return t
  }

  const addWiggle = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    wiggleTimers.current.push(t)
    return t
  }

  useEffect(() => {
    const W = window.innerWidth
    const H = window.innerHeight
    const items = generateFlowers(W, H)
    setFlowers(items)
    flowersRef.current = items
  }, [])

  useEffect(() => {
    if (started) return

    const startLoop = () => {
      setWigglePhase('wiggle')
      addWiggle(() => {
        setWigglePhase('rest')
        addWiggle(() => startLoop(), 2200)
      }, 1400)
    }

    addWiggle(startLoop, 1200)

    return () => {
      wiggleTimers.current.forEach(clearTimeout)
      wiggleTimers.current = []
    }
  }, [started])

  const handleStart = useCallback(() => {
    if (started) return
    setStarted(true)
    setWigglePhase('idle')
    setSealFallen(true)

    const items = flowersRef.current
    const last  = Math.max(...items.map(i => i.delay))

    add(() => {
      setFlapOpen(true)
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 1.3
        audio.play().catch(() => {})
        add(() => { audio.pause() }, 2000)
      }
    }, 700)

    add(() => setLetterUp(true), 1300)

    add(() => {
      const audio = audioFlores.current
      if (audio) {
        audio.play().catch(() => {})
        add(() => { audio.pause() }, 5000)
      }

      items.forEach((item, idx) =>
        add(() => setBloomed(prev => {
          const n = new Set(prev)
          n.add(idx)
          return n
        }), item.delay)
      )
    }, 1800)

    add(() => setPhase('flowers'),   2800)

    add(() => {
      setShowText(true)
      const audio = audioAlesli.current
      if (audio) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
      window.dispatchEvent(new Event('alesli-rose-background-start'))
    }, 1800 + last + 200)

    add(() => setSlideOut(true),                  1800 + last + 3400)
    add(() => { setPhase('done'); onComplete() }, 1800 + last + 4800)
  }, [started, onComplete])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  if (phase === 'done') return null

  const envelopeAnimClass = started ? '' :
    wigglePhase === 'wiggle' ? 'intro-anim-wiggle' :
    wigglePhase === 'rest' ? 'intro-anim-float-fast' : 'intro-anim-float'

  return (
    <div
      className={`intro-overlay ${slideOut ? 'intro-slide-out' : ''}`}
      style={{
        background: 'radial-gradient(ellipse at 40% 50%, #FDF6EF 0%, #F6EDE4 55%, #EFE0D4 100%)',
      }}
    >
      <div className="intro-vignette" />

      <div className="intro-flowers" style={{ zIndex: phase === 'flowers' ? 10 : 5 }}>
        {flowers.map((f, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: f.x, top: f.y,
              marginLeft: -f.size / 2,
              marginTop:  -f.size * 0.55,
              transformOrigin: 'center center',
              transform: bloomed.has(idx)
                ? `scale(1) rotate(${f.rot}deg)`
                : `scale(0) rotate(${f.rot + (f.rot > 0 ? 18 : -18)}deg)`,
              opacity: bloomed.has(idx) ? 1 : 0,
              transition: 'transform 0.95s cubic-bezier(0.34,1.52,0.64,1), opacity 0.55s ease',
              willChange: 'transform, opacity',
              filter: 'drop-shadow(0 2px 8px rgba(120,60,60,0.18))',
            }}
            dangerouslySetInnerHTML={{ __html: f.html }}
          />
        ))}
      </div>

      {phase === 'envelope' && (
        <div className={`intro-envelope-wrap ${envelopeAnimClass}`}
          style={{
            filter: 'drop-shadow(0 12px 40px rgba(160,100,80,0.22)) drop-shadow(0 3px 10px rgba(180,120,100,0.18))',
          }}
        >
          {!started && <div className="intro-glow" style={{ animation: 'glowPulse 2s ease-in-out infinite' }} />}

          <svg width="400" height="320" viewBox="0 -28 288 230" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="envF" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F8E8E8"/>
                <stop offset="100%" stopColor="#F0D8D8"/>
              </linearGradient>
              <linearGradient id="flapC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E0C0C0"/>
                <stop offset="100%" stopColor="#D0B0B0"/>
              </linearGradient>
              <linearGradient id="sealG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#B84060"/>
                <stop offset="100%" stopColor="#7A1830"/>
              </linearGradient>
            </defs>
            <rect x="4" y="56" width="280" height="140" rx="5" fill="url(#envF)" stroke="#C8A0A0" strokeWidth="0.8"/>
            <path d="M4 192 L116 124"   stroke="#C8A0A0" strokeWidth="0.5" opacity="0.3"/>
            <path d="M284 192 L172 124" stroke="#C8A0A0" strokeWidth="0.5" opacity="0.3"/>
            <path d="M4 56 L144 132 L284 56" fill="none" stroke="#C8A0A0" strokeWidth="0.5" opacity="0.3"/>

            <g style={{
              transformOrigin: '144px 56px',
              transform: flapOpen ? 'rotateX(-178deg)' : 'rotateX(0deg)',
              transition: 'transform 0.92s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <path d="M4 56 L144 56 L284 56 L144 136 Z" fill="url(#flapC)" stroke="#C8A0A0" strokeWidth="0.8"/>
            </g>

            <g style={{
              transform: letterUp ? 'translateY(-28px)' : 'translateY(56px)',
              opacity: letterUp ? 1 : 0,
              transition: 'transform 0.92s cubic-bezier(0.34,1.45,0.64,1), opacity 0.80s ease',
            }}>
              <rect x="82" y="70" width="124" height="90" rx="3" fill="white" stroke="#E0C0C0" strokeWidth="0.6"/>
              <rect x="82" y="70" width="124" height="9"  rx="3" fill="#FAF0F0" opacity="0.9"/>
              <circle cx="144" cy="93" r="10" fill="#C84058" opacity="0.10"/>
              <circle cx="144" cy="93" r="6"  fill="#C84058" opacity="0.18"/>
              <circle cx="144" cy="93" r="3"  fill="#A82840" opacity="0.30"/>
              <line x1="106" y1="112" x2="182" y2="112" stroke="#E8C8C8" strokeWidth="0.5"/>
              <text x="144" y="110" textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="17" fontWeight="300" fill="#7A4040" letterSpacing="8">ALESLI</text>
              <text x="144" y="130" textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="8" fill="#B08080" letterSpacing="5">FLORES</text>
              <text x="144" y="148" textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="7" fill="#C4A0A0" letterSpacing="2" fontStyle="italic">para ti ♡</text>
            </g>

            <g style={{
              transformOrigin: '144px 134px',
              transform: sealFallen
                ? 'translateY(60px) rotate(25deg) scale(0.6)'
                : 'translateY(0px) rotate(0deg) scale(1)',
              opacity: sealFallen ? 0 : 1,
              transition: 'transform 0.7s cubic-bezier(0.4,0,0.8,1), opacity 0.55s ease 0.15s',
              animation: (!started && wigglePhase === 'rest') ? 'sealPulse 1.1s ease-in-out infinite' : undefined,
            }}>
              <circle cx="144" cy="134" r="17" fill="url(#sealG)"/>
              <circle cx="144" cy="134" r="12" fill="none" stroke="#F8D0D8" strokeWidth="0.7" opacity="0.6"/>
              <text x="144" y="138" textAnchor="middle" fontFamily="serif" fontSize="10" fill="#F8D0D8" opacity="0.9">✦</text>
            </g>
          </svg>
        </div>
      )}

      {phase === 'flowers' && (
        <div className={`intro-text ${showText ? 'intro-text-visible' : 'intro-text-hidden'}`}>
          <div className="intro-text-halo" />
          <div className="intro-text-line" />
          <div className="intro-text-title">ALESLI</div>
          <div className="intro-text-subtitle">con todo el amor del mundo</div>
          <div className="intro-text-line-bottom" />
        </div>
      )}

      {!started && (
        <button
          type="button"
          onPointerDown={handleStart}
          className="intro-click-area"
          aria-label="Abrir"
        />
      )}

      <audio ref={audioRef} preload="auto">
        <source src="/audio/sobre_abierto.mp3" type="audio/mpeg" />
        <source src="/audio/sobre_abierto.ogg" type="audio/ogg" />
      </audio>
      <audio ref={audioFlores} preload="auto">
        <source src="/audio/rosas.ogg" type="audio/ogg" />
      </audio>
      <audio ref={audioAlesli} preload="auto">
        <source src="/audio/alesli.ogg" type="audio/ogg" />
      </audio>
    </div>
  )
}