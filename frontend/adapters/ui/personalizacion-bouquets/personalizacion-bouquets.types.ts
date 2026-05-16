export interface BouquetOption {
  id: string
  title: string
  subtitle: string
  description: string
  badge: string
  imageSrc: string
  accentColor: string
  composition: BouquetRenderConfig
}

export interface BouquetPlacementSlot {
  x: number
  bottom: number
  scale: number
  rotate: number
  zIndex: number
}

export interface BouquetDragBounds {
  minX: number
  maxX: number
  minBottom: number
  maxBottom: number
}

export interface BouquetRenderConfig {
  slots: BouquetPlacementSlot[]
  clipPath: string
  dragBounds: BouquetDragBounds
}

export interface FlowerRenderConfig {
  widthPercent: number
  maxWidth: number
  bottomOffset: number
  rotateJitter: number
  priority: number
}

export interface FlowerCatalogItem {
  id: string
  name: string
  category: 'Flor focal' | 'Relleno' | 'Follaje'
  tone: string
  accentColor: string
  note: string
  imageSrc: string
  render: FlowerRenderConfig
}

export interface SelectedFlowerItem extends FlowerCatalogItem {
  quantity: number
}

export interface BouquetFlowerPlacement {
  key: string
  flower: FlowerCatalogItem
  x: number
  bottom: number
  widthPercent: number
  rotate: number
  zIndex: number
  maxWidth: number
}

export interface BouquetCompositionResult {
  placements: BouquetFlowerPlacement[]
  hiddenCount: number
}

export interface BouquetFlowerTransform {
  x: number
  bottom: number
  rotate: number
  flipped: boolean
}