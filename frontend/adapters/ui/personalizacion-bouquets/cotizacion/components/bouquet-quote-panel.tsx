'use client'

import { useState } from 'react'
import type { BouquetQuoteSummary } from '../bouquet-quote.types'
import { downloadBouquetQuotePdf } from '../bouquet-quote-pdf'
import { formatQuoteCurrency } from '../bouquet-quote.utils'
import styles from './bouquet-quote-panel.module.css'

interface BouquetQuotePanelProps {
  summary: BouquetQuoteSummary
}

export function BouquetQuotePanel({ summary }: BouquetQuotePanelProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const handleDownloadPdf = async () => {
    setIsDownloading(true)
    setDownloadError(null)

    try {
      await downloadBouquetQuotePdf(summary)
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'No se pudo generar el reporte PDF.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerCopy}>
          <span className={styles.eyebrow}>Paso 3</span>
          <h2 className={styles.title}>Cotizacion de tu bouquet</h2>
          <p className={styles.description}>
            La cotizacion se arma con el bouquet base activo y cada flor que agregas al editor en tiempo real.
          </p>
        </div>

        <button type="button" className={styles.downloadButton} onClick={() => void handleDownloadPdf()} disabled={isDownloading}>
          {isDownloading ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
      </div>

      <div className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Bouquet base</span>
          <strong className={styles.metricValue}>1</strong>
          <span className={styles.metricCaption}>{summary.bouquet.title}</span>
        </article>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Variedades</span>
          <strong className={styles.metricValue}>{summary.totalVarieties}</strong>
          <span className={styles.metricCaption}>Tipos de flores elegidos</span>
        </article>
        <article className={styles.metricCard}>
          <span className={styles.metricLabel}>Tallos</span>
          <strong className={styles.metricValue}>{summary.totalUnits}</strong>
          <span className={styles.metricCaption}>Unidades florales seleccionadas</span>
        </article>
        <article className={styles.totalCard}>
          <span className={styles.metricLabel}>Total estimado</span>
          <strong className={styles.metricValue}>{formatQuoteCurrency(summary.total)}</strong>
          <span className={styles.metricCaption}>Base + flores adicionales</span>
        </article>
      </div>

      <div className={styles.itemsPanel}>
        <div className={styles.itemsHeader}>
          <span className={styles.itemsTitle}>Detalle cotizado</span>
          <span className={styles.itemsHint}>{summary.allItems.length} productos en el reporte</span>
        </div>

        <ul className={styles.itemList}>
          {summary.allItems.map((item) => (
            <li key={`${item.kind}-${item.id}`} className={`${styles.itemRow} ${item.kind === 'bouquet' ? styles.itemPrimary : ''}`.trim()}>
              <div className={styles.itemInfo}>
                <span className={styles.itemDot} style={{ backgroundColor: item.accentColor }} />
                <div className={styles.itemText}>
                  <strong className={styles.itemTitle}>{item.title}</strong>
                  <span className={styles.itemDetail}>{item.detail}</span>
                </div>
              </div>

              <div className={styles.itemPricing}>
                <span className={styles.itemQuantity}>x{item.quantity}</span>
                <strong className={styles.itemSubtotal}>{formatQuoteCurrency(item.subtotal)}</strong>
                <span className={styles.itemUnitPrice}>Unitario {formatQuoteCurrency(item.unitPrice)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.noteBox}>
        La cotizacion es referencial y usa los precios activos del catalogo real. Si cambias el bouquet base o ajustas cantidades, el total se recalcula al instante y el PDF sale con ese mismo detalle.
      </div>

      {downloadError ? <div className={styles.errorMessage}>{downloadError}</div> : null}
    </section>
  )
}