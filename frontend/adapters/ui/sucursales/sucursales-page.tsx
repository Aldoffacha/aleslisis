'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/adapters/ui/navbar'
import styles from './sucursales-page.module.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const SUCURSALES = [
  {
    id: 1,
    nombre: 'Alesli — Sucursal Central',
    direccion: 'Calle Campos No. 248',
    zona: 'Entre Av. 6 de Agosto y Av. Arce',
    ciudad: 'La Paz, Bolivia',
    telefono: '+591 77793200',
    whatsapp: 'https://wa.me/59177793200',
    email: 'leslieferlo@icloud.com',
    horario: 'Lun — Sáb: 9:00 — 19:00',
    enlace: 'https://maps.app.goo.gl/n5NbLGvcwDNzHpj69',
    coords: { lat: -16.5123, lng: -68.1222 },
    foto: '/sucursales/sucursal.png',
  },
]

function HouseIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <g transform="translate(16,16)">
      <rect x="-14" y="-8" width="28" height="20" rx="3" fill="#D4847A" stroke="#7A2020" stroke-width="1.5"/>
      <polygon points="-16,-8 0,-18 16,-8" fill="#C4706A" stroke="#7A2020" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="-3" y="0" width="6" height="12" rx="1" fill="#7A2020"/>
      <rect x="-8" y="-3" width="5" height="5" rx="1" fill="#FAF6F0" stroke="#7A2020" stroke-width="0.5"/>
      <rect x="3" y="-3" width="5" height="5" rx="1" fill="#FAF6F0" stroke="#7A2020" stroke-width="0.5"/>
    </g>
  </svg>`
  return L.divIcon({
    html: svg,
    className: styles.houseIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 28],
    popupAnchor: [0, -28],
  })
}

export default function SucursalesPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [selectedStore, setSelectedStore] = useState(SUCURSALES[0])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [selectedStore.coords.lat, selectedStore.coords.lng],
      zoom: 17,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    const icon = HouseIcon()
    const marker = L.marker([selectedStore.coords.lat, selectedStore.coords.lng], { icon })
      .addTo(map)
    marker.on('click', () => setShowImage((v) => !v))

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current
    map.setView([selectedStore.coords.lat, selectedStore.coords.lng], 17, { animate: true })
  }, [selectedStore])

  const handleLocate = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([loc.lat, loc.lng], 14, { animate: true })
        }
        setLocating(false)
      },
      () => setLocating(false),
    )
  }

  const handleGoToStore = (store: typeof SUCURSALES[0]) => {
    setSelectedStore(store)
    setShowImage(true)
  }

  return (
    <div className="min-h-screen font-[DM_Sans,sans-serif]">
      <Navbar isLoggedIn={false} cartCount={0} />

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.title}>Nuestras sucursales</h2>
          <p className={styles.subtitle}>Encuentra la tienda más cercana</p>

          <button
            type="button"
            className={styles.locateBtn}
            onClick={handleLocate}
            disabled={locating}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
            {locating ? 'Localizando…' : 'Usar mi ubicación'}
          </button>

          <div className={styles.storeList}>
            {SUCURSALES.map((store) => (
              <button
                key={store.id}
                type="button"
                className={`${styles.storeCard} ${selectedStore.id === store.id ? styles.storeCardActive : ''}`}
                onClick={() => handleGoToStore(store)}
              >
                <div className={styles.storeCardDot} />
                <div className={styles.storeCardInfo}>
                  <strong className={styles.storeName}>{store.nombre}</strong>
                  <span className={styles.storeAddr}>{store.direccion}</span>
                  <span className={styles.storeAddr}>{store.zona}</span>
                  <span className={styles.storeCity}>{store.ciudad}</span>
                  <span className={styles.storePhone}>{store.telefono}</span>
                  <span className={styles.storeHours}>{store.horario}</span>
                  <div className={styles.storeLinks}>
                    <a href={store.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.storeLink} onClick={(e) => e.stopPropagation()}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                    <a href={`mailto:${store.email}`} className={styles.storeLink} onClick={(e) => e.stopPropagation()}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A2020" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                      {store.email}
                    </a>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.mapArea}>
          <div ref={mapRef} className={styles.map} />
        </main>
      </div>

      <div className={`${styles.imagePanel} ${showImage ? styles.imagePanelOpen : ''}`}>
        <button type="button" className={styles.imagePanelClose} onClick={() => setShowImage(false)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className={styles.imageFrame}>
          <img src={selectedStore.foto} alt={selectedStore.nombre} className={styles.image} />
        </div>
        <p className={styles.imageCaption}>{selectedStore.nombre}</p>
      </div>

      <footer className="bg-[#2C1A1A] text-[rgba(255,255,255,0.7)] px-12 py-12 flex justify-between items-center text-xs tracking-[0.08em] max-md:flex-col max-md:gap-4 max-md:text-center">
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.2em' }}>
          Alesli
        </span>
        <span className="text-[11px] tracking-[0.08em] opacity-50">
          &copy; 2026 Alesli Flores. Todos los derechos reservados.
        </span>
        <div className="flex gap-6 text-[11px]">
          <a href="/privacidad" className="text-[rgba(255,255,255,0.5)] no-underline">Privacidad</a>
          <a href="/terminos" className="text-[rgba(255,255,255,0.5)] no-underline">Términos</a>
        </div>
      </footer>
    </div>
  )
}
