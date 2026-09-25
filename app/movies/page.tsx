"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type Actor = {
  id: string;
  name: string;
};

type Prize = {
  id: string;
  name: string;
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
};

type MovieWithPrizes = Movie & {
  prizes: Prize[];
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieWithPrizes[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);

        const movieData = await api<Movie[]>("/movies");

        const completeData = await Promise.all(
          movieData.map(async (movie) => {
            try {
              const prizes = await api<Prize[]>(
                `/movies/${movie.id}/prizes`
              );

              return {
                ...movie,
                prizes,
              };
            } catch {
              return {
                ...movie,
                prizes: [],
              };
            }
          })
        );

        setMovies(completeData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error cargando películas"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) return movies;

    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(text)
    );
  }, [movies, search]);

  return (
    <main className="container page">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">COLECCIÓN</span>
          <h1>Películas</h1>
          <p>
            Descubre las películas disponibles, sus protagonistas y premios.
          </p>
        </div>

        <Link href="/movies/create" className="button primary">
          + Nueva película
        </Link>
      </div>

      <div className="toolbar">
        <div className="searchBox">
          <span>⌕</span>
          <input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="resultCount">
          {filteredMovies.length} películas
        </span>
      </div>

      {error && <div className="errorBox">{error}</div>}

      {loading ? (
        <div className="emptyState">Cargando películas...</div>
      ) : filteredMovies.length === 0 ? (
        <div className="emptyState">
          No se encontraron películas.
        </div>
      ) : (
        <div className="movieGrid">
          {filteredMovies.map((movie) => (
            <article className="movieCard" key={movie.id}>
              <Link
                href={`/movies/${movie.id}`}
                className="posterWrapper"
              >
                <img src={movie.poster} alt={movie.title} />

                <div className="posterOverlay">
                  <span>Ver detalles →</span>
                </div>
              </Link>

              <div className="movieContent">
                <div className="movieTopline">
                  <span>{movie.country}</span>
                  <span>
                    {new Date(movie.releaseDate).getFullYear()}
                  </span>
                </div>

                <h2>{movie.title}</h2>

                <div className="movieInfo">
                  <div>
                    <span>ACTOR PRINCIPAL</span>
                    <strong>
                      {movie.actors?.[0]?.name || "Sin actor"}
                    </strong>
                  </div>

                  <div>
                    <span>PREMIO</span>
                    <strong>
                      {movie.prizes?.[0]?.name || "Sin premio"}
                    </strong>
                  </div>
                </div>

                <Link
                  href={`/movies/${movie.id}`}
                  className="detailLink"
                >
                  Ver ficha completa
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
