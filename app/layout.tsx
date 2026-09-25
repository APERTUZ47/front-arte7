import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineArte",
  description: "Administración de actores y películas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="navbar">
          <Link href="/" className="brand">
            <span className="brandIcon">◆</span>
            CineArte
          </Link>

          <nav>
            <Link href="/">Inicio</Link>
            <Link href="/actors">Actores</Link>
            <Link href="/movies">Películas</Link>
            <Link href="/movies/create" className="navPrimary">
              + Nueva película
            </Link>
          </nav>
        </header>

        {children}

        <footer>
          <span>CineArte</span>
          <span>ISIS3710 · Parcial 1</span>
        </footer>
      </body>
    </html>
  );
}
