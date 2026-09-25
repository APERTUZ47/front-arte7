import Link from "next/link";

export default function Home() {
  return (
    <main className="home-container">
      <div className="home-card">
        <h1>Actor Manager</h1>

        <p>
          Aplicación CRUD desarrollada con Next.js
          para administrar actores de forma sencilla.
        </p>

        <div className="home-actions">
          <Link
            href="/actors"
            className="primary-button"
          >
            Ver actores
          </Link>

          <Link
            href="/crear"
            className="secondary-button"
          >
            Crear actor
          </Link>
        </div>
      </div>
    </main>
  );
}
