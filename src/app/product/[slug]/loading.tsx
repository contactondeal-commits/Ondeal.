import styles from "./page.module.css";

export default function ProductLoading() {
  return (
    <div className={`${styles.page} container`}>
      <div style={{ display: "flex", gap: 32, marginTop: 24 }}>
        <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 12, minHeight: 400, animation: "pulse 1.5s infinite" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {[180, 120, 60, 80, 200].map((h, i) => (
            <div key={i} style={{ height: h, background: "#f3f4f6", borderRadius: 8, animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
