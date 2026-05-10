'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Decorative rose SVG for hero panels
const FloatingRoseBunch = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="200" height="280" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    {/* Stems */}
    <path d="M100 280 L95 180 Q90 150 100 130" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    <path d="M100 280 L108 175 Q115 148 108 128" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    <path d="M100 280 L85 185 Q78 158 88 135" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    <path d="M100 280 L115 188 Q122 162 112 138" stroke="#4A6741" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    {/* Leaves */}
    <path d="M95 200 Q78 188 72 170 Q88 178 95 195" fill="#4A6741" opacity="0.7"/>
    <path d="M108 195 Q125 183 131 165 Q115 173 108 190" fill="#4A6741" opacity="0.7"/>
    <path d="M88 220 Q72 210 68 193 Q83 200 89 217" fill="#5A7A51" opacity="0.6"/>
    
    {/* Rose 1 - center */}
    <g transform="translate(100, 105)">
      <ellipse cx="0" cy="0" rx="22" ry="18" fill="#C4706A" opacity="0.45" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="22" ry="18" fill="#C4706A" opacity="0.45" transform="rotate(60)"/>
      <ellipse cx="0" cy="0" rx="22" ry="18" fill="#C4706A" opacity="0.45" transform="rotate(120)"/>
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#B05C5C" opacity="0.7" transform="rotate(30)"/>
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#B05C5C" opacity="0.7" transform="rotate(90)"/>
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#B05C5C" opacity="0.7" transform="rotate(150)"/>
      <circle cx="0" cy="0" r="9" fill="#B05C5C"/>
      <circle cx="0" cy="0" r="5" fill="#8C4444" opacity="0.6"/>
    </g>
    
    {/* Rose 2 - left */}
    <g transform="translate(65, 120) rotate(-20)">
      <ellipse cx="0" cy="0" rx="18" ry="15" fill="#D4847A" opacity="0.45" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="18" ry="15" fill="#D4847A" opacity="0.45" transform="rotate(72)"/>
      <ellipse cx="0" cy="0" rx="18" ry="15" fill="#D4847A" opacity="0.45" transform="rotate(144)"/>
      <ellipse cx="0" cy="0" rx="13" ry="10" fill="#C4706A" opacity="0.7" transform="rotate(36)"/>
      <ellipse cx="0" cy="0" rx="13" ry="10" fill="#C4706A" opacity="0.7" transform="rotate(108)"/>
      <circle cx="0" cy="0" r="7" fill="#C4706A"/>
      <circle cx="0" cy="0" r="4" fill="#8C4444" opacity="0.55"/>
    </g>
    
    {/* Rose 3 - right */}
    <g transform="translate(138, 118) rotate(15)">
      <ellipse cx="0" cy="0" rx="19" ry="16" fill="#CC7878" opacity="0.45" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="19" ry="16" fill="#CC7878" opacity="0.45" transform="rotate(72)"/>
      <ellipse cx="0" cy="0" rx="19" ry="16" fill="#CC7878" opacity="0.45" transform="rotate(144)"/>
      <ellipse cx="0" cy="0" rx="14" ry="11" fill="#B86868" opacity="0.7" transform="rotate(36)"/>
      <ellipse cx="0" cy="0" rx="14" ry="11" fill="#B86868" opacity="0.7" transform="rotate(108)"/>
      <circle cx="0" cy="0" r="8" fill="#B86868"/>
      <circle cx="0" cy="0" r="4" fill="#8C4444" opacity="0.55"/>
    </g>
    
    {/* Rose 4 - back left */}
    <g transform="translate(78, 90) rotate(10)">
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#E0A0A0" opacity="0.4" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#E0A0A0" opacity="0.4" transform="rotate(90)"/>
      <ellipse cx="0" cy="0" rx="11" ry="9" fill="#D48888" opacity="0.6" transform="rotate(45)"/>
      <circle cx="0" cy="0" r="6" fill="#D48888" opacity="0.8"/>
    </g>
    
    {/* Rose 5 - back right */}
    <g transform="translate(122, 88) rotate(-10)">
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#CC8888" opacity="0.4" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#CC8888" opacity="0.4" transform="rotate(90)"/>
      <ellipse cx="0" cy="0" rx="12" ry="9" fill="#BC7070" opacity="0.6" transform="rotate(45)"/>
      <circle cx="0" cy="0" r="6" fill="#BC7070" opacity="0.85"/>
    </g>
    
    {/* Ribbon */}
    <path d="M78 235 Q100 225 122 235" stroke="#C9A96E" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M85 238 Q100 248 115 238" stroke="#C9A96E" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
  </svg>
)

