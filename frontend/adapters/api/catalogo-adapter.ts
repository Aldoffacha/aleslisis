import type {
  CatalogAdminSummary,
  CatalogItemMutationInput,
  CatalogPublicItem,
  CatalogoPublicResponse,
} from '@/domain/entities/catalogo'
import { apiRequest } from '@/lib/http-client'

function appendField(formData: FormData, key: string, value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return
  }

  formData.append(key, String(value))
}

export function buildCatalogItemFormData(payload: CatalogItemMutationInput): FormData {
  const formData = new FormData()

  appendField(formData, 'tipo_visual', payload.tipoVisual)
  appendField(formData, 'nombre', payload.nombre)
  appendField(formData, 'descripcion', payload.descripcion)
  appendField(formData, 'precio_unitario', payload.precioUnitario)
  appendField(formData, 'cantidad', payload.cantidad)
  appendField(formData, 'estado', payload.estado)
  appendField(formData, 'id_categoria', payload.categoriaId)
  appendField(formData, 'subtitulo', payload.subtitulo)
  appendField(formData, 'badge', payload.badge)
  appendField(formData, 'accent_color', payload.accentColor)
  appendField(formData, 'tone', payload.tone)
  appendField(formData, 'category_label', payload.categoryLabel)

  if (payload.renderConfig) {
    formData.append('render_config', JSON.stringify(payload.renderConfig))
  }

  if (payload.compositionConfig) {
    formData.append('composition_config', JSON.stringify(payload.compositionConfig))
  }

  if (payload.imageFile) {
    formData.append('image', payload.imageFile)
  }

  if (payload.removeImage) {
    formData.append('remove_image', 'true')
  }

  return formData
}

export const catalogoAdapter = {
  fetchPublicPersonalizacion: () => apiRequest<CatalogoPublicResponse>('/publico/personalizacion/', { apiPrefix: '/api/catalogo' }),

  fetchAdminSummary: (params?: { tipoVisual?: string, estado?: string }) => {
    const query = new URLSearchParams()

    if (params?.tipoVisual) {
      query.set('tipo_visual', params.tipoVisual)
    }

    if (params?.estado) {
      query.set('estado', params.estado)
    }

    const suffix = query.toString() ? `?${query.toString()}` : ''
    return apiRequest<CatalogAdminSummary>(`/admin/resumen/${suffix}`, { apiPrefix: '/api/catalogo' })
  },

  createItem: (payload: CatalogItemMutationInput) => apiRequest<CatalogPublicItem>('/admin/items/', {
    apiPrefix: '/api/catalogo',
    method: 'POST',
    body: buildCatalogItemFormData(payload),
  }),

  updateItem: (productId: number, payload: CatalogItemMutationInput) => apiRequest<CatalogPublicItem>(`/admin/items/${productId}/`, {
    apiPrefix: '/api/catalogo',
    method: 'PATCH',
    body: buildCatalogItemFormData(payload),
  }),

  deleteItem: (productId: number) => apiRequest<CatalogPublicItem>(`/admin/items/${productId}/`, {
    apiPrefix: '/api/catalogo',
    method: 'DELETE',
  }),
}
