'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavbarProps {
  cartCount?: number
  isLoggedIn?: boolean
}

export default function Navbar({ cartCount = 0, isLoggedIn = false }: NavbarProps) {
  const userHref = isLoggedIn ? '/perfil' : '/login'
  const cartHref = isLoggedIn ? '/carrito' : '/login'
  const [tiendaOpen, setTiendaOpen] = useState(false)

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">Alesli</Link>

      <ul className="nav-links">
        <li><Link href="/">Inicio</Link></li>
        <li
          className="relative"
          onMouseEnter={() => setTiendaOpen(true)}
          onMouseLeave={() => setTiendaOpen(false)}
        >
          <span className="cursor-pointer flex items-center gap-1">
            Tienda
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          {tiendaOpen && (
            <div className="absolute top-full left-0 pt-2 z-50">
              <div className="bg-white border-[0.5px] border-[rgba(180,80,80,0.2)] shadow-sm min-w-[180px]">
                <Link href="/tienda/flores" className="block px-5 py-3 text-xs tracking-[0.08em] text-[#5A3333] hover:bg-[#FAF0EE] transition-colors">Flores</Link>
                <Link href="/tienda/arreglos" className="block px-5 py-3 text-xs tracking-[0.08em] text-[#5A3333] hover:bg-[#FAF0EE] transition-colors">Arreglos</Link>
                <Link href="/tienda/regalos" className="block px-5 py-3 text-xs tracking-[0.08em] text-[#5A3333] hover:bg-[#FAF0EE] transition-colors">Regalos</Link>
                <div className="border-t border-[rgba(180,80,80,0.1)] mx-3" />
                <Link href="/tienda/hazlo-tu-mismo" className="block px-5 py-3 text-xs tracking-[0.08em] text-[#7A2020] hover:bg-[#FAF0EE] transition-colors font-medium">Hazlo tú mismo</Link>
              </div>
            </div>
          )}
        </li>
        <li><Link href="/sucursales">Sucursales</Link></li>
        <li><Link href="/contacto">Contacto</Link></li>
      </ul>

      <div className="nav-actions">
        <a href={userHref} className="nav-icon-btn" aria-label="Mi cuenta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </a>
        <a href={cartHref} className="nav-icon-btn cart-badge" aria-label="Carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </a>
      </div>
    </nav>
  )
}