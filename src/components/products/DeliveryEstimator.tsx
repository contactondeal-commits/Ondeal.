"use client";

import { Truck } from "lucide-react";
import styles from "./DeliveryEstimator.module.css";

interface DeliveryEstimatorProps {
  cutoffHour?: number;
}

function getDeliveryDate(cutoffHour: number): string {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(cutoffHour, 0, 0, 0);

  const delivery = new Date(now);
  delivery.setDate(delivery.getDate() + (now > cutoff ? 3 : 2));

  while (delivery.getDay() === 0 || delivery.getDay() === 6) {
    delivery.setDate(delivery.getDate() + 1);
  }

  return delivery.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getHoursLeft(cutoffHour: number): number {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(cutoffHour, 0, 0, 0);
  if (now >= cutoff) return 0;
  return Math.floor((cutoff.getTime() - now.getTime()) / 3600000);
}

export default function DeliveryEstimator({ cutoffHour = 16 }: DeliveryEstimatorProps) {
  const deliveryDate = getDeliveryDate(cutoffHour);
  const hoursLeft = getHoursLeft(cutoffHour);
  const isBeforeCutoff = hoursLeft > 0;

  return (
    <div className={styles.root}>
      <Truck size={15} className={styles.icon} />
      <div>
        <span className={styles.label}>
          Livré le <strong>{deliveryDate}</strong>
        </span>
        {isBeforeCutoff && (
          <span className={styles.cutoff}>
            {" "}— commandez dans les{" "}
            <strong className={styles.timer}>{hoursLeft}h</strong>
          </span>
        )}
      </div>
    </div>
  );
}
