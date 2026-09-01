"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface LocationData {
  country_code: string;
  country_name: string;
  city?: string;
  postal_code?: string;
  currency: string;
  currency_symbol: string;
  rate: number;
  ships_to: boolean;
  shipping_rate: string;
  delivery_days: string;
}

export const LOCATION_CONFIG: Record<string, Omit<LocationData, "country_code" | "country_name" | "city" | "postal_code" | "rate">> = {
  FR: { currency: "EUR", currency_symbol: "EUR", ships_to: true, shipping_rate: "4,90EUR (gratuit des 80EUR)", delivery_days: "2-5 jours ouvrés" },
  BE: { currency: "EUR", currency_symbol: "EUR", ships_to: true, shipping_rate: "4,99EUR", delivery_days: "4-7 jours ouvrés" },
  LU: { currency: "EUR", currency_symbol: "EUR", ships_to: true, shipping_rate: "4,99EUR", delivery_days: "4-7 jours ouvrés" },
  DE: { currency: "EUR", currency_symbol: "EUR", ships_to: true, shipping_rate: "4,99EUR", delivery_days: "4-7 jours ouvrés" },
  ES: { currency: "EUR", currency_symbol: "EUR", ships_to: true, shipping_rate: "4,99EUR", delivery_days: "4-7 jours ouvrés" },
  IT: { currency: "EUR", currency_symbol: "EUR", ships_to: true, shipping_rate: "4,99EUR", delivery_days: "4-7 jours ouvrés" },
  CH: { currency: "CHF", currency_symbol: "CHF", ships_to: true, shipping_rate: "4,99EUR", delivery_days: "4-7 jours ouvrés" },
  GB: { currency: "GBP", currency_symbol: "GBP", ships_to: true, shipping_rate: "29,90EUR", delivery_days: "7-14 jours ouvrés" },
  US: { currency: "USD", currency_symbol: "USD", ships_to: true, shipping_rate: "29,90EUR", delivery_days: "10-20 jours ouvrés" },
  CA: { currency: "CAD", currency_symbol: "CAD", ships_to: true, shipping_rate: "29,90EUR", delivery_days: "10-20 jours ouvrés" },
  MA: { currency: "MAD", currency_symbol: "MAD", ships_to: true, shipping_rate: "19,90EUR", delivery_days: "A confirmer avec le transporteur" },
  DZ: { currency: "DZD", currency_symbol: "DZD", ships_to: true, shipping_rate: "19,90EUR", delivery_days: "A confirmer avec le transporteur" },
  TN: { currency: "TND", currency_symbol: "TND", ships_to: true, shipping_rate: "19,90EUR", delivery_days: "A confirmer avec le transporteur" },
  SN: { currency: "XOF", currency_symbol: "FCFA", ships_to: true, shipping_rate: "29,90EUR", delivery_days: "A confirmer avec le transporteur" },
  CI: { currency: "XOF", currency_symbol: "FCFA", ships_to: true, shipping_rate: "29,90EUR", delivery_days: "A confirmer avec le transporteur" },
};

const FALLBACK_RATES: Record<string, number> = {
  EUR: 1, CHF: 0.97, GBP: 0.86, USD: 1.08, CAD: 1.47,
  MAD: 10.8, DZD: 146, TND: 3.3, XOF: 655,
};

const DEFAULT: LocationData = {
  country_code: "FR", country_name: "France", city: "",
  currency: "EUR", currency_symbol: "EUR", rate: 1, ships_to: true,
  shipping_rate: "4,90EUR", delivery_days: "2-5 jours ouvrés",
};

const RATES_KEY = "ondeal_rates";
const RATES_TTL = 6 * 60 * 60 * 1000;

async function fetchRates(): Promise<Record<string, number>> {
  try {
    const cached = localStorage.getItem(RATES_KEY);
    if (cached) {
      const { ts, rates } = JSON.parse(cached);
      if (Date.now() - ts < RATES_TTL) return rates;
    }
    const res = await fetch("https://open.er-api.com/v6/latest/EUR");
    const data = await res.json();
    if (data.result === "success") {
      localStorage.setItem(RATES_KEY, JSON.stringify({ ts: Date.now(), rates: data.rates }));
      return data.rates;
    }
  } catch {}
  return FALLBACK_RATES;
}

interface LocationContextType {
  location: LocationData;
  setLocation: (data: LocationData) => void;
  formatPrice: (priceEUR: number) => string;
}

const LocationContext = createContext<LocationContextType>({
  location: DEFAULT,
  setLocation: () => {},
  formatPrice: (p) => `${p.toFixed(2)} EUR`,
});

const STORAGE_KEY = "ondeal_location";

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationData>(DEFAULT);

  useEffect(() => {
    async function init() {
      const rates = await fetchRates();

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const loc = JSON.parse(saved);
          loc.rate = rates[loc.currency] ?? FALLBACK_RATES[loc.currency] ?? 1;
          setLocationState(loc);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
          return;
        }
      } catch {}

      try {
        const d = await fetch("https://ipapi.co/json/").then(r => r.json());
        const code = d.country_code as string;
        const config = LOCATION_CONFIG[code] ?? {
          currency: "EUR", currency_symbol: "EUR", ships_to: true,
          shipping_rate: "19,90EUR", delivery_days: "A confirmer",
        };
        const rate = rates[config.currency] ?? FALLBACK_RATES[config.currency] ?? 1;
        const loc: LocationData = {
          country_code: code, country_name: d.country_name, city: d.city,
          ...config, rate,
        };
        setLocationState(loc);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
      } catch {}
    }
    init();
  }, []);

  const setLocation = (data: LocationData) => {
    fetchRates().then(rates => {
      const rate = rates[data.currency] ?? FALLBACK_RATES[data.currency] ?? 1;
      const loc = { ...data, rate };
      setLocationState(loc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    });
  };

  const formatPrice = (priceEUR: number) => {
    const converted = priceEUR * location.rate;
    return `${converted.toFixed(2)} ${location.currency_symbol}`;
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, formatPrice }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
