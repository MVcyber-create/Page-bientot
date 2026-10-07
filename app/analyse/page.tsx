"use client";

import { useState } from "react";
import { detecterFantomes, type Fantome } from "../lib/detection";

const bleu = "#14213D";
const orange = "#E4572E";

const euro = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export default function Analyse() {
  const [fantomes, setFantomes] = useState<Fantome[] | null>(null);
  const [erreur, setErreur] = useState("");

  async function lire(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setErreur("");
    setFantomes(null);
    const resultat = detecterFantomes(await fichier.text());
    if (resultat === null) {
      setErreur(
        "Ce fichier ne ressemble pas à un relevé CSV. Vérifie que tu as bien exporté le CSV de ta banque."
      );
      return;
    }
    setFantomes(resultat);
  }

  const total = fantomes?.reduce((s, f) => s + f.annuel, 0) ?? 0;

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "32px 20px 60px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <h1
        style={{ fontFamily: "Georgia, serif", fontSize: 30, margin: "0 0 8px" }}
      >
        Dépose ton relevé
      </h1>
      <p style={{ margin: "0 0 20px" }}>
        Ton fichier est lu sur ton téléphone. Il n’est envoyé nulle part.
      </p>
      <input type="file" accept=".csv,text/csv" onChange={lire} />

      {erreur && <p style={{ color: orange, fontWeight: 700 }}>{erreur}</p>}

      {fantomes && fantomes.length === 0 && (
        <p style={{ marginTop: 24, fontWeight: 700 }}>
          Aucun prélèvement régulier trouvé. Essaie avec un relevé qui couvre
          au moins trois mois.
        </p>
      )}

      {fantomes && fantomes.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <p style={{ margin: 0 }}>
            {fantomes.length} prélèvements réguliers trouvés
          </p>
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 40,
              color: orange,
              margin: "4px 0 20px",
              fontWeight: 700,
            }}
          >
            {euro(total)} par an
          </p>

          {fantomes.map((f, i) => {
            const verrouille = i >= 2;
            return (
              <div
                key={f.nom + i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 0",
                  borderTop: `1px solid ${bleu}22`,
                  filter: verrouille ? "blur(6px)" : "none",
                  userSelect: verrouille ? "none" : "auto",
                }}
                aria-hidden={verrouille}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{f.nom}</div>
                  <div style={{ fontSize: 14 }}>
                    {euro(f.mensuel)} par mois, vu {f.fois} fois
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontWeight: 700,
                    color: orange,
                    whiteSpace: "nowrap",
                  }}
                >
                  {euro(f.annuel)} / an
                </div>
              </div>
            );
          })}

          {fantomes.length > 2 && (
            <p style={{ marginTop: 16, fontWeight: 700 }}>
              Les {fantomes.length - 2} autres et les lettres de résiliation
              sont verrouillés.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
