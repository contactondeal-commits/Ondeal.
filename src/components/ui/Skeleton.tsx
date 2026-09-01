import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}

export default function Skeleton({ width = "100%", height = 16, rounded, className }: SkeletonProps) {
  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius: rounded ? "var(--radius-pill)" : "var(--radius-sm)" }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton height={0} className={styles.image} />
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton width="40%" height={12} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="60%" height={16} />
        <Skeleton width="50%" height={20} />
      </div>
    </div>
  );
}
