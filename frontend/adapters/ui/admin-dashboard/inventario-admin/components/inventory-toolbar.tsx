'use client'

import type { InventoryCategoryItem } from '@/domain/entities/inventario-admin'
import styles from './inventory-toolbar.module.css'

interface InventoryToolbarProps {
  draftQuery: string
  categoriaId: string
  estado: string
  categories: InventoryCategoryItem[]
  totalProducts: number
  onDraftQueryChange: (value: string) => void
  onCategoriaChange: (value: string) => void
  onEstadoChange: (value: string) => void
  onApplyFilters: () => void
}

export function InventoryToolbar({
  draftQuery,
  categoriaId,
  estado,
  categories,
  totalProducts,
  onDraftQueryChange,
  onCategoriaChange,
  onEstadoChange,
  onApplyFilters,
}: InventoryToolbarProps) {
  return (
    <section className={styles.toolbarShell}>
      <div className={styles.toolbarHeader}>
        <div>
          <span className={styles.eyebrow}>Inventario real</span>
          <h3 className={styles.title}>Busqueda y filtros</h3>
        </div>
        <p className={styles.description}>Filtra por nombre, descripcion, categoria y estado para mantener el inventario floral ordenado.</p>
      </div>

      <div className={styles.controlsRow}>
        <label className={styles.searchField}>
          <span>Buscar producto</span>
          <div className={styles.searchInputRow}>
            <input
              type="search"
              value={draftQuery}
              onChange={(event) => onDraftQueryChange(event.target.value)}
              placeholder="Ej. girasol real, cinta satinada, peluche"
            />
            <button type="button" className={styles.primaryButton} onClick={onApplyFilters}>
              Aplicar
            </button>
          </div>
        </label>

        <label className={styles.filterField}>
          <span>Categoria</span>
          <select value={categoriaId} onChange={(event) => onCategoriaChange(event.target.value)}>
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
        </label>

        <label className={styles.filterField}>
          <span>Estado</span>
          <select value={estado} onChange={(event) => onEstadoChange(event.target.value)}>
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </label>
      </div>

      <div className={styles.resultsMeta}>{totalProducts} productos visibles desde la base de datos</div>
    </section>
  )
}
