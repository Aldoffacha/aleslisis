'use client'

// Mini rose for social grid items
const MiniRose = ({ color = '#D4847A', x = 50, y = 50, size = 40 }: { color?: string; x?: number; y?: number; size?: number }) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx="0" cy="0" rx={size * 0.45} ry={size * 0.36} fill={color} opacity="0.4" transform="rotate(0)"/>
    <ellipse cx="0" cy="0" rx={size * 0.45} ry={size * 0.36} fill={color} opacity="0.4" transform="rotate(60)"/>
    <ellipse cx="0" cy="0" rx={size * 0.45} ry={size * 0.36} fill={color} opacity="0.4" transform="rotate(120)"/>
    <ellipse cx="0" cy="0" rx={size * 0.32} ry={size * 0.26} fill={color} opacity="0.65" transform="rotate(30)"/>
    <ellipse cx="0" cy="0" rx={size * 0.32} ry={size * 0.26} fill={color} opacity="0.65" transform="rotate(90)"/>
    <circle cx="0" cy="0" r={size * 0.18} fill={color}/>
    <circle cx="0" cy="0" r={size * 0.1} fill="#7A3535" opacity="0.5"/>
  </g>
)

const socialItems = [
  {
    bg: '#F9E8E8',
    label: 'Rosa roja',
    roses: [
      { color: '#C4706A', x: 50, y: 50, size: 45 },
      { color: '#D4847A', x: 25, y: 70, size: 30 },
      { color: '#B05C5C', x: 75, y: 30, size: 28 },
    ]
  },
  {
    bg: '#F5EEE8',
    label: 'Ramo especial',
    roses: [
      { color: '#D4A070', x: 50, y: 45, size: 38 },
      { color: '#C49060', x: 30, y: 65, size: 28 },
      { color: '#E4B080', x: 70, y: 60, size: 25 },
      { color: '#D4A070', x: 50, y: 75, size: 20 },
    ]
  },
  {
    bg: '#EEF2EE',
    label: 'Arreglo de boda',
    roses: [
      { color: '#E8C0C0', x: 50, y: 48, size: 42 },
      { color: '#D4A0A0', x: 28, y: 65, size: 30 },
      { color: '#F0D0D0', x: 72, y: 35, size: 26 },
      { color: '#E0B0B0', x: 68, y: 68, size: 22 },
    ]
  },
  {
    bg: '#F2EEF5',
    label: 'Caja de rosas',
    roses: [
      { color: '#B070C4', x: 50, y: 50, size: 40 },
      { color: '#C080D4', x: 30, y: 35, size: 26 },
      { color: '#9A60B0', x: 70, y: 62, size: 28 },
    ]
  },
]

export default function SocialSection() {
  return (
    <section className="social-section">
      <p className="section-label">Siguenos</p>
      <h2 className="section-title">Nuestras creaciones</h2>

      <div className="social-grid">
        {socialItems.map((item, idx) => (
          <div key={idx} className="social-item" style={{ background: item.bg }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              {/* Leaf */}
              <path d={`M${item.roses[0].x} ${item.roses[0].y + 20} Q${item.roses[0].x - 20} ${item.roses[0].y + 30} ${item.roses[0].x - 25} ${item.roses[0].y + 45} Q${item.roses[0].x - 10} ${item.roses[0].y + 32} ${item.roses[0].x} ${item.roses[0].y + 18}`} fill="#4A6741" opacity="0.4"/>
              {item.roses.map((rose, ri) => (
                <MiniRose key={ri} {...rose} />
              ))}
            </svg>
            <div className="social-overlay">
              <span style={{
                color: 'white',
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 300,
              }}>
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="social-links">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          Instagram
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
          </svg>
          Facebook
        </a>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </section>
  )
}
