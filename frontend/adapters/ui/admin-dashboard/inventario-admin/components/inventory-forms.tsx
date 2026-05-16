'use client'

import { useEffect, useState } from 'react'
import type { InventoryCategoryItem, InventoryTypeInput, InventoryTypeItem } from '@/domain/entities/inventario-admin'
import type { InventoryCategoryFormState, InventoryProductFormState } from '../inventario-admin.utils'
import styles from './inventory-forms.module.css'

interface InventoryCategoryFormProps {
  formState: InventoryCategoryFormState
  linkedTypes: InventoryTypeItem[]
  selectedCategoryId: number | null
  isSaving: boolean
  isAddingType: boolean
  isEditing: boolean
  onFieldChange: (field: keyof InventoryCategoryFormState, value: string) => void
  onAddType: (payload: InventoryTypeInput) => Promise<void>
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

interface InventoryProductFormProps {
  categories: InventoryCategoryItem[]
  availableTypes: InventoryTypeItem[]
  formState: InventoryProductFormState
  isSaving: boolean
  isEditing: boolean
  onFieldChange: (field: keyof InventoryProductFormState, value: string | boolean) => void
  onFileChange: (file: File | null) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onReset: () => void
}

export function InventoryCategoryForm({
  formState,
  linkedTypes,
  selectedCategoryId,
  isSaving,
  isAddingType,
  isEditing,
  onFieldChange,
  onAddType,
  onSubmit,
  onReset,
}: InventoryCategoryFormProps) {
  const [typeName, setTypeName] = useState('')
  const [typeDescription, setTypeDescription] = useState('')

  useEffect(() => {
    setTypeName('')
    setTypeDescription('')
  }, [selectedCategoryId, isEditing])

  const handleAddType = async () => {
    const normalizedTypeName = typeName.trim()
    const normalizedTypeDescription = typeDescription.trim()

    if (!normalizedTypeName) {
      return
    }

    await onAddType({
      nombre: normalizedTypeName,
      descripcion: normalizedTypeDescription,
      estado: 'activo',
    })

    setTypeName('')
    setTypeDescription('')
  }

  return (
    <form className={styles.formShell} onSubmit={onSubmit}>
      <div className={styles.formHeader}>
        <div>
          <span className={styles.eyebrow}>Categorias</span>
          <h3 className={styles.title}>{isEditing ? 'Editar categoria' : 'Nueva categoria'}</h3>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          {isEditing ? 'Crear nueva' : 'Limpiar'}
        </button>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Nombre</span>
          <input value={formState.nombre} onChange={(event) => onFieldChange('nombre', event.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Estado</span>
          <select value={formState.estado} onChange={(event) => onFieldChange('estado', event.target.value)}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>Descripcion</span>
          <textarea value={formState.descripcion} onChange={(event) => onFieldChange('descripcion', event.target.value)} rows={4} />
        </label>
      </div>

      {isEditing ? (
        <div className={styles.linkedTypesBox}>
          <div className={styles.linkedTypesHeader}>
            <span className={styles.eyebrow}>Tipos enlazados</span>
            <strong>{linkedTypes.length} registrados</strong>
          </div>
          <div className={styles.linkedTypesList}>
            {linkedTypes.length > 0 ? (
              linkedTypes.map((inventoryType) => (
                <span
                  key={inventoryType.id}
                  className={`${styles.linkedTypeChip} ${inventoryType.estado.trim().toLowerCase() === 'activo' ? '' : styles.linkedTypeChipInactive}`.trim()}
                >
                  {inventoryType.nombre}
                </span>
              ))
            ) : (
              <span className={styles.linkedTypesEmpty}>Esta categoria todavia no tiene tipos enlazados.</span>
            )}
          </div>

          <div className={styles.typeComposer}>
            <div className={styles.typeComposerGrid}>
              <label className={styles.field}>
                <span>Nuevo tipo</span>
                <input
                  value={typeName}
                  onChange={(event) => setTypeName(event.target.value)}
                  placeholder="Rosa inglesa, papel doble faz, cinta satinada"
                />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>Descripcion del tipo</span>
                <textarea
                  value={typeDescription}
                  onChange={(event) => setTypeDescription(event.target.value)}
                  rows={3}
                  placeholder="Descripcion breve opcional para identificar este tipo"
                />
              </label>
            </div>

            <div className={styles.typeComposerActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => void handleAddType()}
                disabled={isAddingType || !typeName.trim()}
              >
                {isAddingType ? 'Añadiendo...' : 'Añadir tipo'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.actionRow}>
        <button type="submit" className={styles.primaryButton} disabled={isSaving}>
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar categoria' : 'Crear categoria'}
        </button>
      </div>
    </form>
  )
}

export function InventoryProductForm({
  categories,
  availableTypes,
  formState,
  isSaving,
  isEditing,
  onFieldChange,
  onFileChange,
  onSubmit,
  onReset,
}: InventoryProductFormProps) {
  const selectedTypeValue = formState.tipoItemId || (formState.tipoItem ? '__legacy__' : '')

  return (
    <form className={styles.formShell} onSubmit={onSubmit}>
      <div className={styles.formHeader}>
        <div>
          <span className={styles.eyebrow}>Productos</span>
          <h3 className={styles.title}>{isEditing ? 'Editar producto' : 'Nuevo producto'}</h3>
        </div>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          {isEditing ? 'Crear nuevo' : 'Limpiar'}
        </button>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Nombre</span>
          <input value={formState.nombre} onChange={(event) => onFieldChange('nombre', event.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Tipo de inventario</span>
          <select value={selectedTypeValue} onChange={(event) => onFieldChange('tipoItemId', event.target.value)} disabled={!formState.categoriaId}>
            <option value="">
              {!formState.categoriaId
                ? 'Selecciona primero una categoria'
                : availableTypes.length === 0
                  ? 'No hay tipos registrados para esta categoria'
                  : 'Selecciona un tipo'}
            </option>
            {!formState.tipoItemId && formState.tipoItem ? (
              <option value="__legacy__" disabled>
                Tipo actual no catalogado: {formState.tipoItem}
              </option>
            ) : null}
            {availableTypes.map((inventoryType) => (
              <option key={inventoryType.id} value={inventoryType.id}>{inventoryType.nombre}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Categoria</span>
          <select value={formState.categoriaId} onChange={(event) => onFieldChange('categoriaId', event.target.value)}>
            <option value="">Sin categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Estado</span>
          <select value={formState.estado} onChange={(event) => onFieldChange('estado', event.target.value)}>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Precio</span>
          <input type="text" value={formState.precioUnitario} onChange={(event) => onFieldChange('precioUnitario', event.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Cantidad</span>
          <input type="number" min="0" value={formState.cantidad} onChange={(event) => onFieldChange('cantidad', event.target.value)} required />
        </label>
        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span>Descripcion</span>
          <textarea value={formState.descripcion} onChange={(event) => onFieldChange('descripcion', event.target.value)} rows={4} />
        </label>
      </div>

      <div className={styles.uploadGrid}>
        <label className={styles.field}>
          <span>Imagen del producto</span>
          <input type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
        </label>

        <div className={styles.previewBox}>
          {formState.imagePreview ? (
            <img src={formState.imagePreview} alt="Vista previa del producto" className={styles.previewImage} />
          ) : (
            <span>Sin imagen cargada</span>
          )}
        </div>
      </div>

      {formState.imagePreview ? (
        <label className={styles.checkboxField}>
          <input type="checkbox" checked={formState.removeImage} onChange={(event) => onFieldChange('removeImage', event.target.checked)} />
          <span>Quitar imagen actual al guardar</span>
        </label>
      ) : null}

      <div className={styles.actionRow}>
        <button type="submit" className={styles.primaryButton} disabled={isSaving}>
          {isSaving ? 'Guardando...' : isEditing ? 'Guardar producto' : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}
