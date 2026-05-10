'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    await new Promise(r => setTimeout(r, 800))
    setIsLoading(false)
    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Back to home */}
      <Link href="/" style={{
        position: 'absolute',
        top: 32,
        left: 32,
        fontSize: 12,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#5A3333',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Alesli
      </Link>

      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 36,
            fontWeight: 300,
            color: 'var(--rose-dark)',
            letterSpacing: '0.2em',
            marginBottom: 8,
          }}>
            Alesli
          </div>
          <p style={{ fontSize: 13, color: '#8A5555', letterSpacing: '0.05em', fontWeight: 300 }}>
            Inicia sesion para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6A4040',
              marginBottom: 8,
            }}>
              Correo electronico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '0.5px solid rgba(180,80,80,0.25)',
                borderRadius: 2,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                background: 'white',
                color: '#2C1A1A',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6A4040',
              marginBottom: 8,
            }}>
              Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '0.5px solid rgba(180,80,80,0.25)',
                borderRadius: 2,
                fontSize: 14,
                fontFamily: 'DM Sans, sans-serif',
                background: 'white',
                color: '#2C1A1A',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading ? '#C4706A' : 'var(--rose-dark)',
              color: 'white',
              border: 'none',
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif',
              cursor: isLoading ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              fontWeight: 400,
            }}
          >
            {isLoading ? 'Ingresando...' : 'Iniciar sesion'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ fontSize: 13, color: '#8A5555' }}>
            No tienes cuenta?{' '}
            <Link href="/registro" style={{ color: 'var(--rose-deep)', textDecoration: 'none' }}>
              Registrate
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
