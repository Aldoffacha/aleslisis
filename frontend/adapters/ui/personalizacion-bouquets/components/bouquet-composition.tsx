'use client'

import Image from 'next/image'
import type { BouquetFlowerPlacement, BouquetOption } from '../personalizacion-bouquets.types'
import { useBouquetEditor } from '../use-bouquet-editor'
import styles from './bouquet-composition.module.css'

interface BouquetCompositionProps {
  bouquet: BouquetOption
  placements: BouquetFlowerPlacement[]
  hiddenCount: number
}

export function BouquetComposition({ bouquet, placements, hiddenCount }: BouquetCompositionProps) {
  const {
    canvasRef,
    editablePlacements,
    selectedPlacement,
    selectedKey,
    handleCanvasPointerDown,
    handleFlowerPointerDown,
    rotateSelectedFlower,
    flipSelectedFlower,
    resetSelectedFlower,
  } = useBouquetEditor({
    bouquetId: bouquet.id,
    placements,
    dragBounds: bouquet.composition.dragBounds,
  })

  const renderFlowerPlacement = (placement: (typeof editablePlacements)[number]) => (
    <div
      key={placement.key}
      className={`${styles.flowerSlot} ${placement.key === selectedKey ? styles.flowerSlotSelected : ''}`}
      onPointerDown={(event) => handleFlowerPointerDown(event, placement.key)}
      style={{
        left: `${placement.x}%`,
        bottom: `${placement.bottom}%`,
        width: `${placement.widthPercent}%`,
        maxWidth: `${placement.maxWidth}px`,
        zIndex: placement.zIndex,
      }}
    >
      <div
        className={styles.flowerTransform}
        style={{ transform: `rotate(${placement.rotate}deg) scaleX(${placement.flipped ? -1 : 1})` }}
      >
        <Image
          src={placement.flower.imageSrc}
          alt={placement.flower.name}
          width={420}
          height={420}
          draggable={false}
          className={styles.flowerImage}
        />
      </div>
    </div>
  )

  return (
    <div className={styles.editorStage}>
      <div ref={canvasRef} className={styles.canvas} onPointerDown={handleCanvasPointerDown}>
        <Image
          src={bouquet.imageSrc}
          alt={bouquet.title}
          width={720}
          height={720}
          priority
          className={styles.bouquetImage}
        />

        <div className={styles.flowersLayer} style={{ clipPath: bouquet.composition.clipPath }}>
          {editablePlacements.map(renderFlowerPlacement)}
        </div>

        <div className={styles.depthShade} style={{ clipPath: bouquet.composition.clipPath }} />

        {editablePlacements.length === 0 && (
          <div className={styles.emptyOverlay}>
            <span className={styles.emptyTitle}>Selecciona flores para armar tu bouquet</span>
            <p className={styles.emptyDescription}>La composicion se ajusta automaticamente y luego puedes mover, girar e invertir cada flor dentro del bouquet.</p>
          </div>
        )}

        {hiddenCount > 0 && (
          <div className={styles.hiddenBadge}>+{hiddenCount} flores quedan fuera de vista hasta que amplie el layout</div>
        )}
      </div>

      {selectedPlacement && (
        <div className={styles.editorToolbar}>
          <div className={styles.editorCopy}>
            <span className={styles.editorEyebrow}>Editor activo</span>
            <strong className={styles.editorTitle}>{selectedPlacement.flower.name}</strong>
            <p className={styles.editorDescription}>Arrastra la flor, usa el aro superior para girarla y ajusta su orientacion aqui.</p>
          </div>
          <div className={styles.editorActions}>
            <button type="button" className={styles.editorButton} onClick={() => rotateSelectedFlower(-8)}>
              Girar -
            </button>
            <button type="button" className={styles.editorButton} onClick={() => rotateSelectedFlower(8)}>
              Girar +
            </button>
            <button type="button" className={styles.editorButton} onClick={flipSelectedFlower}>
              Invertir
            </button>
            <button type="button" className={styles.editorButton} onClick={resetSelectedFlower}>
              Reajustar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}