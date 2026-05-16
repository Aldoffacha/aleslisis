import type { BouquetQuoteSummary } from './bouquet-quote.types'
import { formatQuoteCurrency } from './bouquet-quote.utils'

function hexToRgb(hexColor: string): [number, number, number] {
  const normalizedHex = hexColor.replace('#', '').trim()

  if (!/^[\da-fA-F]{6}$/.test(normalizedHex)) {
    return [122, 53, 53]
  }

  return [
    Number.parseInt(normalizedHex.slice(0, 2), 16),
    Number.parseInt(normalizedHex.slice(2, 4), 16),
    Number.parseInt(normalizedHex.slice(4, 6), 16),
  ]
}

function formatPdfDate(date: Date): string {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function drawPageHeader(doc: any, summary: BouquetQuoteSummary) {
  const [red, green, blue] = hexToRgb(summary.bouquet.accentColor)

  doc.setFillColor(250, 244, 240)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(red, green, blue)
  doc.roundedRect(16, 14, 178, 28, 8, 8, 'F')

  doc.setTextColor(255, 248, 244)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('ALESLI FLORES', 22, 24)

  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.text('Cotizacion Hazlo tu mismo', 22, 34)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(formatPdfDate(new Date()), 164, 24, { align: 'right' })
  doc.text('Reporte generado automaticamente', 164, 31, { align: 'right' })

  doc.setDrawColor(222, 204, 201)
  doc.line(16, 48, 194, 48)
}

function drawInfoCards(doc: any, summary: BouquetQuoteSummary): number {
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(230, 214, 211)
  doc.roundedRect(16, 56, 112, 32, 7, 7, 'FD')
  doc.roundedRect(132, 56, 62, 32, 7, 7, 'FD')

  doc.setTextColor(138, 102, 102)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('BOUQUET BASE', 22, 64)
  doc.text('TOTAL ESTIMADO', 138, 64)

  doc.setTextColor(79, 40, 40)
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.text(summary.bouquet.title, 22, 74)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(summary.bouquet.subtitle || 'Bouquet activo del catalogo', 22, 81)

  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.text(formatQuoteCurrency(summary.total), 138, 75)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`${summary.totalUnits} tallos · ${summary.totalVarieties} variedades`, 138, 82)

  return 98
}

function ensurePageSpace(doc: any, currentY: number, requiredHeight: number, summary: BouquetQuoteSummary): number {
  if (currentY + requiredHeight <= 278) {
    return currentY
  }

  doc.addPage()
  drawPageHeader(doc, summary)
  return 58
}

function drawTableHeader(doc: any, y: number) {
  doc.setFillColor(240, 228, 226)
  doc.roundedRect(16, y, 178, 12, 4, 4, 'F')

  doc.setTextColor(110, 72, 72)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('DETALLE', 22, y + 7.5)
  doc.text('CANT.', 132, y + 7.5, { align: 'center' })
  doc.text('P. UNIT.', 156, y + 7.5, { align: 'center' })
  doc.text('SUBTOTAL', 184, y + 7.5, { align: 'right' })
}

function drawLineItem(doc: any, item: BouquetQuoteSummary['allItems'][number], y: number) {
  const [red, green, blue] = hexToRgb(item.accentColor)

  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(236, 222, 218)
  doc.roundedRect(16, y, 178, 18, 4, 4, 'FD')

  doc.setFillColor(red, green, blue)
  doc.circle(22, y + 6.5, 1.6, 'F')

  doc.setTextColor(79, 40, 40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(item.title, 27, y + 7.5)

  doc.setTextColor(126, 92, 92)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(item.detail, 27, y + 13)

  doc.setTextColor(79, 40, 40)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(String(item.quantity), 132, y + 10, { align: 'center' })
  doc.text(formatQuoteCurrency(item.unitPrice), 156, y + 10, { align: 'center' })
  doc.text(formatQuoteCurrency(item.subtotal), 184, y + 10, { align: 'right' })
}

function drawTotals(doc: any, summary: BouquetQuoteSummary, y: number): number {
  doc.setFillColor(122, 53, 53)
  doc.roundedRect(116, y, 78, 34, 6, 6, 'F')

  doc.setTextColor(255, 248, 244)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('RESUMEN FINAL', 122, y + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Bouquet base: ${formatQuoteCurrency(summary.baseItem.subtotal)}`, 122, y + 15)
  doc.text(`Flores adicionales: ${formatQuoteCurrency(summary.subtotalFlowers)}`, 122, y + 21)

  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.text(formatQuoteCurrency(summary.total), 188, y + 30, { align: 'right' })

  return y + 44
}

function drawFooterNote(doc: any, y: number) {
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(230, 214, 211)
  doc.roundedRect(16, y, 178, 24, 6, 6, 'FD')

  doc.setTextColor(111, 79, 79)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(
    'Esta cotizacion se genera con los precios activos del catalogo y funciona como referencia comercial. El monto final puede ajustarse segun stock real, validacion manual y cambios posteriores en la seleccion.',
    22,
    y + 8,
    { maxWidth: 166 },
  )
}

export async function downloadBouquetQuotePdf(summary: BouquetQuoteSummary) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  drawPageHeader(doc, summary)

  let currentY = drawInfoCards(doc, summary)
  drawTableHeader(doc, currentY)
  currentY += 18

  for (const item of summary.allItems) {
    currentY = ensurePageSpace(doc, currentY, 22, summary)
    if (currentY === 58) {
      drawTableHeader(doc, currentY)
      currentY += 18
    }

    drawLineItem(doc, item, currentY)
    currentY += 22
  }

  currentY = ensurePageSpace(doc, currentY + 6, 52, summary)
  currentY = drawTotals(doc, summary, currentY + 2)
  currentY = ensurePageSpace(doc, currentY, 30, summary)
  drawFooterNote(doc, currentY)

  const safeBouquetName = summary.bouquet.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'bouquet'

  doc.save(`cotizacion-${safeBouquetName}.pdf`)
}