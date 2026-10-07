const bleu = "#14213D";
const orange = "#E4572E";

const benefices = [
  "Dépose ton relevé : on repère les prélèvements qui reviennent chaque mois.",
  "Tu vois chaque abonnement classé par ce qu’il te coûte par an.",
  "Une lettre de résiliation est prête pour chacun, il ne reste qu’à l’envoyer.",
];

export default function Accueil() {
  return (
    <main
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "32px 20px 120px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <p style={{ color: orange, fontWeight: 700, margin: 0 }}>FANTÔMES</p>

      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 36,
          lineHeight: 1.1,
          margin: "12px 0 16px",
        }}
      >
        Débusque les abonnements que tu paies sans t’en servir.
      </h1>

      <p style={{ fontSize: 18, margin: "0 0 28px" }}>
        Un abonnement oublié à 9,99 € par mois, c’est{" "}
        <strong style={{ color: orange }}>120 € par an</strong> qui partent
        sans que tu le voies.
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {benefices.map((texte) => (
          <li
            key={texte}
            style={{
              padding: "14px 0",
              borderTop: `1px solid ${bleu}22`,
              fontSize: 17,
            }}
          >
            {texte}
          </li>
        ))}
      </ul>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "12px 20px calc(12px + env(safe-area-inset-bottom))",
          background: "#FAF6EF",
          borderTop: `1px solid ${bleu}22`,
        }}
      >
        <a
          href="#"
          style={{
            display: "block",
            maxWidth: 520,
            margin: "0 auto",
            padding: "16px",
            textAlign: "center",
            background: orange,
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 12,
            textDecoration: "none",
          }}
        >
          Commencer, c’est gratuit
        </a>
      </div>
    </main>
  );
}
