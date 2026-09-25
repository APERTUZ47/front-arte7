import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="heroContent">
          <span className="eyebrow">GESTIÓN CINEMATOGRÁFICA</span>

          <h1>
            Todo el cine.
            <br />
            <span>En un solo lugar.</span>
          </h1>

          <p>
            Administra actores, películas y reconocimientos desde una
            experiencia rápida y sencilla.
          </p>

          <div className="heroActions">
            <Link href="/movies" className="button primary">
              Explorar películas
            </Link>

            <Link href="/movies/create" className="button secondary">
              + Registrar película
            </Link>
          </div>
        </div>

        <div className="heroVisual">
          <div className="movieSymbol">▶</div>
          <div className="visualText">
            <strong>CINE</strong>
            <span>COLLECTION</span>
          </div>
        </div>
      </section>

      <section className="container dashboardSection">
        <div className="sectionHeading">
          <div>
            <span className="eyebrow">ADMINISTRACIÓN</span>
            <h2>¿Qué quieres hacer?</h2>
          </div>
        </div>

        <div className="featureGrid">
          <Link href="/actors" className="featureCard">
            <div className="featureIcon">♟</div>
            <div>
              <span className="cardNumber">01</span>
              <h3>Actores</h3>
              <p>
                Consulta, registra, actualiza y elimina actores de la plataforma.
              </p>
              <span className="textLink">Administrar actores →</span>
            </div>
          </Link>

          <Link href="/movies" className="featureCard">
            <div className="featureIcon">▣</div>
            <div>
              <span className="cardNumber">02</span>
              <h3>Películas</h3>
              <p>
                Explora las películas con sus actores y premios asociados.
              </p>
              <span className="textLink">Ver colección →</span>
            </div>
          </Link>

          <Link href="/movies/create" className="featureCard accentCard">
            <div className="featureIcon">＋</div>
            <div>
              <span className="cardNumber">03</span>
              <h3>Nueva película</h3>
              <p>
                Registra una película junto a su actor principal y reconocimiento.
              </p>
              <span className="textLink">Comenzar registro →</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
