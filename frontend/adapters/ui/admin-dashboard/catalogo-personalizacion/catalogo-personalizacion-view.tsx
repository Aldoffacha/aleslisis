'use client'

import { useEffect, useMemo, useState } from 'react'
import { catalogoAdapter } from '@/adapters/api/catalogo-adapter'
import type { CatalogCategory, CatalogPublicItem } from '@/domain/entities/catalogo'
import { CatalogoItemForm } from './catalogo-item-form'
import {
  type CatalogEditorMode,
  type CatalogFormState,
  catalogItemToFormState,
  createEmptyFormState,
  formStateToPayload,
  readFileAsDataUrl,
} from './catalogo-personalizacion.utils'
import styles from './catalogo-personalizacion-view.module.css'

const editorModes: Array<{ id: CatalogEditorMode, label: string, note: string }> = [
  { id: 'bouquet', label: 'Bouquets', note: 'Mascara, degradado e imagen del bouquet' },
  { id: 'flor', label: 'Flores', note: 'Catalogo floral y parametros de render' },
  { id: 'vista', label: 'Solo vista', note: 'Revision del catalogo activo e inactivo' },
]

const PAGE_SIZE = 8

function isItemActive(item: CatalogPublicItem): boolean {
  return item.estado.trim().toLowerCase() === 'activo'
}

