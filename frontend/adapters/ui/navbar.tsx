'use client'

import Link from 'next/link'

interface NavbarProps {
  cartCount?: number
  isLoggedIn?: boolean
}

export default function Navbar({ cartCount = 0, isLoggedIn = false }: NavbarProps) {
  const userHref = isLoggedIn ? '/perfil' : '/login'
  const cartHref = isLoggedIn ? '/carrito' : '/login'

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">
        Alesli
      </Link>

      <ul className="nav-links">
        <li><Link href="/">Inicio</Link></li>
        <li><Link href="/tienda">Tienda</Link></li>
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
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </a>
      </div>
    </nav>
  )
}