const GiftBoxSVG = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="200" height="220" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    {/* Box body */}
    <rect x="30" y="100" width="140" height="110" rx="3" fill="#F0C4C4" stroke="#D4847A" strokeWidth="1"/>
    {/* Box lid */}
    <rect x="20" y="75" width="160" height="30" rx="3" fill="#D4847A" stroke="#B05C5C" strokeWidth="1"/>
    {/* Ribbon vertical */}
    <rect x="90" y="75" width="20" height="135" fill="#7A3535" opacity="0.3"/>
    {/* Ribbon horizontal */}
    <rect x="20" y="83" width="160" height="14" fill="#7A3535" opacity="0.3"/>
    {/* Bow */}
    <path d="M100 75 Q70 45 60 55 Q50 65 100 75" fill="#B05C5C"/>
    <path d="M100 75 Q130 45 140 55 Q150 65 100 75" fill="#B05C5C"/>
    <path d="M100 75 Q82 50 90 40 Q100 30 100 75" fill="#CC7878"/>
    <path d="M100 75 Q118 50 110 40 Q100 30 100 75" fill="#CC7878"/>
    <circle cx="100" cy="75" r="8" fill="#D4847A"/>
    {/* Small roses on lid */}
    <circle cx="55" cy="90" r="7" fill="#F0C4C4" opacity="0.9"/>
    <circle cx="145" cy="90" r="7" fill="#F0C4C4" opacity="0.9"/>
    {/* Small flower accents */}
    <circle cx="55" cy="90" r="4" fill="#D4847A"/>
    <circle cx="145" cy="90" r="4" fill="#D4847A"/>
  </svg>
)

const ArrangementSVG = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    {/* Vase */}
    <path d="M80 200 Q70 230 65 250 L155 250 Q150 230 140 200 Z" fill="#C4706A" opacity="0.6"/>
    <path d="M75 205 Q110 215 145 205" stroke="#B05C5C" strokeWidth="1" fill="none" opacity="0.5"/>
    <rect x="60" y="195" width="100" height="10" rx="2" fill="#D4847A"/>
    {/* Stems */}
    <path d="M110 195 L110 140" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
    <path d="M110 195 L95 135" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
    <path d="M110 195 L125 132" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
    <path d="M110 195 L80 145" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
    <path d="M110 195 L140 142" stroke="#4A6741" strokeWidth="2" strokeLinecap="round"/>
    <path d="M110 195 L68 155" stroke="#5A7A51" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M110 195 L152 153" stroke="#5A7A51" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Leaves */}
    <path d="M95 165 Q82 155 78 142 Q91 150 96 163" fill="#4A6741" opacity="0.7"/>
    <path d="M125 162 Q138 152 142 139 Q129 147 124 160" fill="#4A6741" opacity="0.7"/>
    {/* Main roses */}
    <g transform="translate(110, 118)">
      <ellipse cx="0" cy="0" rx="24" ry="20" fill="#C4706A" opacity="0.4" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="24" ry="20" fill="#C4706A" opacity="0.4" transform="rotate(60)"/>
      <ellipse cx="0" cy="0" rx="24" ry="20" fill="#C4706A" opacity="0.4" transform="rotate(120)"/>
      <ellipse cx="0" cy="0" rx="17" ry="14" fill="#B05C5C" opacity="0.65" transform="rotate(30)"/>
      <ellipse cx="0" cy="0" rx="17" ry="14" fill="#B05C5C" opacity="0.65" transform="rotate(90)"/>
      <circle cx="0" cy="0" r="10" fill="#B05C5C"/>
      <circle cx="0" cy="0" r="6" fill="#8C4444" opacity="0.6"/>
    </g>
    <g transform="translate(82, 128) rotate(-15)">
      <ellipse cx="0" cy="0" rx="19" ry="16" fill="#D4847A" opacity="0.4" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="19" ry="16" fill="#D4847A" opacity="0.4" transform="rotate(72)"/>
      <ellipse cx="0" cy="0" rx="14" ry="11" fill="#C4706A" opacity="0.65" transform="rotate(36)"/>
      <circle cx="0" cy="0" r="8" fill="#C4706A"/>
    </g>
    <g transform="translate(138, 126) rotate(12)">
      <ellipse cx="0" cy="0" rx="20" ry="17" fill="#CC7878" opacity="0.4" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="20" ry="17" fill="#CC7878" opacity="0.4" transform="rotate(72)"/>
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#B86868" opacity="0.65" transform="rotate(36)"/>
      <circle cx="0" cy="0" r="9" fill="#B86868"/>
    </g>
    <g transform="translate(68, 142) rotate(20)">
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#E0A0A0" opacity="0.5" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#E0A0A0" opacity="0.5" transform="rotate(90)"/>
      <circle cx="0" cy="0" r="7" fill="#D48888"/>
    </g>
    <g transform="translate(151, 140) rotate(-20)">
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#CC8888" opacity="0.5" transform="rotate(0)"/>
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="#CC8888" opacity="0.5" transform="rotate(90)"/>
      <circle cx="0" cy="0" r="7" fill="#BC7070"/>
    </g>
    {/* Filler flowers */}
    {[80,100,120,140,92,130].map((x, i) => (
      <g key={i} transform={`translate(${x}, ${155 + i * 5})`}>
        <circle cx="0" cy="0" r="5" fill="#F0E0E0" opacity="0.8"/>
        <circle cx="0" cy="0" r="2" fill="#D4A0A0"/>
      </g>
    ))}
  </svg>
)

