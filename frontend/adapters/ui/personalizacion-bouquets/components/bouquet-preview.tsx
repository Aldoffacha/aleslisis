import Image from 'next/image'
import type { BouquetOption, SelectedFlowerItem } from '../personalizacion-bouquets.types'
import { buildBouquetComposition } from '../personalizacion-bouquets.composition'
import { BouquetComposition } from './bouquet-composition'
import styles from './bouquet-preview.module.css'

interface BouquetPreviewProps {
  bouquet: BouquetOption
  selectedFlowers: SelectedFlowerItem[]
  totalSelectedFlowers: number
  onAddFlower: (flowerId: string) => void
  onRemoveFlower: (flowerId: string) => void
  onClearSelection: () => void
}

export function BouquetPreview({
  bouquet,
  selectedFlowers,
  totalSelectedFlowers,
  onAddFlower,
  onRemoveFlower,
  onClearSelection,
}: BouquetPreviewProps) {
  const composition = buildBouquetComposition(bouquet, selectedFlowers)

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Paso 2</span>
          <h2 className={styles.title}>Vista previa del bouquet</h2>
        </div>
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearSelection}
          disabled={selectedFlowers.length === 0}
        >
          Limpiar seleccion
        </button>
      </div>

      <div className={styles.previewLayout}>
        <div className={styles.visualColumn}>
          <div className={styles.metaBadge} style={{ borderColor: `${bouquet.accentColor}33` }}>
            <span className={styles.metaLabel}>Base activa</span>
            <strong className={styles.metaValue} style={{ color: bouquet.accentColor }}>
              {bouquet.title}
            </strong>
          </div>

          <div className={styles.visualStage}>
            <div className={styles.visualGlow} />
            <BouquetComposition
              bouquet={bouquet}
              placements={composition.placements}
              hiddenCount={composition.hiddenCount}
            />
          </div>
        </div>

        <div className={styles.summaryPanel}>
          <div className={styles.summaryHeader}>
            <div>
              <span className={styles.summaryEyebrow}>{bouquet.badge}</span>
              <h3 className={styles.summaryTitle}>{bouquet.subtitle}</h3>
            </div>
            <div className={styles.selectionCounter}>
              <span className={styles.selectionCounterLabel}>Tallos</span>
              <strong className={styles.selectionCounterValue}>{totalSelectedFlowers}</strong>
            </div>
          </div>

          <p className={styles.summaryDescription}>{bouquet.description}</p>
          <p className={styles.summaryHint}>
            El acomodo se hace automaticamente dentro del bouquet usando posiciones seguras para evitar solapes.
          </p>

          {selectedFlowers.length > 0 ? (
            <ul className={styles.selectionList}>
              {selectedFlowers.map((flower) => (
                <li key={flower.id} className={styles.selectionItem}>
                  <div className={styles.selectionInfo}>
                    <span className={styles.selectionDot} style={{ backgroundColor: flower.accentColor }} />
                    <div>
                      <strong className={styles.selectionName}>{flower.name}</strong>
                      <span className={styles.selectionNote}>{flower.category} · {flower.tone}</span>
                    </div>
                  </div>

                  <div className={styles.selectionActions}>
                    <button
                      type="button"
                      className={styles.quantityButton}
                      onClick={() => onRemoveFlower(flower.id)}
                      aria-label={`Quitar una unidad de ${flower.name}`}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{flower.quantity}</span>
                    <button
                      type="button"
                      className={styles.quantityButton}
                      onClick={() => onAddFlower(flower.id)}
                      aria-label={`Agregar una unidad de ${flower.name}`}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyTitle}>Tu bouquet todavia esta vacio</span>
              <p className={styles.emptyDescription}>
                Agrega flores desde el catalogo para ver la seleccion activa de tallos y construir tu combinacion.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}