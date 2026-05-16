'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/adapters/ui/navbar'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { bouquetOptions, flowerCatalog } from './personalizacion-bouquets.data'
import { BouquetPreview } from './components/bouquet-preview'
import { BouquetTypeSelector } from './components/bouquet-type-selector'
import { FlowerCatalogPanel } from './components/flower-catalog-panel'
import { groupFlowersByInitial, mapSelectedFlowers, normalizeBouquetSearch } from './personalizacion-bouquets.utils'
import styles from './personalizacion-bouquets-page.module.css'

const auth = createAuthUseCases(djangoAuthAdapter)

export default function PersonalizacionBouquetsPage() {
  const router = useRouter()
  const [selectedBouquetId, setSelectedBouquetId] = useState(bouquetOptions[0].id)
  const [searchValue, setSearchValue] = useState('')
  const [selectedFlowers, setSelectedFlowers] = useState<Record<string, number>>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    let isMounted = true

    window.dispatchEvent(new Event('alesli-rose-background-start'))

    auth.getCurrentUser()
      .then(() => {
        if (isMounted) {
          setIsLoggedIn(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoggedIn(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const selectedBouquet = bouquetOptions.find((option) => option.id === selectedBouquetId) ?? bouquetOptions[0]
  const normalizedSearch = normalizeBouquetSearch(searchValue)
  const filteredFlowers = flowerCatalog.filter((flower) => {
    if (!normalizedSearch) {
      return true
    }

    const searchableText = normalizeBouquetSearch(`${flower.name} ${flower.category} ${flower.tone} ${flower.note}`)
    return searchableText.includes(normalizedSearch)
  })

  const groupedFlowers = groupFlowersByInitial(filteredFlowers)
  const visibleLetters = Object.keys(groupedFlowers)
  const selectedFlowerItems = mapSelectedFlowers(flowerCatalog, selectedFlowers)
  const totalSelectedFlowers = selectedFlowerItems.reduce((accumulator, flower) => accumulator + flower.quantity, 0)

  const handleAddFlower = (flowerId: string) => {
    setSelectedFlowers((currentSelection) => ({
      ...currentSelection,
      [flowerId]: (currentSelection[flowerId] ?? 0) + 1,
    }))
  }

  const handleRemoveFlower = (flowerId: string) => {
    setSelectedFlowers((currentSelection) => {
      const currentQuantity = currentSelection[flowerId] ?? 0

      if (currentQuantity <= 1) {
        const { [flowerId]: omittedFlower, ...remainingFlowers } = currentSelection
        void omittedFlower
        return remainingFlowers
      }

      return {
        ...currentSelection,
        [flowerId]: currentQuantity - 1,
      }
    })
  }

  const handleClearSelection = () => {
    setSelectedFlowers({})
  }

  const handleLogout = async () => {
    await auth.logout()
    router.push('/login')
  }

  return (
    <div className={styles.pageShell}>
      <Navbar isLoggedIn={isLoggedIn} cartCount={0} onLogout={handleLogout} />

      <main className={styles.pageContent}>
        <section className={styles.heroPanel}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Personalizacion de bouquets</span>
            <h1 className={styles.title}>Hazlo tu mismo</h1>
            <p className={styles.description}>
              Elige tu envoltura base, busca flores por nombre y recorre el catalogo por letras para construir
              una combinacion a tu medida sin salir del estilo Alesli.
            </p>
          </div>

          <div className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Bouquets base</span>
              <strong className={styles.statValue}>{bouquetOptions.length}</strong>
              <span className={styles.statCaption}>Dos envolturas listas para empezar</span>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Catalogo floral</span>
              <strong className={styles.statValue}>{flowerCatalog.length}</strong>
              <span className={styles.statCaption}>Busqueda por nombre y orden alfabetico</span>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Tu seleccion</span>
              <strong className={styles.statValue}>{totalSelectedFlowers}</strong>
              <span className={styles.statCaption}>Tallos elegidos hasta ahora</span>
            </article>
          </div>
        </section>

        <section className={styles.workspace}>
          <div className={styles.previewColumn}>
            <BouquetTypeSelector
              options={bouquetOptions}
              selectedBouquetId={selectedBouquet.id}
              onSelectBouquet={setSelectedBouquetId}
            />

            <BouquetPreview
              bouquet={selectedBouquet}
              selectedFlowers={selectedFlowerItems}
              totalSelectedFlowers={totalSelectedFlowers}
              onAddFlower={handleAddFlower}
              onRemoveFlower={handleRemoveFlower}
              onClearSelection={handleClearSelection}
            />
          </div>

          <div className={styles.catalogColumn}>
            <FlowerCatalogPanel
              groupedFlowers={groupedFlowers}
              searchValue={searchValue}
              letters={visibleLetters}
              quantities={selectedFlowers}
              visibleFlowerCount={filteredFlowers.length}
              onSearchChange={setSearchValue}
              onAddFlower={handleAddFlower}
              onRemoveFlower={handleRemoveFlower}
            />
          </div>
        </section>
      </main>
    </div>
  )
}