const panels = [
  {
    id: 0,
    class: 'hero-panel-1',
    tag: 'Quienes somos',
    title: <>El arte de<br/><em>regalar flores</em></>,
    desc: 'Somos Alesli, un estudio floral dedicado a crear momentos memorables. Cada arreglo es una obra de arte hecha con amor y los mejores materiales.',
    cta: 'Conocenos',
    href: '/nosotros',
    illustration: <FloatingRoseBunch style={{ opacity: 0.9 }} />,
    bg: 'radial-gradient(ellipse at 70% 50%, #F9E0E0 0%, #F5D8D8 50%, #F0CCCC 100%)',
  },
  {
    id: 1,
    class: 'hero-panel-2',
    tag: 'Ramos Frescos',
    title: <>Ramos para<br/><em>toda ocasion</em></>,
    desc: 'Ramos diseñados con rosas frescas de temporada, orquídeas y flores silvestres seleccionadas cada mañana para garantizar su belleza.',
    cta: 'Ver ramos',
    href: '/tienda?categoria=ramos',
    illustration: <FloatingRoseBunch style={{ opacity: 0.9, transform: 'rotate(-10deg) scale(1.1)' }} />,
    bg: 'radial-gradient(ellipse at 30% 60%, #F8F0E8 0%, #F4E8D8 50%, #EEE0C8 100%)',
  },
  {
    id: 2,
    class: 'hero-panel-3',
    tag: 'Regalos especiales',
    title: <>Sorprende a<br/><em>quien amas</em></>,
    desc: 'Cajas de rosas, chocolates artesanales y arreglos personalizados para que cada regalo sea exactamente lo que soñaste.',
    cta: 'Ver regalos',
    href: '/tienda?categoria=regalos',
    illustration: <GiftBoxSVG style={{ opacity: 0.85 }} />,
    bg: 'radial-gradient(ellipse at 60% 40%, #F2F0F8 0%, #EAE5F4 50%, #E0D8EC 100%)',
  },
  {
    id: 3,
    class: 'hero-panel-4',
    tag: 'Arreglos Florales',
    title: <>Decoracion<br/><em>con flores</em></>,
    desc: 'Arreglos para eventos, bodas y decoracion de espacios. Transformamos ambientes con el lenguaje universal de las flores.',
    cta: 'Ver arreglos',
    href: '/tienda?categoria=arreglos',
    illustration: <ArrangementSVG style={{ opacity: 0.85 }} />,
    bg: 'radial-gradient(ellipse at 40% 60%, #F0F5F0 0%, #E4EEE4 50%, #D8E5D8 100%)',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const autoRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = (idx: number) => {
    setCurrent(idx)
    resetAuto()
  }

  const prev = () => goTo((current - 1 + panels.length) % panels.length)
  const next = () => goTo((current + 1) % panels.length)

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % panels.length)
    }, 5000)
  }

  useEffect(() => {
    resetAuto()
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div
        className="hero-carousel-track"
        style={{ transform: `translateX(-${current * 25}%)` }}
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`hero-panel`}
            style={{ background: panel.bg }}
          >
            {/* Decorative lines */}
            <div style={{
              position: 'absolute',
              top: 0, bottom: 0, left: '50%',
              width: '0.5px',
              background: 'rgba(180,80,80,0.08)',
            }} />
            
            {/* Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '0 80px', width: '100%', justifyContent: 'center' }}>
              <div className="panel-content" style={{ textAlign: 'left', flex: '0 0 auto', maxWidth: 440 }}>
                <p className="panel-tag">{panel.tag}</p>
                <h1 className="panel-title">{panel.title}</h1>
                <p className="panel-desc">{panel.desc}</p>
                <Link href={panel.href} className="btn-primary">
                  {panel.cta}
                </Link>
              </div>
              <div style={{ flex: '0 0 auto' }} className="float-rose">
                {panel.illustration}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button className="carousel-arrow left" onClick={prev} aria-label="Anterior">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A3535" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button className="carousel-arrow right" onClick={next} aria-label="Siguiente">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A3535" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {panels.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Panel ${idx + 1}`}
          />
        ))}
      </div>

      {/* Panel counter */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 40,
        fontSize: 11,
        letterSpacing: '0.15em',
        color: 'rgba(122,53,53,0.5)',
        fontWeight: 300,
      }}>
        {String(current + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
      </div>
    </div>
  )
}
