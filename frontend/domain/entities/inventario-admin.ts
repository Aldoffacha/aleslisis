export interface InventoryCategoryItem {
  id: number
  nombre: string
  descripcion: string
  estado: string
  productCount: number
}

export interface InventoryTypeItem {
  id: number
  categoriaId: number
  categoriaNombre: string
  nombre: string
  descripcion: string
  estado: string
}

export interface InventoryTypeInput {
  nombre: string
  descripcion?: string
  estado?: string
}

export interface InventoryProductItem {
  id: number
  nombre: string
  descripcion: string
  precioUnitario: string
  cantidad: number
  estado: string
  categoriaId: number | null
  categoriaNombre: string
  tipoItem: string
  tipoItemId: number | null
  imageSrc: string
}

export interface InventorySummary {
  categorias: InventoryCategoryItem[]
  tipos: InventoryTypeItem[]
  productos: InventoryProductItem[]
}

export interface InventoryCategoryInput {
  nombre: string
  descripcion?: string
  estado?: string
}

export interface InventoryProductInput {
  nombre: string
  descripcion?: string
  precioUnitario: string
  cantidad: number
  estado?: string
  categoriaId: number | null
  tipoItemId?: number | null
  tipoItem?: string
  imageFile?: File | null
  removeImage?: boolean
}

export interface InventorySummaryQueryParams {
  q?: string
  categoriaId?: number
  estado?: string
}
