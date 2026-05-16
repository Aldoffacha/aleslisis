'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { catalogoAdapter } from '@/adapters/api/catalogo-adapter'
import Navbar from '@/adapters/ui/navbar'
import { djangoAuthAdapter } from '@/adapters/api/auth-adapter'
import { createAuthUseCases } from '@/domain/use-cases/auth'
import { BouquetPreview } from './components/bouquet-preview'
import { BouquetTypeSelector } from './components/bouquet-type-selector'
import { FlowerCatalogPanel } from './components/flower-catalog-panel'
import { mapCatalogoPublicoToPersonalizacion } from './personalizacion-bouquets.catalog'
import { groupFlowersByInitial, mapSelectedFlowers, normalizeBouquetSearch } from './personalizacion-bouquets.utils'
import styles from './personalizacion-bouquets-page.module.css'

const auth = createAuthUseCases(djangoAuthAdapter)

export default function PersonalizacionBouquetsPage() {
  const router = useRouter()
  const [bouquetOptions, setBouquetOptions] = useState<ReturnType<typeof mapCatalogoPublicoToPersonalizacion>['bouquets']>([])
  const [flowerCatalog, setFlowerCatalog] = useState<ReturnType<typeof mapCatalogoPublicoToPersonalizacion>['flowers']>([])
  const [selectedBouquetId, setSelectedBouquetId] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [selectedFlowers, setSelectedFlowers] = useState<Record<string, number>>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCatalogLoading, setIsCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)

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

  useEffect(() => {
    let isMounted = true

    setIsCatalogLoading(true)
    setCatalogError(null)

    catalogoAdapter.fetchPublicPersonalizacion()
      .then((response) => {
        if (!isMounted) {
          return
        }

        const mappedCatalog = mapCatalogoPublicoToPersonalizacion(response)
        setBouquetOptions(mappedCatalog.bouquets)
        setFlowerCatalog(mappedCatalog.flowers)
        setSelectedBouquetId((currentBouquetId) => currentBouquetId || mappedCatalog.bouquets[0]?.id || '')
        setIsCatalogLoading(false)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        setCatalogError(error instanceof Error ? error.message : 'No se pudo cargar el catalogo real.')
        setBouquetOptions([])
        setFlowerCatalog([])
        setSelectedBouquetId('')
        setIsCatalogLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!bouquetOptions.length) {
      if (selectedBouquetId) {
        setSelectedBouquetId('')
      }
      return
    }

    const selectedExists = bouquetOptions.some((option) => option.id === selectedBouquetId)

    if (!selectedExists) {
      setSelectedBouquetId(bouquetOptions[0].id)
    }
  }, [bouquetOptions, selectedBouquetId])

  const selectedBouquet = bouquetOptions.find((option) => option.id === selectedBouquetId) ?? bouquetOptions[0] ?? null
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

  const statsCaptionBouquets = bouquetOptions.length > 0
    ? 'Bouquets cargados desde la base de datos'
    : 'Aun no hay bouquets activos en catalogo'

  const statsCaptionFlowers = flowerCatalog.length > 0
    ? 'Flores activas listas para personalizar'
    : 'Aun no hay flores activas en catalogo'

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
              <span className={styles.statCaption}>{statsCaptionBouquets}</span>
            </article>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Catalogo floral</span>
              <strong className={styles.statValue}>{flowerCatalog.length}</strong>
              <span className={styles.statCaption}>{statsCaptionFlowers}</span>
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
            {isCatalogLoading ? (
              <section className={styles.heroPanel}>
                <div className={styles.heroCopy}>
                  <span className={styles.eyebrow}>Catalogo real</span>
                  <h2 className={styles.title}>Cargando bouquets y flores</h2>
                  <p className={styles.description}>Estamos trayendo la personalizacion desde el backend para eliminar los datos mock de la tienda.</p>
                </div>
              </section>
            ) : null}

            {!isCatalogLoading && catalogError ? (
              <section className={styles.heroPanel}>
                <div className={styles.heroCopy}>
                  <span className={styles.eyebrow}>Catalogo no disponible</span>
                  <h2 className={styles.title}>No se pudo cargar la personalizacion</h2>
                  <p className={styles.description}>{catalogError}</p>
                </div>
              </section>
            ) : null}

            {!isCatalogLoading && !catalogError && selectedBouquet ? (
              <>
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
              </>
            ) : null}
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