import type { AdminKpiStat } from '../admin-dashboard.types'
import styles from './admin-kpi-carousel.module.css'

interface AdminKpiCarouselProps {
  stats: AdminKpiStat[]
}

const toneClassMap = {
  vino: styles.toneVino,
  oro: styles.toneOro,
  hoja: styles.toneHoja,
  grafito: styles.toneGrafito,
}

export function AdminKpiCarousel({ stats }: AdminKpiCarouselProps) {
  return (
    <section id="metricas-admin" className={styles.root}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Metricas del negocio</span>
          <h2 className={styles.title}>Pulso deslizable del negocio</h2>
        </div>
        <p className={styles.description}>
          Estas tarjetas no muestran cifras inventadas. Cuando todavia no hay datos conectados al backend, el tablero mantiene el modulo visible pero con estado vacio.
        </p>
      </div>

      <div className={styles.track}>
        {stats.map((stat) => (
          <article key={stat.id} className={`${styles.card} ${toneClassMap[stat.tone]}`}>
            <span className={styles.cardLabel}>{stat.label}</span>
            <strong className={styles.cardValue}>{stat.value}</strong>
            <span className={styles.cardDelta}>{stat.status}</span>
            <p className={styles.cardContext}>{stat.context}</p>
            <div className={styles.tableRail}>
              {stat.tables.map((table) => (
                <span key={table} className={styles.tableTag}>{table}</span>
              ))}
            </div>
            <a href={stat.href} className={styles.cardAction}>Ir a la seccion</a>
          </article>
        ))}
      </div>
    </section>
  )
}