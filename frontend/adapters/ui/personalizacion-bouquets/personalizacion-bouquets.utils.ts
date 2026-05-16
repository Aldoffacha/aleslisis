import type { FlowerCatalogItem, SelectedFlowerItem } from './personalizacion-bouquets.types'

export function normalizeBouquetSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function groupFlowersByInitial(flowers: FlowerCatalogItem[]): Record<string, FlowerCatalogItem[]> {
  const grouped: Record<string, FlowerCatalogItem[]> = {}

  for (const flower of flowers) {
    const initial = normalizeBouquetSearch(flower.name).charAt(0).toUpperCase() || '#'
    if (!grouped[initial]) {
      grouped[initial] = []
    }

    grouped[initial].push(flower)
  }

  return Object.keys(grouped)
    .sort((left, right) => left.localeCompare(right, 'es'))
    .reduce<Record<string, FlowerCatalogItem[]>>((sortedGroups, letter) => {
      sortedGroups[letter] = grouped[letter].sort((left, right) => left.name.localeCompare(right.name, 'es'))
      return sortedGroups
    }, {})
}

export function mapSelectedFlowers(
  catalog: FlowerCatalogItem[],
  selectedFlowers: Record<string, number>,
): SelectedFlowerItem[] {
  return catalog
    .filter((flower) => selectedFlowers[flower.id])
    .map((flower) => ({
      ...flower,
      quantity: selectedFlowers[flower.id],
    }))
    .sort((left, right) => left.name.localeCompare(right.name, 'es'))
}