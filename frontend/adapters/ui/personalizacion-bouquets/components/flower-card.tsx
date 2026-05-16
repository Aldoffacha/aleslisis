import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { FlowerCatalogItem } from '../personalizacion-bouquets.types'
import styles from './flower-card.module.css'

interface FlowerCardProps {
  flower: FlowerCatalogItem
  quantity: number
  onAddFlower: (flowerId: string) => void
  onRemoveFlower: (flowerId: string) => void
}

export function FlowerCard({ flower, quantity, onAddFlower, onRemoveFlower }: FlowerCardProps) {
  const accentStyle = { '--flower-accent': flower.accentColor } as CSSProperties

  return (
    <article className={`${styles.card} ${quantity > 0 ? styles.cardActive : ''}`}>
      <div className={styles.visual} style={accentStyle}>
        <div className={styles.imageFrame}>
          <Image
            src={flower.imageSrc}
            alt={flower.name}
            width={220}
            height={220}
            className={styles.flowerImage}
          />
        </div>
      </div>

      <div className={styles.content}>
        <span className={styles.category}>{flower.category}</span>
        <h3 className={styles.name}>{flower.name}</h3>
        <p className={styles.tone}>{flower.tone}</p>
        <p className={styles.note}>{flower.note}</p>
      </div>

      {quantity > 0 ? (
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={() => onRemoveFlower(flower.id)}
            aria-label={`Quitar una unidad de ${flower.name}`}
          >
            -
          </button>
          <span className={styles.stepperValue}>{quantity}</span>
          <button
            type="button"
            className={styles.stepperButton}
            onClick={() => onAddFlower(flower.id)}
            aria-label={`Agregar una unidad de ${flower.name}`}
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.addButton}
          onClick={() => onAddFlower(flower.id)}
        >
          Agregar
        </button>
      )}
    </article>
  )
}