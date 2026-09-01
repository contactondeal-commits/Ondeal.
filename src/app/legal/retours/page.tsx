export default function RetoursPage() {
  return (
    <main style={{ fontFamily: "inherit" }}>
      {/* Hero */}
      <div style={{ background: "#4F46E5", color: "white", padding: "64px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "12px" }}>Retours & remboursements</h1>
        <p style={{ color: "#c7d2fe", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
          Votre satisfaction est notre priorité. Retournez votre commande facilement, sans stress.
        </p>
      </div>

      {/* Réassurance */}
      <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "32px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {[
            { icon: "🔄", title: "14 jours", sub: "pour changer d'avis" },
            { icon: "💳", title: "Remboursement garanti", sub: "sous 14 jours" },
            { icon: "✅", title: "Sans justification", sub: "ni pénalité" },
            { icon: "👤", title: "100% en ligne", sub: "depuis votre compte" },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{item.icon}</div>
              <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{item.title}</div>
              <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {[
          {
            title: "🇪🇺 Votre droit de rétractation",
            bg: "#eef2ff",
            color: "#3730a3",
            text: "Conformément à la réglementation européenne, vous disposez de 14 jours pour exercer votre droit de rétractation — sans avoir à vous justifier, sans pénalité. Ce délai commence dès la réception du dernier article de votre commande.",
          },
          {
            title: "Comment procéder ?",
            text: "Rendez-vous dans votre espace client, rubrique Mes commandes, et initiez votre demande en quelques clics. Si votre commande n'est pas encore expédiée, vous pouvez également l'annuler directement depuis votre compte.",
          },
          {
            title: "Remboursement",
            text: "Dès réception et contrôle de votre article, vous êtes remboursé sous 14 jours sur votre moyen de paiement d'origine.",
          },
          {
            title: "Frais de retour",
            text: "Les frais de retour sont à la charge du client, sauf en cas d'article défectueux ou d'erreur de notre part.",
          },
          {
            title: "Exceptions",
            text: "Certains produits ne peuvent pas être retournés : articles personnalisés, produits descellés non retournables pour raisons d'hygiène, ou produits ne pouvant être réexpédiés.",
          },
        ].map((section) => (
          <div key={section.title} style={{ background: section.bg || "white", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: section.color || "#111827", marginBottom: "12px" }}>{section.title}</h2>
            <p style={{ color: "#374151", lineHeight: "1.75" }}>{section.text}</p>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "#4F46E5", borderRadius: "16px", padding: "40px", textAlign: "center", color: "white" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "8px" }}>Une question sur votre retour ?</p>
          <p style={{ color: "#c7d2fe", marginBottom: "24px" }}>Notre équipe vous répond rapidement.</p>
          <a href="mailto:contact@ondeal.fr" style={{ background: "#FBBF24", color: "#111827", fontWeight: "bold", padding: "12px 28px", borderRadius: "999px", textDecoration: "none", display: "inline-block" }}>
            Contacter le support
          </a>
        </div>
      </div>
    </main>
  );
}
