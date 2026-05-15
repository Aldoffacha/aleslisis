import Image from 'next/image'
import type { BouquetOption } from '../personalizacion-bouquets.types'
import styles from './bouquet-type-selector.module.css'

interface BouquetTypeSelectorProps {
  options: BouquetOption[]
  selectedBouquetId: string
  onSelectBouquet: (bouquetId: string) => void
}

export function BouquetTypeSelector({
  options,
  selectedBouquetId,
  onSelectBouquet,
}: BouquetTypeSelectorProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Paso 1</span>
          <h2 className={styles.title}>Tipo de bouquet</h2>
        </div>
        <p className={styles.description}>Escoge la envoltura que servira como base visual de tu arreglo.</p>
      </div>

      <div className={styles.optionGrid}>
        {options.map((option) => {
          const isActive = option.id === selectedBouquetId

          return (
            <button
              key={option.id}
              type="button"
              className={`${styles.optionCard} ${isActive ? styles.optionCardActive : ''}`}
              onClick={() => onSelectBouquet(option.id)}
            >
              <div className={styles.thumbnailWrap}>
                <Image
                  src={option.imageSrc}
                  alt={option.title}
                  width={140}
                  height={140}
                  className={styles.thumbnail}
                />
              </div>

              <div className={styles.optionBody}>
                <span className={styles.badge} style={{ color: option.accentColor }}>
                  {option.badge}
                </span>
                <h3 className={styles.optionTitle}>{option.title}</h3>
                <p className={styles.optionSubtitle}>{option.subtitle}</p>
                <p className={styles.optionDescription}>{option.description}</p>
              </div>

              <span className={`${styles.selectionState} ${isActive ? styles.selectionStateActive : ''}`}>
                {isActive ? 'Seleccionado' : 'Elegir'}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}