'use client'

import type { AdminSortOrder } from '@/domain/entities/usuarios-admin'
import styles from './usuarios-toolbar.module.css'

interface UsuariosToolbarProps {
  title: string
  description: string
  draftQuery: string
  sort: AdminSortOrder
  activeLetter: string
  availableLetters: string[]
  totalItems: number
  onDraftQueryChange: (value: string) => void
  onApplySearch: () => void
  onLetterChange: (letter: string) => void
  onSortChange: (sort: AdminSortOrder) => void
}

export function UsuariosToolbar({
  title,
  description,
  draftQuery,
  sort,
  activeLetter,
  availableLetters,
  totalItems,
  onDraftQueryChange,
  onApplySearch,
  onLetterChange,
  onSortChange,
}: UsuariosToolbarProps) {
  return (
    <section className={styles.toolbarShell}>
      <div className={styles.toolbarHeader}>
        <div>
          <span className={styles.eyebrow}>Busqueda y orden</span>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.controlsRow}>
        <label className={styles.searchField}>
          <span>Buscar por nombre, CI o correo</span>
          <div className={styles.searchInputRow}>
            <input
              type="search"
              value={draftQuery}
              onChange={(event) => onDraftQueryChange(event.target.value)}
              placeholder="Ej. Maria, 1234567 o correo@dominio.com"
            />
            <button type="button" className={styles.primaryButton} onClick={onApplySearch}>
              Buscar
            </button>
          </div>
        </label>

        <label className={styles.sortField}>
          <span>Orden alfabetico</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value as AdminSortOrder)}>
            <option value="asc">A a Z</option>
            <option value="desc">Z a A</option>
          </select>
        </label>
      </div>

      <div className={styles.letterRow}>
        <button
          type="button"
          className={`${styles.letterButton} ${activeLetter === '' ? styles.letterButtonActive : ''}`}
          onClick={() => onLetterChange('')}
        >
          Todas
        </button>
        {availableLetters.map((letter) => (
          <button
            key={letter}
            type="button"
            className={`${styles.letterButton} ${activeLetter === letter ? styles.letterButtonActive : ''}`}
            onClick={() => onLetterChange(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className={styles.resultsMeta}>
        <span>{totalItems} registros encontrados</span>
      </div>
    </section>
  )
}
