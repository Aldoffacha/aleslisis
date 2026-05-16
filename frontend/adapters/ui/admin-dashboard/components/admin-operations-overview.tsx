import type { AdminSnapshotCard, AdminWorkflowLane } from '../admin-dashboard.types'
import styles from './admin-operations-overview.module.css'

interface AdminOperationsOverviewProps {
  workflows: AdminWorkflowLane[]
  snapshots: AdminSnapshotCard[]
}

const toneClassMap = {
  vino: styles.toneVino,
  oro: styles.toneOro,
  hoja: styles.toneHoja,
  grafito: styles.toneGrafito,
}

export function AdminOperationsOverview({ workflows, snapshots }: AdminOperationsOverviewProps) {
  return (
    <section id="operacion-admin" className={styles.root}>
      <div className={styles.workflowPanel}>
        <div className={styles.panelHeader}>
          <span className={styles.eyebrow}>Operacion y negocio</span>
          <h2 className={styles.title}>Flujos y relaciones principales</h2>
        </div>

        <div className={styles.workflowList}>
          {workflows.map((workflow) => (
            <article key={workflow.id} className={styles.workflowCard}>
              <h3 className={styles.workflowTitle}>{workflow.title}</h3>
              <p className={styles.workflowDescription}>{workflow.description}</p>
              <div className={styles.stepRail}>
                {workflow.tables.map((table) => (
                  <span key={table} className={styles.stepTag}>{table}</span>
                ))}
              </div>
              <strong className={styles.workflowMetric}>{workflow.note}</strong>
              <a href={workflow.href} className={styles.workflowAction}>Ir a la seccion</a>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.sidePanel}>
        <div className={styles.activityCard}>
          <div className={styles.panelHeader}>
            <span className={styles.eyebrow}>Paneles vacios</span>
            <h2 className={styles.title}>Bloques listos para conectar</h2>
          </div>

          <div className={styles.activityList}>
            {snapshots.map((snapshot) => (
              <article key={snapshot.id} className={styles.activityItem}>
                <strong className={styles.activityTitle}>{snapshot.label}</strong>
                <p className={styles.activityDescription}>{snapshot.note}</p>
                <a href={snapshot.href} className={styles.activityLink}>Ir al bloque</a>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.snapshotGrid}>
          {snapshots.map((snapshot) => (
            <article key={snapshot.id} className={`${styles.snapshotCard} ${toneClassMap[snapshot.tone]}`}>
              <span className={styles.snapshotLabel}>{snapshot.label}</span>
              <strong className={styles.snapshotValue}>{snapshot.value}</strong>
              <p className={styles.snapshotNote}>{snapshot.note}</p>
              <a href={snapshot.href} className={styles.snapshotAction}>Abrir</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}