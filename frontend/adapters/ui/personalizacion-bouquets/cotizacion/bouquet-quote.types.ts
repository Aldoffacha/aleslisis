import type { BouquetOption } from '../personalizacion-bouquets.types'

export type BouquetQuoteItemKind = 'bouquet' | 'flower'

export interface BouquetQuoteLineItem {
  id: string
  kind: BouquetQuoteItemKind
  title: string
  detail: string
  quantity: number
  unitPrice: number
  subtotal: number
  accentColor: string
}

export interface BouquetQuoteSummary {
  bouquet: BouquetOption
  baseItem: BouquetQuoteLineItem
  flowerItems: BouquetQuoteLineItem[]
  allItems: BouquetQuoteLineItem[]
  totalVarieties: number
  totalUnits: number
  subtotalFlowers: number
  total: number
}