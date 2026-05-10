'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'

const auth = createAuthUseCases(djangoAuthAdapter)

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await auth.login(username, password)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center font-[DM_Sans,sans-serif]">
      <Link
        href="/"
        className="absolute top-8 left-8 text-xs tracking-[0.15em] uppercase text-[#5A3333] no-underline flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Alesli
      </Link>

      <div className="w-full max-w-[400px] px-6">
        <div className="text-center mb-12">
          <div className="font-[Cormorant_Garamond,serif] text-4xl font-light text-[var(--rose-dark)] tracking-[0.2em] mb-2">
            Alesli
          </div>
          <p className="text-sm text-[#8A5555] tracking-[0.05em] font-light">
            Inicia sesión para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs tracking-[0.15em] uppercase text-[#6A4040] mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="tu_usuario"
              className="w-full px-4 py-[14px] border-[0.5px] border-[rgba(180,80,80,0.25)] rounded-sm text-sm bg-white text-[#2C1A1A] outline-none transition-[border-color] duration-200 font-[DM_Sans,sans-serif]"
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs tracking-[0.15em] uppercase text-[#6A4040] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-[14px] border-[0.5px] border-[rgba(180,80,80,0.25)] rounded-sm text-sm bg-white text-[#2C1A1A] outline-none font-[DM_Sans,sans-serif]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-xs tracking-[0.2em] uppercase text-white border-none cursor-pointer font-[DM_Sans,sans-serif] font-normal transition-all duration-200 disabled:cursor-wait"
            style={{ background: isLoading ? '#C4706A' : 'var(--rose-dark)' }}
          >
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-[#8A5555]">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[var(--rose-deep)] no-underline">
              Regístrate
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
