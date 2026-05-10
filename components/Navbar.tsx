'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  cartCount?: number
  isLoggedIn?: boolean
}

export default function Navbar({ cartCount = 0, isLoggedIn = false }: NavbarProps) {
  const router = useRouter()

  const handleCart = () => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      router.push('/carrito')
    }
  }

  const handleUser = () => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      router.push('/perfil')
    }
  }

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="nav-logo">
        Alesli
      </Link>

      {/* Nav Links */}
      <ul className="nav-links">
        <li><Link href="/">Inicio</Link></li>
        <li><Link href="/tienda">Tienda</Link></li>
        <li><Link href="/contacto">Contacto</Link></li>
      </ul>

      {/* Actions */}
      <div className="nav-actions">
        {/* User */}
        <button className="nav-icon-btn" onClick={handleUser} aria-label="Mi cuenta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>

        {/* Cart */}
        <button className="nav-icon-btn cart-badge" onClick={handleCart} aria-label="Carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  )
}
