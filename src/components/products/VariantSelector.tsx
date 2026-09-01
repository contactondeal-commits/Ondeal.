"use client";

import { useProductSelection } from "./ProductSelectionProvider";
import styles from "./VariantSelector.module.css";

// Mission "SÉLECTION DE TAILLE" (15/08/2026) — noms d'option réellement
// observés sur le catalogue Shopify pour la taille (vêtements : "Size" ;
// chaussures : "Taille", parfois fusionné avec la couleur en "Taille et
// coloris" ; enfants : "Suitable Age" / "Suitable For Height" — voir audit
// direct de l'API Storefront, DECISIONS.md). Sert uniquement à choisir une
// icône/étiquette adaptée à l'affichage — TOUTES les options (y compris
// Color/Style non listées ici) sont rendues et doivent être choisies pour
// résoudre une variante, que ce nom soit reconnu ou non.
const SIZE_OPTION_PATTERN = /taille|size|pointure|age|height|hauteur/i;

function isSizeLikeOption(name: string): boolean {
  return SIZE_OPTION_PATTERN.test(name);
}

export default function VariantSelector() {
  const { options, selectedOptions, setOption, isValueAvailable } = useProductSelection();

  if (options.length === 0) return null;

  return (
    <div className={styles.root}>
      {options.map((option) => (
        <div key={option.name} className={styles.group}>
          <span className={styles.label}>
            {option.name}
            {isSizeLikeOption(option.name) && selectedOptions[option.name] && (
              <span className={styles.selectedValue}> : {selectedOptions[option.name]}</span>
            )}
          </span>
          <div className={styles.values} role="group" aria-label={option.name}>
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isValueAvailable(option.name, value);
              return (
                <button
                  key={value}
                  type="button"
                  className={`${styles.chip} ${isSelected ? styles.chipSelected : ""} ${
                    !isAvailable ? styles.chipUnavailable : ""
                  }`}
                  aria-pressed={isSelected}
                  aria-label={!isAvailable ? `${value} (indisponible dans cette combinaison)` : value}
                  onClick={() => setOption(option.name, value)}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
