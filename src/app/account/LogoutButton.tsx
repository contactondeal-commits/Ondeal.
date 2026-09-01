"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import styles from "./layout.module.css";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className={`${styles.navLink} ${styles.logout}`}>
      <LogOut size={17} /> Déconnexion
    </button>
  );
}
