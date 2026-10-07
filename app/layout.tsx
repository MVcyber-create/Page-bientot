import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Fantômes — Débusque les abonnements que tu paies sans t'en servir",
  description:
    "Dépose ton relevé bancaire : on repère les prélèvements oubliés et on te donne la lettre pour les résilier.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#FAF6EF", color: "#14213D" }}>
        {children}
      </body>
    </html>
  );
}
