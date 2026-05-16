'use client'

import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'

const auth = createAuthUseCases(djangoAuthAdapter)

const inputClass = "w-full px-4 py-[13px] border-[0.5px] border-[rgba(180,80,80,0.25)] rounded-sm text-sm bg-white text-[#2C1A1A] outline-none transition-[border-color] duration-200 font-[DM_Sans,sans-serif] focus:border-[rgba(122,32,32,0.4)]"
const labelClass = "block text-[10px] tracking-[0.15em] uppercase text-[#6A4040] mb-2"

const STEPS = ['Personal', 'Contacto', 'Acceso']

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthLabel = ['', 'Débil', 'Regular', 'Buena', 'Fuerte']
const strengthColor = ['', '#E24B4A', '#EF9F27', '#639922', '#0F6E56']

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    ci: '',
    genero: '',
    fecha_de_nacimiento: '',
    telefono: '',
    correo: '',
    password: '',
    confirmar_password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  const minDate = '1920-01-01'
  const maxDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
    .toISOString().split('T')[0]

  useEffect(() => {
    window.dispatchEvent(new Event('alesli-rose-background-start'))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateStep1 = () => {
    if (!form.nombre.trim()) return 'El nombre es requerido'
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.nombre)) return 'El nombre solo puede contener letras'
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(form.nombre)) return 'El nombre debe comenzar con mayúscula'
    if (!form.apellido_paterno.trim()) return 'El apellido paterno es requerido'
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.apellido_paterno)) return 'El apellido paterno solo puede contener letras'
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(form.apellido_paterno)) return 'El apellido paterno debe comenzar con mayúscula'
    if (form.apellido_materno && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.apellido_materno)) return 'El apellido materno solo puede contener letras'
    if (form.apellido_materno && !/^[A-ZÁÉÍÓÚÑ]/.test(form.apellido_materno)) return 'El apellido materno debe comenzar con mayúscula'
    if (!form.ci.trim()) return 'El CI es requerido'
    if (!form.fecha_de_nacimiento) return 'La fecha de nacimiento es requerida'
    return null
  }

  const validateStep2 = () => {
    if (form.telefono && !/^\+?[0-9]{7,15}$/.test(form.telefono.replace(/\s/g, '')))
      return 'Teléfono inválido. Ej: +591 76543210'
    return null
  }

  const validateStep3 = () => {
    if (!form.correo) return 'El correo es requerido'
    if (!form.password) return 'La contraseña es requerida'
    if (getPasswordStrength(form.password) < 4)
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
    if (form.password !== form.confirmar_password) return 'Las contraseñas no coinciden'
    return null
  }

  const goNext = (nextStep: number, validator: () => string | null) => {
    const err = validator()
    if (err) { setError(err); return }
    setError(null)
    setStep(nextStep)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateStep3()
    if (err) { setError(err); return }
    setIsLoading(true)
    setError(null)
    try {
      const { confirmar_password: _, ...payload } = form
      await auth.register(payload)
      router.push('/login?registro=exitoso')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  const strength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen flex items-center justify-center font-[DM_Sans,sans-serif] py-16">
      <Link href="/" className="absolute top-8 left-8 text-[10px] tracking-[0.15em] uppercase text-[#5A3333] no-underline flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Alesli
      </Link>

      <div className="w-full max-w-[420px] px-6">
        <div className="text-center mb-8">
          <div className="font-[Cormorant_Garamond,serif] text-4xl font-light text-[#7A2020] tracking-[0.2em] mb-2">Alesli</div>
          <p className="text-[11px] text-[#9A6060] tracking-[0.05em] font-light">Crea tu cuenta para continuar</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((label, i) => {
            const n = i + 1
            const isActive = step === n
            const isDone = step > n
            return (
              <div key={n} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all duration-300"
                    style={{
                      background: isActive ? '#7A2020' : isDone ? '#C4A0A0' : 'transparent',
                      border: isActive || isDone ? 'none' : '0.5px solid rgba(180,80,80,0.3)',
                      color: isActive || isDone ? 'white' : '#C4A0A0',
                    }}
                  >
                    {isDone ? '✓' : n}
                  </div>
                  <span className="text-[9px] tracking-[0.1em] uppercase text-[#9A6060]">{label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-12 h-[0.5px] bg-[rgba(180,80,80,0.25)] mb-4 mx-1" />}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded mb-5">
            {error}
          </div>
        )}

        {/* Paso 1 */}
        {step === 1 && (
          <div>
            <p className="text-[11px] text-[#6A4040] tracking-[0.05em] text-center mb-5">Datos personales</p>
            <div className="mb-4">
              <label className={labelClass}>Nombre</label>
              <input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>Apellido paterno</label>
                <input name="apellido_paterno" type="text" value={form.apellido_paterno} onChange={handleChange} placeholder="Paterno" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Apellido materno</label>
                <input name="apellido_materno" type="text" value={form.apellido_materno} onChange={handleChange} placeholder="Materno" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>CI</label>
                <input name="ci" type="text" value={form.ci} onChange={handleChange} placeholder="12345678" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Género</label>
                <select name="genero" value={form.genero} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Fecha de nacimiento</label>
              <input name="fecha_de_nacimiento" type="date" value={form.fecha_de_nacimiento} onChange={handleChange} min={minDate} max={maxDate} className={inputClass} />
            </div>
            <button onClick={() => goNext(2, validateStep1)} className="w-full py-4 text-[10px] tracking-[0.2em] uppercase text-white border-none cursor-pointer font-[DM_Sans,sans-serif]" style={{ background: '#7A2020' }}>
              Continuar
            </button>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div>
            <p className="text-[11px] text-[#6A4040] tracking-[0.05em] text-center mb-5">Datos de contacto</p>
            <div className="mb-2">
              <label className={labelClass}>Teléfono</label>
              <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="+591 76543210" className={inputClass} />
              <p className="text-[10px] text-[#9A6060] mt-1">Incluye el código de país. Ej: +591 para Bolivia</p>
            </div>
            <div className="mb-6 mt-4" />
            <button onClick={() => goNext(3, validateStep2)} className="w-full py-4 text-[10px] tracking-[0.2em] uppercase text-white border-none cursor-pointer font-[DM_Sans,sans-serif] mb-3" style={{ background: '#7A2020' }}>
              Continuar
            </button>
            <button onClick={() => { setError(null); setStep(1) }} className="w-full py-4 text-[10px] tracking-[0.2em] uppercase text-[#7A2020] bg-transparent cursor-pointer font-[DM_Sans,sans-serif]" style={{ border: '0.5px solid rgba(122,32,32,0.3)' }}>
              Volver
            </button>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <p className="text-[11px] text-[#6A4040] tracking-[0.05em] text-center mb-5">Crea tu acceso</p>
            <div className="mb-4">
              <label className={labelClass}>Correo electrónico</label>
              <input name="correo" type="email" value={form.correo} onChange={handleChange} required placeholder="correo@ejemplo.com" className={inputClass} />
            </div>
            <div className="mb-2">
              <label className={labelClass}>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className={inputClass} />
            </div>
            {form.password.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength ? strengthColor[strength] : 'rgba(180,80,80,0.15)' }} />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-[10px] text-[#9A6060]">Mín. 8 caracteres, mayúscula, número y símbolo</p>
                  {strength > 0 && <p className="text-[10px] font-medium" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</p>}
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className={labelClass}>Confirmar contraseña</label>
              <input name="confirmar_password" type="password" value={form.confirmar_password} onChange={handleChange} required placeholder="••••••••" className={inputClass} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-4 text-[10px] tracking-[0.2em] uppercase text-white border-none cursor-pointer font-[DM_Sans,sans-serif] mb-3 disabled:cursor-wait" style={{ background: isLoading ? '#C4706A' : '#7A2020' }}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <button type="button" onClick={() => { setError(null); setStep(2) }} className="w-full py-4 text-[10px] tracking-[0.2em] uppercase text-[#7A2020] bg-transparent cursor-pointer font-[DM_Sans,sans-serif]" style={{ border: '0.5px solid rgba(122,32,32,0.3)' }}>
              Volver
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <span className="text-xs text-[#8A5555]">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#7A2020] no-underline">Inicia sesión</Link>
          </span>
        </div>
      </div>
    </div>
  )
}