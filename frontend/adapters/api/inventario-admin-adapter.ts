import type {
  InventoryCategoryInput,
  InventoryCategoryItem,
  InventoryProductInput,
  InventoryProductItem,
  InventorySummary,
  InventorySummaryQueryParams,
  InventoryTypeInput,
  InventoryTypeItem,
} from '@/domain/entities/inventario-admin'
import { apiRequest } from '@/lib/http-client'

function appendField(formData: FormData, key: string, value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return
  }

  formData.append(key, String(value))
}

function buildProductFormData(payload: InventoryProductInput): FormData {
  const formData = new FormData()

  appendField(formData, 'nombre', payload.nombre)
  appendField(formData, 'descripcion', payload.descripcion)
  appendField(formData, 'precio_unitario', payload.precioUnitario)
  appendField(formData, 'cantidad', payload.cantidad)
  appendField(formData, 'estado', payload.estado)
  appendField(formData, 'id_categoria', payload.categoriaId)

  if ('tipoItemId' in payload) {
    formData.append('id_tipo_inventario', payload.tipoItemId === null || payload.tipoItemId === undefined ? 'null' : String(payload.tipoItemId))
  }

  if ('tipoItem' in payload) {
    formData.append('tipo_item', payload.tipoItem ?? '')
  }

  if (payload.imageFile) {
    formData.append('image', payload.imageFile)
  }

  if (payload.removeImage) {
    formData.append('remove_image', 'true')
  }

  return formData
}

function buildSummaryQuery(params?: InventorySummaryQueryParams): string {
  const query = new URLSearchParams()

  if (params?.q) {
    query.set('q', params.q)
  }

  if (params?.categoriaId) {
    query.set('categoria_id', String(params.categoriaId))
  }

  if (params?.estado) {
    query.set('estado', params.estado)
  }

  const suffix = query.toString()
  return suffix ? `?${suffix}` : ''
}

export const inventarioAdminAdapter = {
  fetchSummary: (params?: InventorySummaryQueryParams) => apiRequest<InventorySummary>(`/resumen/${buildSummaryQuery(params)}`, {
    apiPrefix: '/api/catalogo/admin/inventario',
  }),

  createCategory: (payload: InventoryCategoryInput) => apiRequest<InventoryCategoryItem>('/categorias/', {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'POST',
    body: payload,
  }),

  updateCategory: (categoryId: number, payload: Partial<InventoryCategoryInput>) => apiRequest<InventoryCategoryItem>(`/categorias/${categoryId}/`, {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'PATCH',
    body: payload,
  }),

  deleteCategory: (categoryId: number) => apiRequest<InventoryCategoryItem>(`/categorias/${categoryId}/`, {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'DELETE',
  }),

  createType: (categoryId: number, payload: InventoryTypeInput) => apiRequest<InventoryTypeItem>(`/categorias/${categoryId}/tipos/`, {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'POST',
    body: payload,
  }),

  createProduct: (payload: InventoryProductInput) => apiRequest<InventoryProductItem>('/productos/', {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'POST',
    body: buildProductFormData(payload),
  }),

  updateProduct: (productId: number, payload: Partial<InventoryProductInput>) => apiRequest<InventoryProductItem>(`/productos/${productId}/`, {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'PATCH',
    body: buildProductFormData(payload as InventoryProductInput),
  }),

  deleteProduct: (productId: number) => apiRequest<InventoryProductItem>(`/productos/${productId}/`, {
    apiPrefix: '/api/catalogo/admin/inventario',
    method: 'DELETE',
  }),
}
