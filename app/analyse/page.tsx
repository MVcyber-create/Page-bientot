"use client";

import { useState } from "react";

export default function Analyse() {
  const [lignes, setLignes] = useState<number | null>(null);

  async function lire(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    const texte = await fichier.text();
    setLignes(texte.split("\n").filter((l) => l.trim() !== "").length);
  }

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "32px 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30 }}>
        Dépose ton relevé
      </h1>
      <p>
        Ton fichier est lu sur ton téléphone. Il n’est envoyé nulle part.
      </p>
      <input type="file" accept=".csv,text/csv" onChange={lire} />
      {lignes !== null && (
        <p style={{ marginTop: 24, fontWeight: 700 }}>
          Fichier lu : {lignes} lignes trouvées.
        </p>
      )}
    </main>
  );
}
