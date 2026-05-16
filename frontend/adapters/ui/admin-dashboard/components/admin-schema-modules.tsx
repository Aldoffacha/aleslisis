import type { AdminModuleSection } from '../admin-dashboard.types'
import styles from './admin-schema-modules.module.css'

interface AdminSchemaModulesProps {
  modules: AdminModuleSection[]
}

const toneClassMap = {
  vino: styles.toneVino,
  oro: styles.toneOro,
  hoja: styles.toneHoja,
  grafito: styles.toneGrafito,
}

export function AdminSchemaModules({ modules }: AdminSchemaModulesProps) {
  return (
    <section id="modulos-admin" className={styles.root}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Estructura por modulos</span>
          <h2 className={styles.title}>Secciones construidas desde tu base de datos</h2>
        </div>
        <p className={styles.description}>
          Cada tarjeta representa un modulo real de tu esquema. Los botones te llevan a la seccion correspondiente del tablero para que luego puedas colgar formularios, listados y CRUDs sin cambiar la navegacion.
        </p>
      </div>

      <div className={styles.grid}>
        {modules.map((module) => (
          <article key={module.id} id={`modulo-${module.id}`} className={`${styles.card} ${toneClassMap[module.tone]}`}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardMetric}>{module.status}</span>
                <h3 className={styles.cardTitle}>{module.title}</h3>
              </div>
              <a href={module.href} className={styles.status}>Abrir seccion</a>
            </div>

            <p className={styles.summary}>{module.summary}</p>

            <div className={styles.sectionsWrap}>
              {module.sections.map((section) => (
                <span key={section} className={styles.sectionTag}>{section}</span>
              ))}
            </div>

            <div className={styles.tablesWrap}>
              {module.tables.map((table) => (
                <span key={table} className={styles.tableTag}>{table}</span>
              ))}
            </div>

            <a href={module.href} className={styles.openButton}>Ir al modulo</a>
          </article>
        ))}
      </div>
    </section>
  )
}