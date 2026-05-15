'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  BouquetDragBounds,
  BouquetFlowerPlacement,
  BouquetFlowerTransform,
} from './personalizacion-bouquets.types'

type EditorMode = 'drag' | 'rotate'

interface InteractionState {
  key: string
  mode: EditorMode
  pointerId: number
  startX: number
  startY: number
  initialX: number
  initialBottom: number
  initialRotate: number
}

export interface EditableBouquetFlowerPlacement extends BouquetFlowerPlacement {
  flipped: boolean
}

interface UseBouquetEditorArgs {
  bouquetId: string
  placements: BouquetFlowerPlacement[]
  dragBounds: BouquetDragBounds
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export function useBouquetEditor({ bouquetId, placements, dragBounds }: UseBouquetEditorArgs) {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const interactionRef = useRef<InteractionState | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, BouquetFlowerTransform>>({})

  const placementMap = useMemo(() => (
    placements.reduce<Record<string, BouquetFlowerPlacement>>((accumulator, placement) => {
      accumulator[placement.key] = placement
      return accumulator
    }, {})
  ), [placements])

  useEffect(() => {
    setOverrides({})
    setSelectedKey(null)
  }, [bouquetId])

  useEffect(() => {
    setOverrides((currentOverrides) => {
      const nextOverrides = placements.reduce<Record<string, BouquetFlowerTransform>>((accumulator, placement) => {
        const currentOverride = currentOverrides[placement.key]

        accumulator[placement.key] = currentOverride
          ? {
              ...currentOverride,
              x: clamp(currentOverride.x, dragBounds.minX, dragBounds.maxX),
              bottom: clamp(currentOverride.bottom, dragBounds.minBottom, dragBounds.maxBottom),
            }
          : {
              x: placement.x,
              bottom: placement.bottom,
              rotate: placement.rotate,
              flipped: false,
            }

        return accumulator
      }, {})

      return nextOverrides
    })

    setSelectedKey((currentSelectedKey) => (currentSelectedKey && placementMap[currentSelectedKey] ? currentSelectedKey : null))
  }, [placements, placementMap, dragBounds])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const interaction = interactionRef.current
      const canvas = canvasRef.current

      if (!interaction || !canvas || interaction.pointerId !== event.pointerId) {
        return
      }

      const canvasRect = canvas.getBoundingClientRect()

      if (interaction.mode === 'drag') {
        const deltaXPercent = ((event.clientX - interaction.startX) / canvasRect.width) * 100
        const deltaBottomPercent = ((interaction.startY - event.clientY) / canvasRect.height) * 100

        setOverrides((currentOverrides) => ({
          ...currentOverrides,
          [interaction.key]: {
            ...currentOverrides[interaction.key],
            x: clamp(interaction.initialX + deltaXPercent, dragBounds.minX, dragBounds.maxX),
            bottom: clamp(interaction.initialBottom + deltaBottomPercent, dragBounds.minBottom, dragBounds.maxBottom),
          },
        }))
      }

      if (interaction.mode === 'rotate') {
        const deltaRotation = (event.clientX - interaction.startX) * 0.32

        setOverrides((currentOverrides) => ({
          ...currentOverrides,
          [interaction.key]: {
            ...currentOverrides[interaction.key],
            rotate: clamp(interaction.initialRotate + deltaRotation, -85, 85),
          },
        }))
      }
    }

    const finishInteraction = (event: PointerEvent) => {
      if (interactionRef.current?.pointerId === event.pointerId) {
        interactionRef.current = null
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', finishInteraction)
    window.addEventListener('pointercancel', finishInteraction)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', finishInteraction)
      window.removeEventListener('pointercancel', finishInteraction)
    }
  }, [dragBounds])

  const editablePlacements = useMemo<EditableBouquetFlowerPlacement[]>(() => (
    placements.map((placement) => {
      const override = overrides[placement.key]

      return {
        ...placement,
        x: override?.x ?? placement.x,
        bottom: override?.bottom ?? placement.bottom,
        rotate: override?.rotate ?? placement.rotate,
        flipped: override?.flipped ?? false,
        zIndex: placement.zIndex + (placement.key === selectedKey ? 100 : 0),
      }
    })
  ), [placements, overrides, selectedKey])

  const selectedPlacement = selectedKey
    ? editablePlacements.find((placement) => placement.key === selectedKey) ?? null
    : null

  const beginDrag = (pointerId: number, key: string, startX: number, startY: number) => {
    const placement = editablePlacements.find((item) => item.key === key)

    if (!placement) {
      return
    }

    interactionRef.current = {
      key,
      mode: 'drag',
      pointerId,
      startX,
      startY,
      initialX: placement.x,
      initialBottom: placement.bottom,
      initialRotate: placement.rotate,
    }
  }

  const beginRotate = (pointerId: number, key: string, startX: number, startY: number) => {
    const placement = editablePlacements.find((item) => item.key === key)

    if (!placement) {
      return
    }

    interactionRef.current = {
      key,
      mode: 'rotate',
      pointerId,
      startX,
      startY,
      initialX: placement.x,
      initialBottom: placement.bottom,
      initialRotate: placement.rotate,
    }
  }

  const handleFlowerPointerDown = (event: React.PointerEvent<HTMLDivElement>, key: string) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedKey(key)
    beginDrag(event.pointerId, key, event.clientX, event.clientY)
  }

  const handleRotateHandlePointerDown = (event: React.PointerEvent<HTMLButtonElement>, key: string) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedKey(key)
    beginRotate(event.pointerId, key, event.clientX, event.clientY)
  }

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setSelectedKey(null)
    }
  }

  const updateSelectedTransform = (updater: (currentTransform: BouquetFlowerTransform) => BouquetFlowerTransform) => {
    if (!selectedKey) {
      return
    }

    const basePlacement = placementMap[selectedKey]

    if (!basePlacement) {
      return
    }

    setOverrides((currentOverrides) => {
      const currentTransform = currentOverrides[selectedKey] ?? {
        x: basePlacement.x,
        bottom: basePlacement.bottom,
        rotate: basePlacement.rotate,
        flipped: false,
      }

      return {
        ...currentOverrides,
        [selectedKey]: updater(currentTransform),
      }
    })
  }

  const rotateSelectedFlower = (delta: number) => {
    updateSelectedTransform((currentTransform) => ({
      ...currentTransform,
      rotate: clamp(currentTransform.rotate + delta, -85, 85),
    }))
  }

  const flipSelectedFlower = () => {
    updateSelectedTransform((currentTransform) => ({
      ...currentTransform,
      flipped: !currentTransform.flipped,
    }))
  }

  const resetSelectedFlower = () => {
    if (!selectedKey) {
      return
    }

    const basePlacement = placementMap[selectedKey]

    if (!basePlacement) {
      return
    }

    setOverrides((currentOverrides) => ({
      ...currentOverrides,
      [selectedKey]: {
        x: basePlacement.x,
        bottom: basePlacement.bottom,
        rotate: basePlacement.rotate,
        flipped: false,
      },
    }))
  }

  return {
    canvasRef,
    editablePlacements,
    selectedPlacement,
    selectedKey,
    handleCanvasPointerDown,
    handleFlowerPointerDown,
    handleRotateHandlePointerDown,
    rotateSelectedFlower,
    flipSelectedFlower,
    resetSelectedFlower,
  }
}