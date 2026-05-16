import type { CatalogPublicItem, CatalogoPublicResponse } from '@/domain/entities/catalogo'
import type { BouquetOption, FlowerCatalogItem } from './personalizacion-bouquets.types'

function createFallbackImage(label: string, accentColor: string): string {
  const safeLabel = label.slice(0, 24)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#fff8f4" />
          <stop offset="100%" stop-color="#f0dfdb" />
        </linearGradient>
      </defs>
      <rect width="640" height="640" rx="48" fill="url(#bg)" />
      <circle cx="320" cy="240" r="144" fill="${accentColor}" fill-opacity="0.18" />
      <path d="M188 450c40-112 87-196 132-196 44 0 91 84 131 196" fill="none" stroke="${accentColor}" stroke-width="24" stroke-linecap="round" />
      <text x="320" y="540" text-anchor="middle" fill="#5b3030" font-size="36" font-family="DM Sans, Arial, sans-serif">${safeLabel}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function normalizeFlowerCategory(value: string): FlowerCatalogItem['category'] {
  const normalizedValue = value.trim().toLowerCase()

  if (normalizedValue === 'relleno') {
    return 'Relleno'
  }

  if (normalizedValue === 'follaje') {
    return 'Follaje'
  }

  return 'Flor focal'
}

function mapBouquet(item: CatalogPublicItem): BouquetOption {
  const accentColor = item.accentColor || '#7A3535'

  return {
    id: item.id,
    productId: item.productId,
    title: item.nombre,
    subtitle: item.subtitulo || 'Bouquet disponible',
    description: item.descripcion || 'Disponible desde el catalogo real del sistema.',
    badge: item.badge || 'Catalogo activo',
    imageSrc: item.imageSrc || createFallbackImage(item.nombre, accentColor),
    accentColor,
    price: item.precioUnitario,
    stock: item.cantidad,
    composition: {
      clipPath: item.compositionConfig.clipPath,
      dragBounds: item.compositionConfig.dragBounds,
      gradient: item.compositionConfig.gradient,
      points: item.compositionConfig.points,
    },
  }
}

function mapFlower(item: CatalogPublicItem): FlowerCatalogItem {
  const accentColor = item.accentColor || '#7A3535'

  return {
    id: item.id,
    productId: item.productId,
    name: item.nombre,
    category: normalizeFlowerCategory(item.categoryLabel),
    tone: item.tone || 'Flor activa del catalogo',
    accentColor,
    note: item.descripcion || 'Disponible en el catalogo floral real.',
    imageSrc: item.imageSrc || createFallbackImage(item.nombre, accentColor),
    price: item.precioUnitario,
    stock: item.cantidad,
    render: item.renderConfig,
  }
}

export function mapCatalogoPublicoToPersonalizacion(response: CatalogoPublicResponse): {
  bouquets: BouquetOption[]
  flowers: FlowerCatalogItem[]
} {
  return {
    bouquets: response.bouquets.map(mapBouquet),
    flowers: response.flowers.map(mapFlower),
  }
}
