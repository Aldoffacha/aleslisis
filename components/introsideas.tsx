'use client'

import { useEffect, useRef, useState } from 'react'

interface IntroProps {
  onComplete: () => void
}

// ─── Real flower photos from Unsplash (no API key needed) ──────────────────
const FLOWER_PHOTOS = [
  // Rosas rojas / rosadas
  'https://images.unsplash.com/photo-1548460996-8a9d3a08855d?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1490750967868-88df5691cc5f?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=320&q=85&fit=crop',
  // Peonías
  'https://images.unsplash.com/photo-1530092376999-2431865aa8df?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=320&q=85&fit=crop',
  // Tulipanes
  'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=320&q=85&fit=crop',
  // Margaritas / silvestres
  'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=320&q=85&fit=crop',
  'https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=320&q=85&fit=crop',
  // Orquídeas
  'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=320&q=85&fit=crop',
  // Flor de cerezo
  'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=320&q=85&fit=crop',
  // Lavanda
  'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=320&q=85&fit=crop',
  // Girasoles
  'https://images.unsplash.com/photo-1470509037663-253d2d33b36d?w=320&q=85&fit=crop',
]

type FlowerItem = {
  x: number
  y: number
  sz: number
  rot: number
  src: string
  delay: number
  zIndex: number
}

