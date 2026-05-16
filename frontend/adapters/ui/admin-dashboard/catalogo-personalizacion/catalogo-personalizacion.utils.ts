import type {
  CatalogDragBounds,
  CatalogGradientConfig,
  CatalogItemMutationInput,
  CatalogMaskPoint,
  CatalogPublicItem,
} from '@/domain/entities/catalogo'

export type CatalogEditorMode = 'bouquet' | 'flor' | 'vista'

export interface CatalogRenderFormState {
  widthPercent: string
  maxWidth: string
  bottomOffset: string
  rotateJitter: string
  priority: string
}

export interface CatalogGradientFormState {
  from: string
  to: string
  angle: string
}

export interface CatalogFormState {
  productId: number | null
  tipoVisual: 'bouquet' | 'flor'
  nombre: string
  descripcion: string
  precioUnitario: string
  cantidad: string
  estado: string
  categoriaId: string
  subtitulo: string
  badge: string
  accentColor: string
  tone: string
  categoryLabel: string
  imagePreview: string
  imageFile: File | null
  removeImage: boolean
  renderConfig: CatalogRenderFormState
  composition: {
    points: CatalogMaskPoint[]
    gradient: CatalogGradientFormState
  }
}

const DEFAULT_POINTS: CatalogMaskPoint[] = [
  { x: 12, y: 14 },
  { x: 88, y: 14 },
  { x: 95, y: 28 },
  { x: 92, y: 45 },
  { x: 78, y: 66 },
  { x: 60, y: 91 },
  { x: 50, y: 98 },
  { x: 40, y: 91 },
  { x: 22, y: 66 },
  { x: 8, y: 45 },
  { x: 5, y: 28 },
]

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

function toNumber(value: string, fallback: number): number {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

export function pointsToClipPath(points: CatalogMaskPoint[]): string {
  const safePoints = points.length >= 3 ? points : DEFAULT_POINTS
  const polygonPoints = safePoints.map((point) => `${point.x}% ${point.y}%`).join(', ')
  return `polygon(${polygonPoints})`
}

export function pointsToDragBounds(points: CatalogMaskPoint[]): CatalogDragBounds {
  const safePoints = points.length >= 3 ? points : DEFAULT_POINTS
  const xs = safePoints.map((point) => point.x)
  const ys = safePoints.map((point) => point.y)
  const minX = Math.round(clamp(Math.min(...xs) + 5, 10, 74))
  const maxX = Math.round(clamp(Math.max(...xs) - 5, 26, 90))
  const minBottom = Math.round(clamp(100 - Math.max(...ys) + 4, 12, 56))
  const maxBottom = Math.round(clamp(100 - Math.min(...ys) - 6, minBottom + 8, 82))

  return {
    minX,
    maxX,
    minBottom,
    maxBottom,
  }
}

export function createEmptyFormState(tipoVisual: 'bouquet' | 'flor'): CatalogFormState {
  return {
    productId: null,
    tipoVisual,
    nombre: '',
    descripcion: '',
    precioUnitario: '',
    cantidad: '0',
    estado: 'activo',
    categoriaId: '',
    subtitulo: '',
    badge: '',
    accentColor: tipoVisual === 'bouquet' ? '#7A3535' : '#B05C5C',
    tone: '',
    categoryLabel: 'Flor focal',
    imagePreview: '',
    imageFile: null,
    removeImage: false,
    renderConfig: {
      widthPercent: '38',
      maxWidth: '280',
      bottomOffset: '3',
      rotateJitter: '6',
      priority: '1',
    },
    composition: {
      points: DEFAULT_POINTS,
      gradient: {
        from: 'rgba(255,255,255,0.08)',
        to: 'rgba(122,53,53,0.34)',
        angle: '180',
      },
    },
  }
}

export function catalogItemToFormState(item: CatalogPublicItem): CatalogFormState {
  return {
    productId: item.productId,
    tipoVisual: item.tipoVisual,
    nombre: item.nombre,
    descripcion: item.descripcion,
    precioUnitario: item.precioUnitario,
    cantidad: String(item.cantidad),
    estado: item.estado || 'activo',
    categoriaId: item.categoriaId ? String(item.categoriaId) : '',
    subtitulo: item.subtitulo || '',
    badge: item.badge || '',
    accentColor: item.accentColor || '#7A3535',
    tone: item.tone || '',
    categoryLabel: item.categoryLabel || 'Flor focal',
    imagePreview: item.imageSrc || '',
    imageFile: null,
    removeImage: false,
    renderConfig: {
      widthPercent: String(item.renderConfig.widthPercent ?? 38),
      maxWidth: String(item.renderConfig.maxWidth ?? 280),
      bottomOffset: String(item.renderConfig.bottomOffset ?? 3),
      rotateJitter: String(item.renderConfig.rotateJitter ?? 6),
      priority: String(item.renderConfig.priority ?? 1),
    },
    composition: {
      points: item.compositionConfig.points?.length ? item.compositionConfig.points : DEFAULT_POINTS,
      gradient: {
        from: item.compositionConfig.gradient?.from || 'rgba(255,255,255,0.08)',
        to: item.compositionConfig.gradient?.to || 'rgba(122,53,53,0.34)',
        angle: String(item.compositionConfig.gradient?.angle ?? 180),
      },
    },
  }
}

export async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }

    reader.onerror = () => {
      reject(new Error('No se pudo leer la imagen seleccionada.'))
    }

    reader.readAsDataURL(file)
  })
}

export function formStateToPayload(formState: CatalogFormState): CatalogItemMutationInput {
  const points = formState.composition.points.length >= 3 ? formState.composition.points : DEFAULT_POINTS
  const gradient: CatalogGradientConfig = {
    from: formState.composition.gradient.from,
    to: formState.composition.gradient.to,
    angle: toNumber(formState.composition.gradient.angle, 180),
  }

  return {
    tipoVisual: formState.tipoVisual,
    nombre: formState.nombre.trim(),
    descripcion: formState.descripcion.trim(),
    precioUnitario: formState.precioUnitario || '0',
    cantidad: Math.max(0, Math.round(toNumber(formState.cantidad, 0))),
    estado: formState.estado || 'activo',
    categoriaId: formState.categoriaId ? Number(formState.categoriaId) : null,
    subtitulo: formState.subtitulo.trim(),
    badge: formState.badge.trim(),
    accentColor: formState.accentColor || '#7A3535',
    tone: formState.tone.trim(),
    categoryLabel: formState.categoryLabel.trim(),
    imageFile: formState.imageFile,
    removeImage: formState.removeImage,
    renderConfig: formState.tipoVisual === 'flor'
      ? {
          widthPercent: toNumber(formState.renderConfig.widthPercent, 38),
          maxWidth: Math.round(toNumber(formState.renderConfig.maxWidth, 280)),
          bottomOffset: toNumber(formState.renderConfig.bottomOffset, 3),
          rotateJitter: toNumber(formState.renderConfig.rotateJitter, 6),
          priority: Math.round(toNumber(formState.renderConfig.priority, 1)),
        }
      : undefined,
    compositionConfig: formState.tipoVisual === 'bouquet'
      ? {
          points,
          clipPath: pointsToClipPath(points),
          dragBounds: pointsToDragBounds(points),
          gradient,
        }
      : undefined,
  }
}
