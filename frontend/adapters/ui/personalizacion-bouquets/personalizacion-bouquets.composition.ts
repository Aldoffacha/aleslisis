import type {
  BouquetCompositionResult,
  BouquetOption,
  BouquetPlacementSlot,
  SelectedFlowerItem,
} from './personalizacion-bouquets.types'

interface FlowerInstance {
  key: string
  flower: SelectedFlowerItem
  occurrence: number
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

function createFlowerInstances(selectedFlowers: SelectedFlowerItem[]): FlowerInstance[] {
  return selectedFlowers
    .flatMap((flower) => (
      Array.from({ length: flower.quantity }, (_, index) => ({
        key: `${flower.id}-${index}`,
        flower,
        occurrence: index,
      }))
    ))
    .sort((left, right) => {
      const priorityDifference = left.flower.render.priority - right.flower.render.priority

      if (priorityDifference !== 0) {
        return priorityDifference
      }

      return right.flower.render.widthPercent - left.flower.render.widthPercent
    })
}

function resolveHorizontalShift(slot: BouquetPlacementSlot, occurrence: number): number {
  if (occurrence === 0) {
    return 0
  }

  const direction = occurrence % 2 === 0 ? 1 : -1
  const step = Math.min(occurrence, 3) * 1.35
  return slot.scale * step * direction
}

function createAutoSlots(bouquet: BouquetOption): BouquetPlacementSlot[] {
  const rows = [1, 2, 3, 4, 4, 3, 2]
  const { minX, maxX, minBottom, maxBottom } = bouquet.composition.dragBounds
  const xRange = maxX - minX
  const bottomRange = Math.max(maxBottom - minBottom, 18)

  return rows.flatMap((itemsInRow, rowIndex) => {
    const progress = rows.length === 1 ? 0 : rowIndex / (rows.length - 1)
    const bottom = maxBottom - progress * bottomRange
    const scale = Math.max(0.58, 0.98 - rowIndex * 0.08)

    return Array.from({ length: itemsInRow }, (_, slotIndex) => {
      const offsetProgress = itemsInRow === 1 ? 0.5 : slotIndex / (itemsInRow - 1)

      return {
        x: minX + xRange * offsetProgress,
        bottom: Math.round(bottom),
        scale,
        rotate: Math.round((offsetProgress - 0.5) * 18),
        zIndex: 24 - rowIndex,
      }
    })
  })
}

export function buildBouquetComposition(
  bouquet: BouquetOption,
  selectedFlowers: SelectedFlowerItem[],
): BouquetCompositionResult {
  const slots = bouquet.composition.slots?.length ? bouquet.composition.slots : createAutoSlots(bouquet)
  const instances = createFlowerInstances(selectedFlowers)
  const visibleInstances = instances.slice(0, slots.length)

  return {
    placements: visibleInstances.map((instance, index) => {
      const slot = slots[index]
      const horizontalShift = resolveHorizontalShift(slot, instance.occurrence)
      const rotationDirection = instance.occurrence % 2 === 0 ? 1 : -1

      return {
        key: instance.key,
        flower: instance.flower,
        x: clamp(slot.x + horizontalShift, 16, 84),
        bottom: slot.bottom + instance.flower.render.bottomOffset,
        widthPercent: slot.scale * instance.flower.render.widthPercent,
        rotate: slot.rotate + rotationDirection * instance.flower.render.rotateJitter,
        zIndex: slot.zIndex + instance.flower.render.priority,
        maxWidth: Math.round(slot.scale * instance.flower.render.maxWidth),
      }
    }),
    hiddenCount: Math.max(0, instances.length - slots.length),
  }
}