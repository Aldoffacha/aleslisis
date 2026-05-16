'use client'

const socialItems = [
  {
    bg: '#F9E8E8',
    label: 'Rosa roja',
    img: '/creaciones/rosa-roja.png',
  },
  {
    bg: '#F5EEE8',
    label: 'Ramo especial',
    img: '/creaciones/ramo-especial.png',
  },
  {
    bg: '#EEF2EE',
    label: 'Arreglo de boda',
    img: '/creaciones/arreglo-de-boda.png',
  },
  {
    bg: '#F2EEF5',
    label: 'Caja de rosas',
    img: '/creaciones/caja-de-rosas.png',
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
            <img src={item.img} alt={item.label} className="w-full h-full object-contain p-2" />
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
