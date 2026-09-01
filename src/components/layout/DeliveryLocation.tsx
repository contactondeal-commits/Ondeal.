"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { MapPin, X, Navigation, Globe, Shield } from "lucide-react";
import { useLocation, LOCATION_CONFIG } from "@/context/LocationContext";

interface GeoData {
  country_name: string;
  country_code: string;
  city?: string;
}

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgique" },
  { code: "CH", name: "Suisse" },
  { code: "LU", name: "Luxembourg" },
  { code: "DZ", name: "Algerie" },
  { code: "MA", name: "Maroc" },
  { code: "TN", name: "Tunisie" },
  { code: "SN", name: "Senegal" },
  { code: "CI", name: "Cote d'Ivoire" },
  { code: "DE", name: "Allemagne" },
  { code: "ES", name: "Espagne" },
  { code: "IT", name: "Italie" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "US", name: "Etats-Unis" },
  { code: "CA", name: "Canada" },
];

function getFlag(code: string) {
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

type Step = "menu" | "gps-confirm" | "gps-loading" | "postal" | "country";

export default function DeliveryLocation() {
  const { setLocation, location } = useLocation();
  const [selected, setSelected] = useState<GeoData | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("menu");
  const [postalCode, setPostalCode] = useState("");
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        const code = d.country_code as string;
        const config = LOCATION_CONFIG[code] ?? {
          currency: "EUR", currency_symbol: "€", rate: 1, ships_to: true,
          shipping_rate: "19,90€", delivery_days: "A confirmer",
        };
        const loc = { country_code: code, country_name: d.country_name, city: d.city, ...config };
        setSelected({ country_name: d.country_name, country_code: code, city: d.city });
        setLocation(loc);
      })
      .catch(() => {
        setSelected({ country_name: "France", country_code: "FR", city: "Paris" });
      });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setStep("menu");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
    setOpen(prev => !prev);
    setStep("menu");
  };

  const close = () => { setOpen(false); setStep("menu"); };

  const requestGPS = () => {
    setStep("gps-loading");
    if (!navigator.geolocation) {
      setStep("menu");
      alert("Geolocalisation non supportee.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
          );
          const data = await res.json();
          const code = data.countryCode || "FR";
          const config = LOCATION_CONFIG[code] ?? {
            currency: "EUR", currency_symbol: "€", rate: 1, ships_to: true,
            shipping_rate: "19,90€", delivery_days: "A confirmer",
          };
          const loc = {
            country_code: code,
            country_name: data.countryName || "France",
            city: data.city || data.locality || "",
            ...config,
          };
          setSelected({ country_name: loc.country_name, country_code: code, city: loc.city });
          setLocation(loc);
          close();
        } catch {
          close();
        }
      },
      (err) => {
        setStep("menu");
        if (err.code === 1) {
          alert("Permission refusee.");
        } else {
          alert("Impossible de detecter votre position.");
        }
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  if (!selected) return null;

  const popup = open ? (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        top: popupPos.top,
        left: popupPos.left,
        transform: "translateX(-50%)",
        background: "#fff",
        color: "#111",
        borderRadius: 16,
        padding: 24,
        width: 340,
        zIndex: 99999,
        boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
        fontFamily: "inherit",
      }}
    >
      <button onClick={close} style={{
        position: "absolute", top: 14, right: 14,
        background: "none", border: "none", cursor: "pointer", color: "#888"
      }}>
        <X size={18} />
      </button>

      {step === "menu" && (
        <>
          <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
            Choisissez votre emplacement
          </p>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
            Pour voir les options de livraison disponibles
          </p>
          <div style={{
            background: "#F5F3FF", borderRadius: 10, padding: "12px 16px",
            marginBottom: 12, display: "flex", alignItems: "center", gap: 12
          }}>
            <span style={{ fontSize: 22 }}>{getFlag(selected.country_code)}</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                {selected.city ? `${selected.city}, ` : ""}{selected.country_name}
              </p>
              <p style={{ fontSize: 12, color: "#7C3AED", margin: 0 }}>
                {location.shipping_rate} - {location.delivery_days}
              </p>
            </div>
          </div>
          <button onClick={() => setStep("postal")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "12px 0", border: "none", background: "none",
            cursor: "pointer", borderTop: "1px solid #F0F0F0", textAlign: "left"
          }}>
            <MapPin size={16} style={{ color: "#7C3AED" }} />
            <span style={{ fontSize: 14, color: "#4F46E5", fontWeight: 500 }}>
              Entrer un code postal en France
            </span>
          </button>
          <button onClick={() => setStep("gps-confirm")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "12px 0", border: "none", background: "none",
            cursor: "pointer", borderTop: "1px solid #F0F0F0", textAlign: "left"
          }}>
            <Navigation size={16} style={{ color: "#7C3AED" }} />
            <span style={{ fontSize: 14, color: "#4F46E5", fontWeight: 500 }}>
              Utiliser mon emplacement actuel
            </span>
          </button>
          <button onClick={() => setStep("country")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "12px 0", border: "none", background: "none",
            cursor: "pointer", borderTop: "1px solid #F0F0F0", textAlign: "left"
          }}>
            <Globe size={16} style={{ color: "#7C3AED" }} />
            <span style={{ fontSize: 14, color: "#4F46E5", fontWeight: 500 }}>
              Livrer hors France metropolitaine
            </span>
          </button>
        </>
      )}

      {step === "gps-confirm" && (
        <>
          <button onClick={() => setStep("menu")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#4F46E5", fontSize: 13, marginBottom: 20, padding: 0
          }}>Retour</button>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#F5F3FF", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px"
            }}>
              <Navigation size={24} style={{ color: "#7C3AED" }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              Autoriser la localisation
            </p>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>
              OnDeal utilise votre position pour afficher les delais de livraison exacts.
            </p>
          </div>
          <div style={{
            background: "#F0FDF4", borderRadius: 8, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 8, marginBottom: 20
          }}>
            <Shield size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: "#16A34A", margin: 0 }}>
              Votre position n'est jamais stockee ni partagee.
            </p>
          </div>
          <button onClick={requestGPS} style={{
            width: "100%", background: "#4F46E5", color: "#fff",
            border: "none", borderRadius: 10, padding: "12px 0",
            fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10
          }}>
            Autoriser la localisation
          </button>
          <button onClick={() => setStep("postal")} style={{
            width: "100%", background: "none", color: "#4F46E5",
            border: "1px solid #E0E0E0", borderRadius: 10, padding: "10px 0",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}>
            Utiliser un code postal
          </button>
        </>
      )}

      {step === "gps-loading" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "3px solid #F0F0F0", borderTop: "3px solid #7C3AED",
            margin: "0 auto 16px",
            animation: "spin 0.8s linear infinite"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: 600, fontSize: 15 }}>Detection en cours...</p>
          <p style={{ fontSize: 13, color: "#888" }}>Veuillez autoriser la localisation</p>
        </div>
      )}

      {step === "postal" && (
        <>
          <button onClick={() => setStep("menu")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#4F46E5", fontSize: 13, marginBottom: 16, padding: 0
          }}>Retour</button>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Code postal France</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text" placeholder="Ex: 75001" maxLength={5}
              value={postalCode}
              onChange={e => setPostalCode(e.target.value.replace(/\D/g, ""))}
              style={{
                flex: 1, border: "1px solid #E0E0E0", borderRadius: 8,
                padding: "10px 14px", fontSize: 14, outline: "none"
              }}
              autoFocus
            />
            <button
              onClick={() => {
                if (postalCode.length === 5) {
                  const loc = { country_code: "FR", country_name: "France", city: "", ...LOCATION_CONFIG["FR"] };
                  setSelected({ country_name: "France", country_code: "FR", city: "" });
                  setLocation(loc);
                  close();
                }
              }}
              style={{
                background: "#4F46E5", color: "#fff", border: "none",
                borderRadius: 8, padding: "10px 18px", cursor: "pointer",
                fontSize: 14, fontWeight: 600
              }}
            >OK</button>
          </div>
        </>
      )}

      {step === "country" && (
        <>
          <button onClick={() => setStep("menu")} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#4F46E5", fontSize: 13, marginBottom: 16, padding: 0
          }}>Retour</button>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Livraison internationale</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {COUNTRIES.map(c => (
              <button key={c.code}
                onClick={() => {
                  const config = LOCATION_CONFIG[c.code] ?? {
                    currency: "EUR", currency_symbol: "€", rate: 1, ships_to: true,
                    shipping_rate: "19,90€", delivery_days: "A confirmer",
                  };
                  const loc = { country_code: c.code, country_name: c.name, city: "", ...config };
                  setSelected({ country_name: c.name, country_code: c.code, city: "" });
                  setLocation(loc);
                  close();
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", border: "none", borderRadius: 8,
                  background: selected.country_code === c.code ? "#F5F3FF" : "none",
                  cursor: "pointer", textAlign: "left",
                  fontWeight: selected.country_code === c.code ? 600 : 400,
                  color: selected.country_code === c.code ? "#4F46E5" : "#111"
                }}>
                <span style={{ fontSize: 18 }}>{getFlag(c.code)}</span>
                <span style={{ fontSize: 14 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 14, color: "#F59E0B", background: "none",
          border: "none", cursor: "pointer", fontWeight: 600,
          whiteSpace: "nowrap"
        }}
      >
        <MapPin size={13} />
        {getFlag(selected.country_code)}{" "}
        {selected.city ? `${selected.city}, ` : ""}
        {selected.country_name}
      </button>
      {typeof document !== "undefined" && popup
        ? createPortal(popup, document.body)
        : null}
    </>
  );
}
