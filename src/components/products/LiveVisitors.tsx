"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import styles from "./LiveVisitors.module.css";

interface LiveVisitorsProps {
  baseCount?: number;
}

export default function LiveVisitors({ baseCount = 8 }: LiveVisitorsProps) {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(25, c + delta));
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.root}>
      <span className={styles.dot} aria-hidden="true" />
      <Eye size={13} />
      <span>
        <strong>{count} personnes</strong> regardent ce produit en ce moment
      </span>
    </div>
  );
}
