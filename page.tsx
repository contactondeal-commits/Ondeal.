"use client";
import { useState } from "react";

export default function PartenairesPage() {
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/partenaires", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nom: fd.get("Nom"),
        email: fd.get("Email"),
        telephone: fd.get("Telephone"),
        activite: fd.get("Activite"),
        message: fd.get("Message"),
      }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", padding: "80px 24px", textAlign: "center" }}>
