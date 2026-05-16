import type {
  InventoryCategoryInput,
  InventoryCategoryItem,
  InventoryProductInput,
  InventoryProductItem,
} from '@/domain/entities/inventario-admin'

export interface InventoryFiltersState {
  query: string
  categoriaId: string
  estado: string
}

export interface InventoryCategoryFormState {
  nombre: string
  descripcion: string
  estado: string
}

export interface InventoryProductFormState {
  nombre: string
  descripcion: string
  precioUnitario: string
  cantidad: string
  estado: string
  categoriaId: string
  tipoItemId: string
  tipoItem: string
  imagePreview: string
  imageFile: File | null
  removeImage: boolean
}

export const defaultInventoryFilters: InventoryFiltersState = {
  query: '',
  categoriaId: '',
  estado: '',
}

export function createEmptyCategoryFormState(): InventoryCategoryFormState {
  return {
    nombre: '',
    descripcion: '',
    estado: 'activo',
  }
}

export function createEmptyProductFormState(categoryId = ''): InventoryProductFormState {
  return {
    nombre: '',
    descripcion: '',
    precioUnitario: '',
    cantidad: '0',
    estado: 'activo',
    categoriaId: categoryId,
    tipoItemId: '',
    tipoItem: '',
    imagePreview: '',
    imageFile: null,
    removeImage: false,
  }
}

export function mapCategoryToFormState(category: InventoryCategoryItem): InventoryCategoryFormState {
  return {
    nombre: category.nombre,
    descripcion: category.descripcion,
    estado: category.estado || 'activo',
  }
}

export function mapProductToFormState(product: InventoryProductItem): InventoryProductFormState {
  return {
    nombre: product.nombre,
    descripcion: product.descripcion,
    precioUnitario: product.precioUnitario,
    cantidad: String(product.cantidad),
    estado: product.estado || 'activo',
    categoriaId: product.categoriaId ? String(product.categoriaId) : '',
    tipoItemId: product.tipoItemId ? String(product.tipoItemId) : '',
    tipoItem: product.tipoItem || '',
    imagePreview: product.imageSrc || '',
    imageFile: null,
    removeImage: false,
  }
}

function normalizeDecimalInput(value: string, fallback = '0'): string {
  const normalizedValue = value.trim().replace(/,/g, '.')
  return normalizedValue || fallback
}

export function categoryFormStateToPayload(formState: InventoryCategoryFormState): InventoryCategoryInput {
  return {
    nombre: formState.nombre.trim(),
    descripcion: formState.descripcion.trim(),
    estado: formState.estado,
  }
}

export function productFormStateToPayload(formState: InventoryProductFormState): InventoryProductInput {
  const quantity = Number(formState.cantidad)

  return {
    nombre: formState.nombre.trim(),
    descripcion: formState.descripcion.trim(),
    precioUnitario: normalizeDecimalInput(formState.precioUnitario),
    cantidad: Number.isFinite(quantity) ? Math.max(0, Math.round(quantity)) : 0,
    estado: formState.estado,
    categoriaId: formState.categoriaId ? Number(formState.categoriaId) : null,
    tipoItemId: formState.tipoItemId ? Number(formState.tipoItemId) : null,
    tipoItem: formState.tipoItem.trim(),
    imageFile: formState.imageFile,
    removeImage: formState.removeImage,
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

export function toggleEntityState(currentState: string): string {
  return currentState.trim().toLowerCase() === 'activo' ? 'inactivo' : 'activo'
}
