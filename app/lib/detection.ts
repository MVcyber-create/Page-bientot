export type Fantome = {
  nom: string;
  mensuel: number;
  annuel: number;
  fois: number;
  derniere: string;
};

const normaliser = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function lireCsv(texte: string): string[][] {
  const t = texte.replace(/^\uFEFF/, "");
  const premiere = t.split("\n")[0] ?? "";
  const sep =
    premiere.split(";").length > premiere.split(",").length ? ";" : ",";
  const lignes: string[][] = [];
  let ligne: string[] = [];
  let champ = "";
  let guillemets = false;
  const finLigne = () => {
    ligne.push(champ);
    champ = "";
    if (ligne.some((x) => x.trim() !== "")) lignes.push(ligne);
    ligne = [];
  };
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (guillemets) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          champ += '"';
          i++;
        } else guillemets = false;
      } else champ += c;
    } else if (c === '"') guillemets = true;
    else if (c === sep) {
      ligne.push(champ);
      champ = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      finLigne();
    } else champ += c;
  }
  finLigne();
  return lignes;
}

function mediane(valeurs: number[]): number {
  const v = [...valeurs].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

function jour(valeur: string): number | null {
  let m = valeur.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000;
  m = valeur.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return Date.UTC(+m[3], +m[2] - 1, +m[1]) / 86400000;
  return null;
}

const iso = (j: number) => new Date(j * 86400000).toISOString();

export function detecterFantomes(texte: string): Fantome[] | null {
  const lignes = lireCsv(texte);
  if (lignes.length < 2) return null;
  const entetes = lignes[0].map(normaliser);
  const trouver = (...motifs: string[]) =>
    entetes.findIndex((h) => motifs.some((m) => h.includes(m)));
  const iDate = trouver("date");
  const iDesc = trouver("descr");
  const iMontant = trouver("montant", "amount");
  const iType = entetes.findIndex((h) => h === "type");
  const iEtat = trouver("tat", "state");
  const iDevise = trouver("devise", "currency");
  if (iDate < 0 || iDesc < 0 || iMontant < 0) return null;

  const groupes = new Map<
    string,
    { nom: string; ops: { jour: number; montant: number }[] }
  >();

  for (const l of lignes.slice(1)) {
    const montant = parseFloat(
      (l[iMontant] ?? "").replace(/\s/g, "").replace(",", ".")
    );
    const j = jour(l[iDate] ?? "");
    const desc = (l[iDesc] ?? "").trim();
    if (!(montant < 0) || j === null || !desc) continue;
    if (
      iType >= 0 &&
      /virement|transfert|transfer|recharg|topup|change|exchange|retrait|atm/.test(
        normaliser(l[iType] ?? "")
      )
    )
      continue;
    if (/^(virement|transfert|transfer|vers |to )/.test(normaliser(desc)))
      continue;

    if (
      iEtat >= 0 &&
      /annul|refus|revert|rejet|declin|fail|attente|pending/.test(
        normaliser(l[iEtat] ?? "")
      )
    )
      continue;
    if (iDevise >= 0 && (l[iDevise] ?? "").trim().toUpperCase() !== "EUR")
      continue;
    const cle = normaliser(desc)
      .replace(/[^a-z]+/g, " ")
      .trim()
      .split(" ")
      .slice(0, 2)
      .join(" ");
    if (!cle) continue;
    const g = groupes.get(cle) ?? { nom: desc, ops: [] };
    g.ops.push({ jour: j, montant });
    groupes.set(cle, g);
  }

  const fantomes: Fantome[] = [];
  for (const { nom, ops } of groupes.values()) {
    if (ops.length < 3) continue;
    const med = mediane(ops.map((o) => Math.abs(o.montant)));
    const tolerance = Math.max(0.3, med * 0.03);
    const stables = ops
      .filter((o) => Math.abs(Math.abs(o.montant) - med) <= tolerance)
      .sort((a, b) => a.jour - b.jour);
    if (stables.length < 3) continue;
    const mois = new Set(stables.map((o) => iso(o.jour).slice(0, 7)));
    if (mois.size < 3) continue;
    const ecarts = stables.slice(1).map((o, i) => o.jour - stables[i].jour);
    const ecart = mediane(ecarts);
    if (ecart < 26 || ecart > 35) continue;
    fantomes.push({
      nom,
      mensuel: Math.round(med * 100) / 100,
      annuel: Math.round(med * 1200) / 100,
      fois: stables.length,
      derniere: iso(stables[stables.length - 1].jour).slice(0, 10),
    });
  }
  return fantomes.sort((a, b) => b.annuel - a.annuel);
}
