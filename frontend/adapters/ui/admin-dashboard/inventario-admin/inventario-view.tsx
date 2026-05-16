'use client'

import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { InventoryCategoryItem, InventoryProductItem, InventorySummary, InventoryTypeInput, InventoryTypeItem } from '@/domain/entities/inventario-admin'
import { inventarioAdminAdapter } from '@/adapters/api/inventario-admin-adapter'
import { InventoryCategoryForm, InventoryProductForm } from './components/inventory-forms'
import { InventoryCategoriesPanel, InventoryProductsPanel } from './components/inventory-lists'
import { InventoryToolbar } from './components/inventory-toolbar'
import styles from './inventario-admin-shell.module.css'
import {
  categoryFormStateToPayload,
  createEmptyCategoryFormState,
  createEmptyProductFormState,
  defaultInventoryFilters,
  mapCategoryToFormState,
  mapProductToFormState,
  productFormStateToPayload,
  readFileAsDataUrl,
  toggleEntityState,
  type InventoryCategoryFormState,
  type InventoryFiltersState,
  type InventoryProductFormState,
} from './inventario-admin.utils'

const emptySummary: InventorySummary = {
  categorias: [],
  tipos: [],
  productos: [],
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'No se pudo completar la operacion con datos reales.'
}

export function InventarioView() {
  const [filters, setFilters] = useState<InventoryFiltersState>(defaultInventoryFilters)
  const [draftQuery, setDraftQuery] = useState('')
  const [summary, setSummary] = useState<InventorySummary>(emptySummary)
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategoryItem | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<InventoryProductItem | null>(null)
  const [categoryFormState, setCategoryFormState] = useState<InventoryCategoryFormState>(createEmptyCategoryFormState())
  const [productFormState, setProductFormState] = useState<InventoryProductFormState>(createEmptyProductFormState())
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingCategory, setIsSavingCategory] = useState(false)
  const [isAddingType, setIsAddingType] = useState(false)
  const [isSavingProduct, setIsSavingProduct] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const loadSummary = async () => {
      setIsLoading(true)

      try {
        const response = await inventarioAdminAdapter.fetchSummary({
          q: filters.query,
          categoriaId: filters.categoriaId ? Number(filters.categoriaId) : undefined,
          estado: filters.estado || undefined,
        })

        if (isCancelled) {
          return
        }

        setSummary(response)
        setDraftQuery(filters.query)
        setErrorMessage(null)
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(getErrorMessage(error))
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadSummary()

    return () => {
      isCancelled = true
    }
  }, [filters])

  const categories = summary.categorias
  const inventoryTypes = summary.tipos
  const products = summary.productos
  const activeProducts = useMemo(() => products.filter((product) => product.estado.trim().toLowerCase() === 'activo').length, [products])
  const categoryTypes = useMemo<Record<number, InventoryTypeItem[]>>(() => {
    return inventoryTypes.reduce<Record<number, InventoryTypeItem[]>>((accumulator, inventoryType) => {
      if (!accumulator[inventoryType.categoriaId]) {
        accumulator[inventoryType.categoriaId] = []
      }

      accumulator[inventoryType.categoriaId].push(inventoryType)
      return accumulator
    }, {})
  }, [inventoryTypes])
  const selectedCategoryTypes = useMemo(() => {
    if (!selectedCategory) {
      return []
    }

    return categoryTypes[selectedCategory.id] || []
  }, [categoryTypes, selectedCategory])
  const availableTypes = useMemo(() => {
    if (!productFormState.categoriaId) {
      return []
    }

    return inventoryTypes.filter((inventoryType) => {
      if (String(inventoryType.categoriaId) !== productFormState.categoriaId) {
        return false
      }

      if (inventoryType.estado.trim().toLowerCase() === 'activo') {
        return true
      }

      return productFormState.tipoItemId === String(inventoryType.id)
    })
  }, [inventoryTypes, productFormState.categoriaId, productFormState.tipoItemId])

  const reloadSummary = async () => {
    const response = await inventarioAdminAdapter.fetchSummary({
      q: filters.query,
      categoriaId: filters.categoriaId ? Number(filters.categoriaId) : undefined,
      estado: filters.estado || undefined,
    })
    setSummary(response)
    return response
  }

  const handleCategoryFieldChange = (field: keyof InventoryCategoryFormState, value: string) => {
    setCategoryFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }))
  }

  const handleProductFieldChange = (field: keyof InventoryProductFormState, value: string | boolean) => {
    setProductFormState((currentState) => {
      if (field === 'categoriaId' && typeof value === 'string') {
        return {
          ...currentState,
          categoriaId: value,
          tipoItemId: '',
          tipoItem: '',
        }
      }

      if (field === 'tipoItemId' && typeof value === 'string') {
        const selectedType = inventoryTypes.find((inventoryType) => String(inventoryType.id) === value)

        return {
          ...currentState,
          tipoItemId: value === '__legacy__' ? currentState.tipoItemId : value,
          tipoItem: selectedType?.nombre || '',
        }
      }

      return {
        ...currentState,
        [field]: value,
      }
    })
  }

  const handleSelectCategory = (category: InventoryCategoryItem) => {
    setSelectedCategory(category)
    setCategoryFormState(mapCategoryToFormState(category))
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleSelectProduct = (product: InventoryProductItem) => {
    setSelectedProduct(product)
    setProductFormState(mapProductToFormState(product))
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleResetCategory = () => {
    setSelectedCategory(null)
    setCategoryFormState(createEmptyCategoryFormState())
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleResetProduct = () => {
    setSelectedProduct(null)
    setProductFormState(createEmptyProductFormState(selectedCategory ? String(selectedCategory.id) : ''))
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  const handleProductFileChange = async (file: File | null) => {
    if (!file) {
      setProductFormState((currentState) => ({
        ...currentState,
        imageFile: null,
      }))
      return
    }

    try {
      const preview = await readFileAsDataUrl(file)
      setProductFormState((currentState) => ({
        ...currentState,
        imageFile: file,
        imagePreview: preview,
        removeImage: false,
      }))
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSavingCategory(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const payload = categoryFormStateToPayload(categoryFormState)
      const savedCategory = selectedCategory
        ? await inventarioAdminAdapter.updateCategory(selectedCategory.id, payload)
        : await inventarioAdminAdapter.createCategory(payload)

      await reloadSummary()
      setSelectedCategory(savedCategory)
      setCategoryFormState(mapCategoryToFormState(savedCategory))
      setFeedbackMessage(selectedCategory ? 'Categoria actualizada correctamente.' : 'Categoria creada correctamente.')

      if (!productFormState.categoriaId) {
        setProductFormState((currentState) => ({
          ...currentState,
          categoriaId: String(savedCategory.id),
        }))
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSavingCategory(false)
    }
  }

  const handleCreateType = async (payload: InventoryTypeInput) => {
    if (!selectedCategory) {
      setErrorMessage('Selecciona una categoria antes de añadir tipos.')
      return
    }

    setIsAddingType(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      await inventarioAdminAdapter.createType(selectedCategory.id, payload)
      await reloadSummary()
      setFeedbackMessage('Tipo añadido correctamente a la categoria.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      throw error
    } finally {
      setIsAddingType(false)
    }
  }

  const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSavingProduct(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const payload = productFormStateToPayload(productFormState)
      const savedProduct = selectedProduct
        ? await inventarioAdminAdapter.updateProduct(selectedProduct.id, payload)
        : await inventarioAdminAdapter.createProduct(payload)

      await reloadSummary()
      setSelectedProduct(savedProduct)
      setProductFormState(mapProductToFormState(savedProduct))
      setFeedbackMessage(selectedProduct ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSavingProduct(false)
    }
  }

  const handleToggleCategoryState = async (category: InventoryCategoryItem) => {
    setIsSavingCategory(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const isActive = category.estado.trim().toLowerCase() === 'activo'
      const savedCategory = isActive
        ? await inventarioAdminAdapter.deleteCategory(category.id)
        : await inventarioAdminAdapter.updateCategory(category.id, { estado: toggleEntityState(category.estado) })

      await reloadSummary()
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(savedCategory)
        setCategoryFormState(mapCategoryToFormState(savedCategory))
      }
      setFeedbackMessage(isActive ? 'Categoria desactivada logicamente.' : 'Categoria reactivada correctamente.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSavingCategory(false)
    }
  }

  const handleToggleProductState = async (product: InventoryProductItem) => {
    setIsSavingProduct(true)
    setFeedbackMessage(null)
    setErrorMessage(null)

    try {
      const isActive = product.estado.trim().toLowerCase() === 'activo'
      const savedProduct = isActive
        ? await inventarioAdminAdapter.deleteProduct(product.id)
        : await inventarioAdminAdapter.updateProduct(product.id, { estado: toggleEntityState(product.estado) })

      await reloadSummary()
      if (selectedProduct?.id === product.id) {
        setSelectedProduct(savedProduct)
        setProductFormState(mapProductToFormState(savedProduct))
      }
      setFeedbackMessage(isActive ? 'Producto desactivado logicamente.' : 'Producto reactivado correctamente.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSavingProduct(false)
    }
  }

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Catalogo y stock / inventario real</span>
          <h2 className={styles.title}>Inventario</h2>
          <p className={styles.description}>
            Gestiona categorias y productos reales para arreglos florales: flores naturales, flores artificiales, papeles, cintas, cajas, envoltorios y regalos complementarios con imagen, stock y precio.
          </p>
        </div>

        <div className={styles.metricsGrid}>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Categorias</span>
            <strong className={styles.metricValue}>{categories.length}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Productos visibles</span>
            <strong className={styles.metricValue}>{products.length}</strong>
          </article>
          <article className={styles.metricCard}>
            <span className={styles.metricLabel}>Activos</span>
            <strong className={styles.metricValue}>{activeProducts}</strong>
          </article>
        </div>
      </section>

      <InventoryToolbar
        draftQuery={draftQuery}
        categoriaId={filters.categoriaId}
        estado={filters.estado}
        categories={categories}
        totalProducts={products.length}
        onDraftQueryChange={setDraftQuery}
        onCategoriaChange={(value) => setFilters((currentState) => ({ ...currentState, categoriaId: value }))}
        onEstadoChange={(value) => setFilters((currentState) => ({ ...currentState, estado: value }))}
        onApplyFilters={() => setFilters((currentState) => ({ ...currentState, query: draftQuery.trim() }))}
      />

      {feedbackMessage ? <div className={styles.feedbackSuccess}>{feedbackMessage}</div> : null}
      {errorMessage ? <div className={styles.feedbackError}>{errorMessage}</div> : null}

      <div className={styles.workspace}>
        <div className={styles.column}>
          <InventoryCategoriesPanel
            categories={categories}
            categoryTypes={categoryTypes}
            selectedCategoryId={selectedCategory?.id ?? null}
            isLoading={isLoading}
            isSaving={isSavingCategory}
            onSelectCategory={handleSelectCategory}
            onToggleCategoryState={handleToggleCategoryState}
          />

          <InventoryCategoryForm
            formState={categoryFormState}
            linkedTypes={selectedCategoryTypes}
            selectedCategoryId={selectedCategory?.id ?? null}
            isSaving={isSavingCategory}
            isAddingType={isAddingType}
            isEditing={Boolean(selectedCategory)}
            onFieldChange={handleCategoryFieldChange}
            onAddType={handleCreateType}
            onSubmit={handleCategorySubmit}
            onReset={handleResetCategory}
          />
        </div>

        <div className={styles.column}>
          <InventoryProductsPanel
            products={products}
            selectedProductId={selectedProduct?.id ?? null}
            isLoading={isLoading}
            isSaving={isSavingProduct}
            onSelectProduct={handleSelectProduct}
            onToggleProductState={handleToggleProductState}
          />

          <InventoryProductForm
            categories={categories}
            availableTypes={availableTypes}
            formState={productFormState}
            isSaving={isSavingProduct}
            isEditing={Boolean(selectedProduct)}
            onFieldChange={handleProductFieldChange}
            onFileChange={(file) => void handleProductFileChange(file)}
            onSubmit={handleProductSubmit}
            onReset={handleResetProduct}
          />
        </div>
      </div>
    </div>
  )
}
