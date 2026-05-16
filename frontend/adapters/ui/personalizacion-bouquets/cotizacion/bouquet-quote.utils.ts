import type { BouquetOption, SelectedFlowerItem } from '../personalizacion-bouquets.types'
import type { BouquetQuoteLineItem, BouquetQuoteSummary } from './bouquet-quote.types'

const currencyFormatter = new Intl.NumberFormat('es-BO', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function parseQuotePrice(value: string): number {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return 0
  }

  const sanitizedValue = trimmedValue.replace(/[^\d,.-]/g, '')

  let normalizedValue = sanitizedValue
  if (sanitizedValue.includes(',') && sanitizedValue.includes('.')) {
    normalizedValue = sanitizedValue.replace(/\./g, '').replace(',', '.')
  } else if (sanitizedValue.includes(',')) {
    normalizedValue = sanitizedValue.replace(',', '.')
  }

  const parsedValue = Number(normalizedValue)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

export function formatQuoteCurrency(value: number): string {
  return `Bs. ${currencyFormatter.format(value)}`
}

export function buildBouquetQuoteSummary(
  bouquet: BouquetOption,
  selectedFlowers: SelectedFlowerItem[],
): BouquetQuoteSummary {
  const bouquetUnitPrice = parseQuotePrice(bouquet.price)
  const baseItem: BouquetQuoteLineItem = {
    id: bouquet.id,
    kind: 'bouquet',
    title: bouquet.title,
    detail: bouquet.subtitle || 'Bouquet base seleccionado',
    quantity: 1,
    unitPrice: bouquetUnitPrice,
    subtotal: bouquetUnitPrice,
    accentColor: bouquet.accentColor,
  }

  const flowerItems = selectedFlowers.map<BouquetQuoteLineItem>((flower) => {
    const unitPrice = parseQuotePrice(flower.price)
    return {
      id: flower.id,
      kind: 'flower',
      title: flower.name,
      detail: `${flower.category} · ${flower.tone}`,
      quantity: flower.quantity,
      unitPrice,
      subtotal: unitPrice * flower.quantity,
      accentColor: flower.accentColor,
    }
  })

  const subtotalFlowers = flowerItems.reduce((accumulator, item) => accumulator + item.subtotal, 0)

  return {
    bouquet,
    baseItem,
    flowerItems,
    allItems: [baseItem, ...flowerItems],
    totalVarieties: flowerItems.length,
    totalUnits: flowerItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
    subtotalFlowers,
    total: baseItem.subtotal + subtotalFlowers,
  }
}