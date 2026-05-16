'use client'

import type { CatalogCategory, CatalogGradientConfig, CatalogMaskPoint } from '@/domain/entities/catalogo'
import type { CatalogFormState } from './catalogo-personalizacion.utils'
import { BouquetMaskEditor } from './bouquet-mask-editor'
import styles from './catalogo-item-form.module.css'

interface CatalogoItemFormProps {
  mode: 'bouquet' | 'flor'
  categories: CatalogCategory[]
  formState: CatalogFormState
  isSaving: boolean
  isEditing: boolean
  onFieldChange: (field: keyof CatalogFormState, value: string | boolean) => void
  onRenderFieldChange: (field: keyof CatalogFormState['renderConfig'], value: string) => void
  onPointsChange: (points: CatalogMaskPoint[]) => void
  onGradientChange: (field: keyof CatalogGradientConfig, value: string) => void
  onFileChange: (file: File | null) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

export function CatalogoItemForm({
  mode,
  categories,
  formState,
  isSaving,
  isEditing,
  onFieldChange,
  onRenderFieldChange,
  onPointsChange,
  onGradientChange,
  onFileChange,
  onSubmit,
  onReset,
}: CatalogoItemFormProps) {
  return (
    <form className={styles.formShell} onSubmit={onSubmit}>
      <div className={styles.formHeader}>
        <div>
          <span className={styles.eyebrow}>{mode === 'bouquet' ? 'Bouquets' : 'Flores'}</span>
          <h3 className={styles.title}>{isEditing ? 'Editar registro' : `Nuevo ${mode === 'bouquet' ? 'bouquet' : 'flor'}`}</h3>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          {isEditing ? 'Crear nuevo' : 'Limpiar'}
        </button>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Nombre</span>
          <input value={formState.nombre} onChange={(event) => onFieldChange('nombre', event.target.value)} required />
        </label>

        <label className={styles.field}>
          <span>Precio</span>
          <input type="number" step="0.01" min="0" value={formState.precioUnitario} onChange={(event) => onFieldChange('precioUnitario', event.target.value)} required />
        </label>

        <label className={styles.field}>
          <span>Stock</span>
          <input type="number" min="0" value={formState.cantidad} onChange={(event) => onFieldChange('cantidad', event.target.value)} required />
        </label>

        <label className={styles.field}>
          <span>Estado</span>
          <select value={formState.estado} onChange={(event) => onFieldChange('estado', event.target.value)}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Categoria del producto</span>
          <select value={formState.categoriaId} onChange={(event) => onFieldChange('categoriaId', event.target.value)}>
            <option value="">Sin categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Color acento</span>
          <input value={formState.accentColor} onChange={(event) => onFieldChange('accentColor', event.target.value)} />
        </label>
      </div>

      <label className={`${styles.field} ${styles.fieldFull}`}>
        <span>Descripcion</span>
        <textarea value={formState.descripcion} onChange={(event) => onFieldChange('descripcion', event.target.value)} rows={4} />
      </label>

      <div className={styles.fileRow}>
        <label className={styles.uploadField}>
          <span>Imagen</span>
          <input type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
        </label>

        {formState.imagePreview ? (
          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={formState.removeImage}
              onChange={(event) => onFieldChange('removeImage', event.target.checked)}
            />
            <span>Quitar imagen actual al guardar</span>
          </label>
        ) : null}
      </div>

      {mode === 'bouquet' ? (
        <>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Subtitulo</span>
              <input value={formState.subtitulo} onChange={(event) => onFieldChange('subtitulo', event.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Badge</span>
              <input value={formState.badge} onChange={(event) => onFieldChange('badge', event.target.value)} />
            </label>
          </div>

          <BouquetMaskEditor
            imageSrc={formState.removeImage ? '' : formState.imagePreview}
            accentColor={formState.accentColor}
            points={formState.composition.points}
            gradient={formState.composition.gradient}
            onPointsChange={onPointsChange}
            onGradientChange={onGradientChange}
          />
        </>
      ) : (
        <>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Tono</span>
              <input value={formState.tone} onChange={(event) => onFieldChange('tone', event.target.value)} />
            </label>

            <label className={styles.field}>
              <span>Categoria visual</span>
              <select value={formState.categoryLabel} onChange={(event) => onFieldChange('categoryLabel', event.target.value)}>
                <option value="Flor focal">Flor focal</option>
                <option value="Relleno">Relleno</option>
                <option value="Follaje">Follaje</option>
              </select>
            </label>
          </div>

          <div className={styles.renderGrid}>
            <label className={styles.field}>
              <span>Ancho %</span>
              <input type="number" step="0.1" value={formState.renderConfig.widthPercent} onChange={(event) => onRenderFieldChange('widthPercent', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Max width</span>
              <input type="number" step="1" value={formState.renderConfig.maxWidth} onChange={(event) => onRenderFieldChange('maxWidth', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Offset base</span>
              <input type="number" step="0.1" value={formState.renderConfig.bottomOffset} onChange={(event) => onRenderFieldChange('bottomOffset', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Rotacion</span>
              <input type="number" step="0.1" value={formState.renderConfig.rotateJitter} onChange={(event) => onRenderFieldChange('rotateJitter', event.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Prioridad</span>
              <input type="number" step="1" value={formState.renderConfig.priority} onChange={(event) => onRenderFieldChange('priority', event.target.value)} />
            </label>
          </div>
        </>
      )}

      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton} disabled={isSaving}>
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear registro'}
        </button>
      </div>
    </form>
  )
}
