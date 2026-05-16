'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/adapters/ui/navbar'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'

const auth = createAuthUseCases(djangoAuthAdapter)

export default function PedidosPage() {
	const router = useRouter()

	const handleLogout = async () => {
		await auth.logout()
		router.push('/login')
	}

	return (
		<div className="min-h-screen font-[DM_Sans,sans-serif]">
			<Navbar isLoggedIn={true} cartCount={0} onLogout={handleLogout} />

			<main className="px-6 pb-16 pt-28 md:px-12 lg:px-20">
				<section className="mx-auto max-w-4xl rounded-[32px] border border-[rgba(180,80,80,0.16)] bg-[rgba(250,246,240,0.9)] p-10 shadow-[0_24px_60px_rgba(122,53,53,0.08)] backdrop-blur">
					<span className="mb-3 block text-[10px] uppercase tracking-[0.24em] text-[#9A6060]">
						Area de cliente
					</span>
					<h1
						className="text-[#4C2323]"
						style={{
							fontFamily: 'Cormorant Garamond, serif',
							fontSize: 'clamp(2.4rem, 5vw, 4rem)',
							lineHeight: 1,
						}}
					>
						Tus pedidos
					</h1>
					<p className="mt-4 max-w-2xl text-sm leading-7 text-[#6D4747]">
						Esta seccion quedo lista como punto de entrada para el historial del cliente despues del merge.
						Desde aqui podras continuar la implementacion sin volver a romper el build del frontend.
					</p>

					<div className="mt-8 flex flex-wrap gap-4">
						<Link
							href="/cliente/dashboard"
							className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-white"
							style={{ background: '#7A2020' }}
						>
							Volver al dashboard
						</Link>
						<Link
							href="/cliente/tienda/hazlo-tu-mismo"
							className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-[#7A2020]"
							style={{ border: '0.5px solid rgba(122,32,32,0.35)' }}
						>
							Personalizar bouquet
						</Link>
					</div>
				</section>
			</main>
		</div>
	)
}
