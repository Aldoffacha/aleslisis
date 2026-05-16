import { FlowerCard } from './flower-card'
import type { FlowerCatalogItem } from '../personalizacion-bouquets.types'
import styles from './flower-catalog-panel.module.css'

interface FlowerCatalogPanelProps {
  groupedFlowers: Record<string, FlowerCatalogItem[]>
  searchValue: string
  letters: string[]
  quantities: Record<string, number>
  visibleFlowerCount: number
  onSearchChange: (searchValue: string) => void
  onAddFlower: (flowerId: string) => void
  onRemoveFlower: (flowerId: string) => void
}

export function FlowerCatalogPanel({
  groupedFlowers,
  searchValue,
  letters,
  quantities,
  visibleFlowerCount,
  onSearchChange,
  onAddFlower,
  onRemoveFlower,
}: FlowerCatalogPanelProps) {
  const handleScrollToLetter = (letter: string) => {
    document.getElementById(`catalogo-letra-${letter}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Paso 3</span>
          <h2 className={styles.title}>Flores por nombre y letra</h2>
        </div>
        <div className={styles.counterBox}>
          <span className={styles.counterLabel}>Visibles</span>
          <strong className={styles.counterValue}>{visibleFlowerCount}</strong>
        </div>
      </div>

      <label className={styles.searchField}>
        <span className={styles.searchLabel}>Buscar flor</span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Ej. peonia, rosa, tulipan"
          className={styles.searchInput}
        />
      </label>

      {letters.length > 0 && (
        <div className={styles.letterRow}>
          {letters.map((letter) => (
            <button
              key={letter}
              type="button"
              className={styles.letterButton}
              onClick={() => handleScrollToLetter(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      <div className={styles.catalogBody}>
        {letters.length > 0 ? (
          letters.map((letter) => (
            <section key={letter} id={`catalogo-letra-${letter}`} className={styles.letterSection}>
              <div className={styles.letterHeader}>
                <h3 className={styles.letterTitle}>{letter}</h3>
                <span className={styles.letterCount}>{groupedFlowers[letter].length} flores</span>
              </div>

              <div className={styles.groupGrid}>
                {groupedFlowers[letter].map((flower) => (
                  <FlowerCard
                    key={flower.id}
                    flower={flower}
                    quantity={quantities[flower.id] ?? 0}
                    onAddFlower={onAddFlower}
                    onRemoveFlower={onRemoveFlower}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className={styles.emptySearchState}>
            <span className={styles.emptySearchTitle}>No hay coincidencias con esa busqueda</span>
            <p className={styles.emptySearchDescription}>Prueba con otro nombre o borra el filtro para ver todo el catalogo.</p>
          </div>
        )}
      </div>
    </section>
  )
}