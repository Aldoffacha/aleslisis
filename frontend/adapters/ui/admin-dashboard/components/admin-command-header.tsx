import type { AdminCommandHighlight } from '../admin-dashboard.types'
import styles from './admin-command-header.module.css'

interface AdminCommandHeaderProps {
  userName: string
  highlights: AdminCommandHighlight[]
}

const toneClassMap = {
  vino: styles.toneVino,
  oro: styles.toneOro,
  hoja: styles.toneHoja,
  grafito: styles.toneGrafito,
}

export function AdminCommandHeader({ userName, highlights }: AdminCommandHeaderProps) {
  return (
    <section id="inicio-admin" className={styles.root}>
      <div className={styles.copyColumn}>
        <span className={styles.eyebrow}>Centro de control</span>
        <h1 className={styles.title}>Dashboard administrador</h1>
        <p className={styles.description}>
          {userName}, esta consola organiza el negocio como un tablero lateral y modular, siguiendo exactamente la
          estructura de tu base de datos. Si una metrica todavia no tiene fuente conectada, el panel lo muestra vacio en lugar de inventar valores.
        </p>

        <div className={styles.actionRow}>
          <a href="#metricas-admin" className={styles.primaryAction}>Ir a estadisticas</a>
          <a href="#modulos-admin" className={styles.secondaryAction}>Ver modulos</a>
          <a href="#operacion-admin" className={styles.ghostAction}>Flujos del sistema</a>
        </div>
      </div>

      <div className={styles.signalColumn}>
        {highlights.map((highlight) => (
          <article key={highlight.id} className={`${styles.signalCard} ${toneClassMap[highlight.tone]}`}>
            <span className={styles.signalLabel}>{highlight.label}</span>
            <strong className={styles.signalValue}>{highlight.value}</strong>
            <p className={styles.signalNote}>{highlight.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}