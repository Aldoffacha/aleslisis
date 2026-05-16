'use client'

import Image from 'next/image'
import type { BouquetFlowerPlacement, BouquetMaskPoint, BouquetOption } from '../personalizacion-bouquets.types'
import { useBouquetEditor } from '../use-bouquet-editor'
import styles from './bouquet-composition.module.css'

interface BouquetCompositionProps {
  bouquet: BouquetOption
  placements: BouquetFlowerPlacement[]
  hiddenCount: number
}

function buildSoftMaskImage(points?: BouquetMaskPoint[]): string | null {
  if (!points?.length) {
    return null
  }

  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ')
  const maskSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="soft-edge" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <rect width="100" height="100" fill="black" />
      <polygon points="${polygonPoints}" fill="white" filter="url(#soft-edge)" />
    </svg>
  `

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}")`
}

export function BouquetComposition({ bouquet, placements, hiddenCount }: BouquetCompositionProps) {
  const gradient = bouquet.composition.gradient ?? {
    from: 'rgba(255,255,255,0.08)',
    to: 'rgba(122,53,53,0.34)',
    angle: 180,
  }
  const flowerMaskImage = buildSoftMaskImage(bouquet.composition.points)

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

        <div
          className={styles.flowersLayer}
          style={flowerMaskImage ? {
            WebkitMaskImage: flowerMaskImage,
            maskImage: flowerMaskImage,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          } : { clipPath: bouquet.composition.clipPath }}
        >
          {editablePlacements.map(renderFlowerPlacement)}
        </div>

        <div
          className={styles.gradientVeil}
          style={{
            clipPath: bouquet.composition.clipPath,
            background: `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})`,
          }}
        />

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