function generateFlowers(W: number, H: number): FlowerItem[] {
  const golden = 2.399963229 // golden angle in radians
  const total = 90
  const items: FlowerItem[] = []

  for (let i = 0; i < total; i++) {
    const angle = i * golden
    const radius = Math.sqrt(i / total) * Math.min(W, H) * 0.56
    const x = W / 2 + Math.cos(angle) * radius * (W / Math.min(W, H))
    const y = H / 2 + Math.sin(angle) * radius * (H / Math.min(W, H))
    const sizeFactor = 1 - (radius / (Math.min(W, H) * 0.58)) * 0.44
    const sz = Math.round(38 + sizeFactor * 108)
    const rot = Math.random() * 54 - 27
    const src = FLOWER_PHOTOS[Math.floor(Math.random() * FLOWER_PHOTOS.length)]
    // Hero center flower blooms first, rest radiate outward
    const delay = i === 0 ? 40 : 100 + Math.sqrt(i) * 145 + Math.random() * 55
    const zIndex = Math.round(60 - (radius / (Math.min(W, H) * 0.6)) * 30)
    items.push({ x, y, sz, rot, src, delay, zIndex })
  }

  return items
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function IntroAnimation({ onComplete }: IntroProps) {
  const [phase, setPhase]       = useState<'envelope' | 'flowers' | 'done'>('envelope')
  const [flapOpen, setFlapOpen] = useState(false)
  const [letterUp, setLetterUp] = useState(false)
  const [slideOut, setSlideOut] = useState(false)
  const [flowers, setFlowers]   = useState<FlowerItem[]>([])
  const [bloomed, setBloomed]   = useState<Set<number>>(new Set())
  const [showText, setShowText] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([])
  const add = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  useEffect(() => {
    // Open flap
    add(() => setFlapOpen(true), 700)
    // Letter rises
    add(() => setLetterUp(true), 1300)
    // Transition to flowers
    add(() => {
      setPhase('flowers')
      const W = stageRef.current?.offsetWidth  ?? window.innerWidth
      const H = stageRef.current?.offsetHeight ?? window.innerHeight
      const items = generateFlowers(W, H)
      setFlowers(items)
      items.forEach((item, idx) =>
        add(() => setBloomed(prev => { const n = new Set(prev); n.add(idx); return n }), 2400 + item.delay)
      )
      const last = Math.max(...items.map(i => i.delay))
      add(() => setShowText(true), 2400 + last + 200)
      add(() => setSlideOut(true), 2400 + last + 3400)
      add(() => { setPhase('done'); onComplete() }, 2400 + last + 4800)
    }, 2400)

    return () => timers.current.forEach(clearTimeout)
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div
      ref={stageRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 65%, #2d1a0e 0%, #1a0f08 45%, #0d0805 100%)',
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 1.5s cubic-bezier(0.77,0,0.175,1), opacity 1.2s ease',
        transform: slideOut ? 'translateY(-105vh)' : 'translateY(0)',
        opacity: slideOut ? 0 : 1,
      }}
    >
      {/* Atmospheric overlays */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(ellipse at 70% 30%, rgba(180,80,40,0.10) 0%, transparent 60%),
                     radial-gradient(ellipse at 20% 80%, rgba(120,40,80,0.08) 0%, transparent 50%)`,
      }}/>

      {/* Grain texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200,
        opacity: 0.28,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
      }}/>

      {/* ── ENVELOPE ── */}
      {phase === 'envelope' && (
        <div style={{
          position: 'relative', zIndex: 50,
          filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.75)) drop-shadow(0 4px 18px rgba(160,60,30,0.35))',
          transition: 'transform 1.3s cubic-bezier(0.77,0,0.175,1), opacity 1s ease',
          transform: phase === 'envelope' ? 'scale(1)' : 'scale(0.5) translateY(-60px)',
          opacity: phase === 'envelope' ? 1 : 0,
        }}>
          <svg width="288" height="202" viewBox="0 0 288 202" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="envF" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F8EEE0"/>
                <stop offset="100%" stopColor="#EAD4C0"/>
              </linearGradient>
              <linearGradient id="flapC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D8B89C"/>
                <stop offset="100%" stopColor="#C4A484"/>
              </linearGradient>
              <linearGradient id="sealG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#921A1A"/>
                <stop offset="100%" stopColor="#5C0E0E"/>
              </linearGradient>
            </defs>
            {/* Body */}
            <rect x="4" y="56" width="280" height="140" rx="5" fill="url(#envF)" stroke="#C8A898" strokeWidth="0.8"/>
            {/* Interior lines */}
            <path d="M4 192 L116 124" stroke="#C09888" strokeWidth="0.5" opacity="0.28"/>
            <path d="M284 192 L172 124" stroke="#C09888" strokeWidth="0.5" opacity="0.28"/>
            <path d="M4 56 L144 132 L284 56" fill="none" stroke="#C8AA98" strokeWidth="0.5" opacity="0.30"/>
            {/* Wax seal */}
            <circle cx="144" cy="154" r="17" fill="url(#sealG)"/>
            <circle cx="144" cy="154" r="12" fill="none" stroke="#F8D0A0" strokeWidth="0.7" opacity="0.55"/>
            <text x="144" y="158" textAnchor="middle" fontFamily="serif" fontSize="10" fill="#F8D0A0" opacity="0.85">✦</text>
            {/* Flap */}
            <g style={{
              transformOrigin: '144px 56px',
              transform: flapOpen ? 'rotateX(-178deg)' : 'rotateX(0deg)',
              transition: 'transform 0.92s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <path d="M4 56 L144 56 L284 56 L144 136 Z" fill="url(#flapC)" stroke="#C4A898" strokeWidth="0.8"/>
              <path d="M4 56 L144 136 L284 56" fill="none" stroke="#B89878" strokeWidth="0.4" opacity="0.28"/>
            </g>
            {/* Letter */}
            <g style={{
              transform: letterUp ? 'translateY(-28px)' : 'translateY(56px)',
              opacity: letterUp ? 1 : 0,
              transition: 'transform 0.92s cubic-bezier(0.34,1.45,0.64,1), opacity 0.80s ease',
            }}>
              <rect x="82" y="70" width="124" height="90" rx="3" fill="white" stroke="#ECD8C8" strokeWidth="0.6"/>
              <rect x="82" y="70" width="124" height="9" rx="3" fill="#FAF0E6" opacity="0.9"/>
              {/* Rose motif center */}
              <circle cx="144" cy="93" r="10" fill="#C84058" opacity="0.12"/>
              <circle cx="144" cy="93" r="6"  fill="#C84058" opacity="0.22"/>
              <circle cx="144" cy="93" r="3"  fill="#A82840" opacity="0.35"/>
              <line x1="106" y1="112" x2="182" y2="112" stroke="#ECD8C8" strokeWidth="0.5"/>
              <text x="144" y="110" textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="17" fontWeight="300" fill="#6A2838" letterSpacing="8">ALESLI</text>
              <text x="144" y="130" textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="8" fill="#A07868" letterSpacing="5">FLORES</text>
              <text x="144" y="148" textAnchor="middle"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="7" fill="#C4A898" letterSpacing="2"
                fontStyle="italic">para ti ♡</text>
            </g>
          </svg>
        </div>
      )}

      {/* ── FLOWERS ── */}
      {phase === 'flowers' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          {flowers.map((f, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: f.x,
                top: f.y,
                width: f.sz,
                height: f.sz,
                marginLeft: -f.sz / 2,
                marginTop: -f.sz / 2,
                zIndex: f.zIndex,
                transformOrigin: 'center center',
                transform: bloomed.has(idx)
                  ? `scale(1) rotate(${f.rot}deg)`
                  : `scale(0) rotate(${f.rot + (f.rot > 0 ? 18 : -18)}deg)`,
                opacity: bloomed.has(idx) ? 1 : 0,
                transition: `transform 0.95s cubic-bezier(0.34,1.52,0.64,1), opacity 0.55s ease`,
                willChange: 'transform, opacity',
              }}
            >
              <img
                src={f.src}
                alt=""
                loading="eager"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  display: 'block',
                  boxShadow: f.sz > 90
                    ? 'inset 0 -10px 24px rgba(0,0,0,0.5), inset 0 4px 14px rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.5)'
                    : f.sz > 55
                    ? 'inset 0 -6px 14px rgba(0,0,0,0.4), 0 3px 12px rgba(0,0,0,0.4)'
                    : '0 2px 8px rgba(0,0,0,0.35)',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── CENTER TEXT ── */}
      {phase === 'flowers' && (
        <div style={{
          position: 'absolute',
          zIndex: 150,
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          opacity: showText ? 1 : 0,
          transform: showText ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 1.6s ease, transform 1.4s ease',
          pointerEvents: 'none',
          textShadow: '0 2px 24px rgba(0,0,0,0.9), 0 0 80px rgba(140,40,30,0.5)',
        }}>
          <div style={{
            width: 130, height: 1, margin: '0 auto 14px',
            background: 'linear-gradient(90deg, transparent, rgba(245,200,180,0.65), transparent)',
          }}/>
          <div style={{ fontSize: 46, fontWeight: 300, letterSpacing: 16, color: '#f8ede4', textTransform: 'uppercase' }}>
            ALESLI
          </div>
          <div style={{ fontSize: 13, letterSpacing: 7, color: 'rgba(245,200,175,0.72)', marginTop: 7, fontWeight: 300, fontStyle: 'italic' }}>
            con todo el amor del mundo
          </div>
          <div style={{
            width: 130, height: 1, margin: '14px auto 0',
            background: 'linear-gradient(90deg, transparent, rgba(245,200,180,0.65), transparent)',
          }}/>
        </div>
      )}
    </div>
  )
}
//intro ideas