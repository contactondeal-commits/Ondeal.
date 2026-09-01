"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import styles from "./StockCountdown.module.css";

interface StockCountdownProps {
  stock: number;
  threshold?: number;
}

export default function StockCountdown({ stock, threshold = 10 }: StockCountdownProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (stock > 0 && stock <= threshold) setVisible(true);
  }, [stock, threshold]);

  if (!visible) return null;

  const isUrgent = stock <= 3;

  return (
    <div className={`${styles.root} ${isUrgent ? styles.urgent : styles.low}`}>
      <Flame size={13} />
      {isUrgent
        ? `Dernières pièces — plus que ${stock} en stock !`
        : `Plus que ${stock} en stock`}
    </div>
  );
}
