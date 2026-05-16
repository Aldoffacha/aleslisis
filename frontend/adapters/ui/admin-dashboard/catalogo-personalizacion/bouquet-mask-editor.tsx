'use client'

import { useEffect, useRef } from 'react'
import type { CatalogGradientConfig, CatalogMaskPoint } from '@/domain/entities/catalogo'
import { pointsToClipPath } from './catalogo-personalizacion.utils'
import styles from './bouquet-mask-editor.module.css'

interface BouquetMaskEditorProps {
  imageSrc: string
  accentColor: string
  points: CatalogMaskPoint[]
  gradient: {
    from: string
    to: string
    angle: string
  }
  onPointsChange: (points: CatalogMaskPoint[]) => void
  onGradientChange: (field: keyof CatalogGradientConfig, value: string) => void
}

export function BouquetMaskEditor({
  imageSrc,
  accentColor,
  points,
  gradient,
  onPointsChange,
  onGradientChange,
}: BouquetMaskEditorProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragIndexRef = useRef<number | null>(null)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (dragIndexRef.current === null || !stageRef.current) {
        return
      }

      const rect = stageRef.current.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      onPointsChange(
        points.map((point, index) => (
          index === dragIndexRef.current
            ? { x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) }
            : point
        ))
      )
    }

    const handlePointerUp = () => {
      dragIndexRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [onPointsChange, points])

  const handleStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || event.target !== event.currentTarget) {
      return
    }

    const rect = stageRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    onPointsChange([...points, { x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) }])
  }

  const handlePointPointerDown = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    dragIndexRef.current = index
  }

  const handleRemoveLastPoint = () => {
    onPointsChange(points.slice(0, -1))
  }

  const clipPath = pointsToClipPath(points)
  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className={styles.editorShell}>
      <div
        ref={stageRef}
        className={styles.stage}
        onClick={handleStageClick}
        style={{ ['--accent-color' as string]: accentColor }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="Vista previa del bouquet" className={styles.previewImage} />
        ) : (
          <div className={styles.emptyStage}>
            <strong>Sube la imagen del bouquet</strong>
            <span>Luego haz clic sobre la imagen para dibujar la mascara del area interna.</span>
          </div>
        )}

        {points.length >= 3 ? (
          <div
            className={styles.gradientOverlay}
            style={{
              clipPath,
              background: `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})`,
            }}
          />
        ) : null}

        <svg className={styles.overlaySvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {points.length >= 3 ? <polygon points={polygonPoints} className={styles.maskPolygon} /> : null}
          {points.length >= 2 ? <polyline points={polygonPoints} className={styles.maskPolyline} /> : null}
        </svg>

        {points.map((point, index) => (
          <button
            key={`${point.x}-${point.y}-${index}`}
            type="button"
            className={styles.pointHandle}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onPointerDown={(event) => handlePointPointerDown(event, index)}
            aria-label={`Punto ${index + 1} de la mascara`}
          >
            <span>{index + 1}</span>
          </button>
        ))}
      </div>

      <div className={styles.editorToolbar}>
        <div className={styles.toolbarCopy}>
          <strong>Mascara visual del bouquet</strong>
          <span>Dibuja con clics, arrastra los puntos y usa el degradado para dar profundidad al interior.</span>
        </div>

        <div className={styles.toolbarActions}>
          <button type="button" className={styles.secondaryButton} onClick={handleRemoveLastPoint} disabled={points.length === 0}>
            Quitar ultimo punto
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => onPointsChange([])} disabled={points.length === 0}>
            Limpiar mascara
          </button>
        </div>
      </div>

      <div className={styles.gradientGrid}>
        <label className={styles.field}>
          <span>Color superior</span>
          <input type="text" value={gradient.from} onChange={(event) => onGradientChange('from', event.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Color inferior</span>
          <input type="text" value={gradient.to} onChange={(event) => onGradientChange('to', event.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Angulo</span>
          <input type="number" value={gradient.angle} onChange={(event) => onGradientChange('angle', event.target.value)} />
        </label>
      </div>
    </div>
  )
}
