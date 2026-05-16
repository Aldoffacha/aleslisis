'use client'

import type { InventoryCategoryItem, InventoryProductItem, InventoryTypeItem } from '@/domain/entities/inventario-admin'
import styles from './inventory-lists.module.css'

interface InventoryCategoriesPanelProps {
  categories: InventoryCategoryItem[]
  categoryTypes: Record<number, InventoryTypeItem[]>
  selectedCategoryId: number | null
  isLoading: boolean
  isSaving: boolean
  onSelectCategory: (category: InventoryCategoryItem) => void
  onToggleCategoryState: (category: InventoryCategoryItem) => void
}

interface InventoryProductsPanelProps {
  products: InventoryProductItem[]
  selectedProductId: number | null
  isLoading: boolean
  isSaving: boolean
  onSelectProduct: (product: InventoryProductItem) => void
  onToggleProductState: (product: InventoryProductItem) => void
}

function getStateLabel(state: string): string {
  return state.trim().toLowerCase() === 'activo' ? 'Activo' : 'Inactivo'
}

export function InventoryCategoriesPanel({
  categories,
  categoryTypes,
  selectedCategoryId,
  isLoading,
  isSaving,
  onSelectCategory,
  onToggleCategoryState,
}: InventoryCategoriesPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.eyebrow}>Categorias reales</span>
          <h3 className={styles.title}>Categorias</h3>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Cargando categorias reales...</div>
      ) : categories.length === 0 ? (
        <div className={styles.emptyState}>No hay categorias registradas todavia.</div>
      ) : (
        <div className={styles.list}>
          {categories.map((category) => {
            const isActive = category.estado.trim().toLowerCase() === 'activo'
            const linkedTypes = categoryTypes[category.id] || []
            const visibleTypes = linkedTypes.slice(0, 4)
            const hiddenTypesCount = Math.max(0, linkedTypes.length - visibleTypes.length)
            return (
              <article key={category.id} className={`${styles.card} ${selectedCategoryId === category.id ? styles.cardActive : ''}`}>
                <button type="button" className={styles.cardMain} onClick={() => onSelectCategory(category)}>
                  <div className={styles.cardHeader}>
                    <strong>{category.nombre}</strong>
                    <span className={`${styles.stateBadge} ${isActive ? styles.stateBadgeActive : styles.stateBadgeInactive}`}>
                      {getStateLabel(category.estado)}
                    </span>
                  </div>
                  <p>{category.descripcion || 'Sin descripcion registrada.'}</p>
                  <div className={styles.metaRow}>
                    <span>{category.productCount} productos</span>
                    <span>{linkedTypes.length} tipos</span>
                  </div>
                  <div className={styles.typeList}>
                    {visibleTypes.length > 0 ? (
                      visibleTypes.map((inventoryType) => {
                        const isTypeActive = inventoryType.estado.trim().toLowerCase() === 'activo'
                        return (
                          <span
                            key={inventoryType.id}
                            className={`${styles.typeChip} ${isTypeActive ? '' : styles.typeChipInactive}`.trim()}
                          >
                            {inventoryType.nombre}
                          </span>
                        )
                      })
                    ) : (
                      <span className={styles.typeHint}>Sin tipos enlazados</span>
                    )}
                    {hiddenTypesCount > 0 ? <span className={styles.typeHint}>+{hiddenTypesCount} mas</span> : null}
                  </div>
                </button>
                <div className={styles.actionRow}>
                  <button type="button" className={styles.secondaryButton} onClick={() => onSelectCategory(category)}>
                    Editar
                  </button>
                  <button type="button" className={styles.secondaryButton} onClick={() => onToggleCategoryState(category)} disabled={isSaving}>
                    {isActive ? 'Ocultar' : 'Activar'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function InventoryProductsPanel({
  products,
  selectedProductId,
  isLoading,
  isSaving,
  onSelectProduct,
  onToggleProductState,
}: InventoryProductsPanelProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.eyebrow}>Productos reales</span>
          <h3 className={styles.title}>Inventario</h3>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.emptyState}>Cargando productos reales...</div>
      ) : products.length === 0 ? (
        <div className={styles.emptyState}>No hay productos que coincidan con los filtros actuales.</div>
      ) : (
        <div className={styles.list}>
          {products.map((product) => {
            const isActive = product.estado.trim().toLowerCase() === 'activo'
            return (
              <article key={product.id} className={`${styles.card} ${selectedProductId === product.id ? styles.cardActive : ''}`}>
                <button type="button" className={styles.cardMain} onClick={() => onSelectProduct(product)}>
                  <div className={styles.productRow}>
                    {product.imageSrc ? (
                      <img src={product.imageSrc} alt={product.nombre} className={styles.thumb} />
                    ) : (
                      <div className={styles.thumbFallback}>Sin imagen</div>
                    )}

                    <div className={styles.productBody}>
                      <div className={styles.cardHeader}>
                        <strong>{product.nombre}</strong>
                        <span className={`${styles.stateBadge} ${isActive ? styles.stateBadgeActive : styles.stateBadgeInactive}`}>
                          {getStateLabel(product.estado)}
                        </span>
                      </div>
                      <p>{product.descripcion || 'Sin descripcion registrada.'}</p>
                      <div className={styles.metaRow}>
                        <span>{product.tipoItem || 'Sin tipo'}</span>
                        <span>{product.categoriaNombre || 'Sin categoria'}</span>
                        <span>Stock {product.cantidad}</span>
                        <span>Bs. {product.precioUnitario}</span>
                      </div>
                    </div>
                  </div>
                </button>
                <div className={styles.actionRow}>
                  <button type="button" className={styles.secondaryButton} onClick={() => onSelectProduct(product)}>
                    Editar
                  </button>
                  <button type="button" className={styles.secondaryButton} onClick={() => onToggleProductState(product)} disabled={isSaving}>
                    {isActive ? 'Ocultar' : 'Activar'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
