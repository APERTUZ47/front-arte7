"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Actor = {
  id: string;
  name: string;
  photo?: string;
  nationality?: string;
};

type Prize = {
  id: string;
  name: string;
  category: string;
  year: number;
  status: string;
};

type NamedEntity = {
  id?: string;
  name?: string;
  type?: string;
};

type Trailer = {
  id?: string;
  url?: string;
  name?: string;
};

type Movie = {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  actors?: Actor[];
  director?: NamedEntity;
  genre?: NamedEntity;
  platforms?: NamedEntity[];
  reviews?: unknown[];
  youtubeTrailer?: Trailer;
};

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovie() {
      try {
        const [movieData, prizeData] = await Promise.all([
          api<Movie>(`/movies/${id}`),
          api<Prize[]>(`/movies/${id}/prizes`),
        ]);

        setMovie(movieData);
        setPrizes(prizeData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error cargando película"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadMovie();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="container page">
        <div className="emptyState">Cargando película...</div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="container page">
        <div className="errorBox">
          {error || "Película no encontrada"}
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="detailHero">
        <div className="container detailLayout">
          <div className="detailPoster">
            <img src={movie.poster} alt={movie.title} />
          </div>

          <div className="detailMain">
            <Link href="/movies" className="backLink">
              ← Volver a películas
            </Link>

            <span className="eyebrow">
              {movie.country} ·{" "}
              {new Date(movie.releaseDate).getFullYear()}
            </span>

            <h1>{movie.title}</h1>

            <div className="detailTags">
              <span>{movie.duration} min</span>
              <span>
                {movie.genre?.type || movie.genre?.name || "Sin género"}
              </span>
              <span>
                Popularidad {movie.popularity}
              </span>
            </div>

            <div className="detailStats">
              <div>
                <span>ESTRENO</span>
                <strong>
                  {new Date(movie.releaseDate).toLocaleDateString(
                    "es-CO"
                  )}
                </strong>
              </div>

              <div>
                <span>DIRECTOR</span>
                <strong>
                  {movie.director?.name || "No registrado"}
                </strong>
              </div>

              <div>
                <span>RESEÑAS</span>
                <strong>{movie.reviews?.length || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container detailSections">
        <section className="detailSection">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">REPARTO</span>
              <h2>Actores</h2>
            </div>
          </div>

          {!movie.actors || movie.actors.length === 0 ? (
            <div className="emptyState">No hay actores asociados.</div>
          ) : (
            <div className="castGrid">
              {movie.actors.map((actor) => (
                <article className="castCard" key={actor.id}>
                  {actor.photo ? (
                    <img src={actor.photo} alt={actor.name} />
                  ) : (
                    <div className="castPlaceholder">♟</div>
                  )}

                  <div>
                    <strong>{actor.name}</strong>
                    <span>
                      {actor.nationality || "Actor"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="detailSection">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">RECONOCIMIENTOS</span>
              <h2>Premios</h2>
            </div>
          </div>

          {prizes.length === 0 ? (
            <div className="emptyState">Sin premios asociados.</div>
          ) : (
            <div className="prizeGrid">
              {prizes.map((prize) => (
                <article className="prizeCard" key={prize.id}>
                  <div className="trophy">★</div>

                  <div>
                    <span className="miniLabel">
                      {prize.year} ·{" "}
                      {prize.status === "won"
                        ? "GANADOR"
                        : "NOMINADO"}
                    </span>

                    <h3>{prize.name}</h3>
                    <p>{prize.category}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="detailSection">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">INFORMACIÓN</span>
              <h2>Ficha técnica</h2>
            </div>
          </div>

          <div className="technicalGrid">
            <div>
              <span>ID</span>
              <strong>{movie.id}</strong>
            </div>

            <div>
              <span>Título</span>
              <strong>{movie.title}</strong>
            </div>

            <div>
              <span>País</span>
              <strong>{movie.country}</strong>
            </div>

            <div>
              <span>Duración</span>
              <strong>{movie.duration} minutos</strong>
            </div>

            <div>
              <span>Popularidad</span>
              <strong>{movie.popularity}</strong>
            </div>

            <div>
              <span>Género</span>
              <strong>
                {movie.genre?.type || movie.genre?.name || "No registrado"}
              </strong>
            </div>

            <div>
              <span>Director</span>
              <strong>
                {movie.director?.name || "No registrado"}
              </strong>
            </div>

            <div>
              <span>Plataformas</span>
              <strong>
                {movie.platforms?.map((p) => p.name).join(", ") ||
                  "No registradas"}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

