import { brands } from "@/data/brands";
import styles from "./BrandsRow.module.css";

export default function BrandsRow() {
  return (
    <section className={`${styles.section} container`} aria-labelledby="brands-heading">
      <h2 id="brands-heading" className={styles.heading}>
        Nos marques
      </h2>
      <div className={styles.row}>
        {brands.map((b) => (
          <div key={b.id} className={styles.chip}>
            {b.name}
          </div>
        ))}
      </div>
    </section>
  );
}
