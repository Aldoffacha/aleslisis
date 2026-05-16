export type CatalogVisualType = 'bouquet' | 'flor'

export interface CatalogMaskPoint {
  x: number
  y: number
}

export interface CatalogGradientConfig {
  from: string
  to: string
  angle: number
}

export interface CatalogDragBounds {
  minX: number
  maxX: number
  minBottom: number
  maxBottom: number
}

export interface CatalogRenderConfig {
  widthPercent: number
  maxWidth: number
  bottomOffset: number
  rotateJitter: number
  priority: number
}

export interface CatalogCompositionConfig {
  points?: CatalogMaskPoint[]
  clipPath: string
  dragBounds: CatalogDragBounds
  gradient?: CatalogGradientConfig
}

export interface CatalogPublicItem {
  productId: number
  id: string
  slug: string
  tipoVisual: CatalogVisualType
  nombre: string
  descripcion: string
  precioUnitario: string
  cantidad: number
  estado: string
  categoriaId: number | null
  categoriaNombre: string
  subtitulo: string
  badge: string
  accentColor: string
  tone: string
  categoryLabel: string
  imageSrc: string
  renderConfig: CatalogRenderConfig
  compositionConfig: CatalogCompositionConfig
  updatedAt: string
}

export interface CatalogoPublicResponse {
  bouquets: CatalogPublicItem[]
  flowers: CatalogPublicItem[]
}

export interface CatalogCategory {
  id: number
  nombre: string
  descripcion: string
  estado: string
}

export interface CatalogAdminSummary {
  categorias: CatalogCategory[]
  items: CatalogPublicItem[]
}

export interface CatalogItemMutationInput {
  tipoVisual: CatalogVisualType
  nombre: string
  descripcion: string
  precioUnitario: string
  cantidad: number
  estado: string
  categoriaId: number | null
  subtitulo: string
  badge: string
  accentColor: string
  tone: string
  categoryLabel: string
  renderConfig?: CatalogRenderConfig
  compositionConfig?: CatalogCompositionConfig
  imageFile?: File | null
  removeImage?: boolean
}