export function CatalogoPersonalizacionView() {
  const [mode, setMode] = useState<CatalogEditorMode>('bouquet')
  const [items, setItems] = useState<CatalogPublicItem[]>([])
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [formState, setFormState] = useState<CatalogFormState>(createEmptyFormState('bouquet'))
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const loadCatalog = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const summary = await catalogoAdapter.fetchAdminSummary()
      setItems(summary.items)
      setCategories(summary.categorias)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar el catalogo del administrador.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCatalog()
  }, [])

  const bouquetItems = useMemo(() => items.filter((item) => item.tipoVisual === 'bouquet'), [items])
  const flowerItems = useMemo(() => items.filter((item) => item.tipoVisual === 'flor'), [items])
  const activeCount = useMemo(() => items.filter(isItemActive).length, [items])

  const visibleItems = mode === 'bouquet'
    ? bouquetItems
    : mode === 'flor'
      ? flowerItems
      : items

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = visibleItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleModeChange = (nextMode: CatalogEditorMode) => {
    setMode(nextMode)
    setFeedback(null)
    setErrorMessage(null)
    setPage(1)

    if (nextMode !== 'vista') {
      setEditingId(null)
      setFormState(createEmptyFormState(nextMode))
    }
  }

  const handleStartCreate = (nextMode: 'bouquet' | 'flor') => {
    setMode(nextMode)
    setEditingId(null)
    setFormState(createEmptyFormState(nextMode))
    setFeedback(null)
    setErrorMessage(null)
  }

  const handleEdit = (item: CatalogPublicItem) => {
    setMode(item.tipoVisual)
    setEditingId(item.productId)
    setFormState(catalogItemToFormState(item))
    setFeedback(null)
    setErrorMessage(null)
  }

  const handleFieldChange = (field: keyof CatalogFormState, value: string | boolean) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  const handleRenderFieldChange = (field: keyof CatalogFormState['renderConfig'], value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      renderConfig: {
        ...currentState.renderConfig,
        [field]: value,
      },
    }))
  }

  const handlePointsChange = (points: CatalogFormState['composition']['points']) => {
    setFormState((currentState) => ({
      ...currentState,
      composition: {
        ...currentState.composition,
        points,
      },
    }))
  }

  const handleGradientChange = (field: 'from' | 'to' | 'angle', value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      composition: {
        ...currentState.composition,
        gradient: {
          ...currentState.composition.gradient,
          [field]: value,
        },
      },
    }))
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setFormState((currentState) => ({
        ...currentState,
        imageFile: null,
      }))
      return
    }

    try {
      const preview = await readFileAsDataUrl(file)
      setFormState((currentState) => ({
        ...currentState,
        imageFile: file,
        imagePreview: preview,
        removeImage: false,
      }))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo preparar la vista previa de la imagen.')
    }
  }

  const handleReset = () => {
    setEditingId(null)
    setFormState(createEmptyFormState(mode === 'vista' ? 'bouquet' : mode))
    setFeedback(null)
    setErrorMessage(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage(null)
    setFeedback(null)

    try {
      const payload = formStateToPayload(formState)
      const savedItem = editingId
        ? await catalogoAdapter.updateItem(editingId, payload)
        : await catalogoAdapter.createItem(payload)

      await loadCatalog()
      setEditingId(savedItem.productId)
      setFormState(catalogItemToFormState(savedItem))
      setFeedback(editingId ? 'Cambios guardados en el catalogo real.' : 'Nuevo registro creado en la base de datos.')
      setPage(1)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar el registro.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleItemState = async (item: CatalogPublicItem) => {
    setIsSaving(true)
    setFeedback(null)
    setErrorMessage(null)

    try {
      const itemFormState = catalogItemToFormState(item)
      const payload = formStateToPayload(itemFormState)
      payload.estado = isItemActive(item) ? 'inactivo' : 'activo'
      await catalogoAdapter.updateItem(item.productId, payload)
      await loadCatalog()
      setFeedback(isItemActive(item) ? 'El registro fue ocultado logicamente.' : 'El registro fue reactivado.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo actualizar el estado del registro.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className={styles.shell}>
      <div className={styles.header}>
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow}>Catalogo y stock</span>
          <h2 className={styles.title}>Personalizacion Bouquets</h2>
          <p className={styles.description}>
            Gestiona bouquets y flores desde la base de datos real.
          </p>
        </div>

        <div className={styles.metricsGrid}>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Bouquets</span>
            <strong className={styles.metricValue}>{bouquetItems.length}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Flores</span>
            <strong className={styles.metricValue}>{flowerItems.length}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Activos</span>
            <strong className={styles.metricValue}>{activeCount}</strong>
          </article>
        </div>
      </div>

      <div className={styles.modeRow}>
        {editorModes.map((editorMode) => (
          <button
            key={editorMode.id}
            type="button"
            className={`${styles.modeButton} ${mode === editorMode.id ? styles.modeButtonActive : ''}`}
            onClick={() => handleModeChange(editorMode.id)}
          >
            <strong>{editorMode.label}</strong>
            <span>{editorMode.note}</span>
          </button>
        ))}
      </div>

      {feedback ? <div className={styles.feedbackSuccess}>{feedback}</div> : null}
      {errorMessage ? <div className={styles.feedbackError}>{errorMessage}</div> : null}

      {mode === 'vista' ? (
        <div className={styles.galleryGrid}>
          {paginatedItems.map((item) => (
            <article key={item.productId} className={styles.galleryCard}>
              <div className={styles.galleryPreview}>
                {item.imageSrc ? <img src={item.imageSrc} alt={item.nombre} /> : <span>Sin imagen</span>}
              </div>
              <div className={styles.galleryBody}>
                <div className={styles.galleryHeader}>
                  <strong>{item.nombre}</strong>
                  <span className={`${styles.stateBadge} ${isItemActive(item) ? styles.stateBadgeActive : styles.stateBadgeInactive}`}>
                    {item.estado}
                  </span>
                </div>
                <p>{item.descripcion || 'Sin descripcion visual registrada.'}</p>
                <div className={styles.galleryMeta}>
                  <span>{item.tipoVisual === 'bouquet' ? 'Bouquet' : 'Flor'}</span>
                  <span>Stock {item.cantidad}</span>
                  <span>Bs. {item.precioUnitario}</span>
                </div>
              </div>
            </article>
          ))}
          {visibleItems.length > PAGE_SIZE ? (
            <div className={styles.paginationRow} style={{ gridColumn: '1 / -1' }}>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => setPage((p) => p - 1)}
                disabled={currentPage <= 1}
              >
                Anterior
              </button>
              <span className={styles.pageInfo}>{currentPage} / {totalPages}</span>
              <button
                type="button"
                className={styles.paginationButton}
                onClick={() => setPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
              >
                Siguiente
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className={styles.workspace}>
          <section className={styles.listPanel}>
            <div className={styles.listHeader}>
              <div>
                <span className={styles.listEyebrow}>Registros reales</span>
                <h3 className={styles.listTitle}>{mode === 'bouquet' ? 'Bouquets' : 'Flores'} del sistema</h3>
              </div>
              <button type="button" className={styles.createButton} onClick={() => handleStartCreate(mode)}>
                {mode === 'bouquet' ? 'Nuevo bouquet' : 'Nueva flor'}
              </button>
            </div>

            {isLoading ? (
              <div className={styles.emptyListState}>Cargando catalogo real...</div>
            ) : paginatedItems.length === 0 ? (
              <div className={styles.emptyListState}>
                No hay registros en esta seccion. Usa el formulario para crear el primero.
              </div>
            ) : (
              <>
                <div className={styles.itemList}>
                  {paginatedItems.map((item) => (
                    <article
                      key={item.productId}
                      className={`${styles.itemCard} ${editingId === item.productId ? styles.itemCardActive : ''}`}
                    >
                      <div className={styles.itemCopy}>
                        <div className={styles.itemHeading}>
                          <strong>{item.nombre}</strong>
                          <span className={`${styles.stateBadge} ${isItemActive(item) ? styles.stateBadgeActive : styles.stateBadgeInactive}`}>
                            {item.estado}
                          </span>
                        </div>
                        <p>{item.descripcion || 'Sin descripcion registrada.'}</p>
                        <div className={styles.itemMeta}>
                          <span>Stock {item.cantidad}</span>
                          <span>Bs. {item.precioUnitario}</span>
                          <span>{item.imageSrc ? 'Con imagen' : 'Sin imagen'}</span>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <button type="button" className={styles.secondaryAction} onClick={() => handleEdit(item)}>
                          Editar
                        </button>
                        <button type="button" className={styles.secondaryAction} onClick={() => void handleToggleItemState(item)} disabled={isSaving}>
                          {isItemActive(item) ? 'Ocultar' : 'Activar'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                {visibleItems.length > PAGE_SIZE ? (
                  <div className={styles.paginationRow}>
                    <button
                      type="button"
                      className={styles.paginationButton}
                      onClick={() => setPage((p) => p - 1)}
                      disabled={currentPage <= 1}
                    >
                      Anterior
                    </button>
                    <span className={styles.pageInfo}>{currentPage} / {totalPages}</span>
                    <button
                      type="button"
                      className={styles.paginationButton}
                      onClick={() => setPage((p) => p + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </section>

          <CatalogoItemForm
            mode={mode}
            categories={categories}
            formState={formState}
            isSaving={isSaving}
            isEditing={Boolean(editingId)}
            onFieldChange={handleFieldChange}
            onRenderFieldChange={handleRenderFieldChange}
            onPointsChange={handlePointsChange}
            onGradientChange={handleGradientChange}
            onFileChange={(file) => void handleFileChange(file)}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>
      )}
    </section>
  )
}
