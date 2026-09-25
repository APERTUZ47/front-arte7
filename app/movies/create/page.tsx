"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

type Entity = {
  id: string;
  name?: string;
  type?: string;
  title?: string;
  url?: string;
};

type Created = {
  id: string;
};

export default function CreateMoviePage() {
  const router = useRouter();

  const [genres, setGenres] = useState<Entity[]>([]);
  const [directors, setDirectors] = useState<Entity[]>([]);
  const [trailers, setTrailers] = useState<Entity[]>([]);

  const [genreId, setGenreId] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [trailerId, setTrailerId] = useState("");

  const [movie, setMovie] = useState({
    title: "",
    poster: "",
    duration: "",
    country: "",
    releaseDate: "",
    popularity: "",
  });

  const [actor, setActor] = useState({
    name: "",
    photo: "",
    nationality: "",
    birthDate: "",
    biography: "",
  });

  const [prize, setPrize] = useState({
    name: "",
    category: "",
    year: String(new Date().getFullYear()),
    status: "won",
  });

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [genreData, directorData, trailerData] = await Promise.all([
          api<Entity[]>("/genres"),
          api<Entity[]>("/directors"),
          api<Entity[]>("/youtube-trailers"),
        ]);

        setGenres(genreData);
        setDirectors(directorData);
        setTrailers(trailerData);

        if (genreData[0]) setGenreId(genreData[0].id);
        if (directorData[0]) setDirectorId(directorData[0].id);
        if (trailerData[0]) setTrailerId(trailerData[0].id);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar datos auxiliares."
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!genreId || !directorId || !trailerId) {
      setError(
        "El backend necesita al menos un género, director y trailer existentes."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      setProgress("1/5 Creando actor principal...");

      const createdActor = await api<Created>("/actors", {
        method: "POST",
        body: JSON.stringify({
          ...actor,
          birthDate: new Date(actor.birthDate).toISOString(),
        }),
      });

      setProgress("2/5 Creando premio...");

      const createdPrize = await api<Created>("/prizes", {
        method: "POST",
        body: JSON.stringify({
          ...prize,
          year: Number(prize.year),
        }),
      });
setProgress("3/6 Creando trailer auxiliar...");

const createdTrailer = await api<Created>("/youtube-trailers", {
  method: "POST",
  body: JSON.stringify({
    name: `Trailer de ${movie.title}`,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: 120,
    channel: "CineArte",
  }),
});
      setProgress("4/6 Creando película...");

      const createdMovie = await api<Created>("/movies", {
        method: "POST",
        body: JSON.stringify({
          title: movie.title,
          poster: movie.poster,
          duration: Number(movie.duration),
          country: movie.country,
          releaseDate: new Date(movie.releaseDate).toISOString(),
          popularity: Number(movie.popularity),
          genre: {
            id: genreId,
          },
          director: {
            id: directorId,
          },
          youtubeTrailer: {
  id: createdTrailer.id,
},
        }),
      });

      setProgress("5/6 Asociando actor con película...");

      await api(
        `/actors/${createdActor.id}/movies/${createdMovie.id}`,
        {
          method: "POST",
        }
      );

      setProgress("6/6 Asociando premio con película...");

      await api(
        `/movies/${createdMovie.id}/prizes/${createdPrize.id}`,
        {
          method: "POST",
        }
      );

      setProgress("¡Película creada correctamente!");

      router.push(`/movies/${createdMovie.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible crear la película"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container page">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">NUEVO REGISTRO</span>
          <h1>Crear película</h1>
          <p>
            Registra la película, su actor principal y un reconocimiento.
          </p>
        </div>
      </div>

      {loadingOptions && (
        <div className="infoBox">Cargando datos del backend...</div>
      )}

      <form onSubmit={handleSubmit} className="multiForm">
        <section className="formCard">
          <div className="formTitle">
            <div className="stepNumber">01</div>
            <div>
              <span className="eyebrow">PELÍCULA</span>
              <h2>Información principal</h2>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Título
              <input
                required
                value={movie.title}
                onChange={(e) =>
                  setMovie({ ...movie, title: e.target.value })
                }
                placeholder="Ej. Interstellar"
              />
            </label>

            <label>
              País
              <input
                required
                value={movie.country}
                onChange={(e) =>
                  setMovie({ ...movie, country: e.target.value })
                }
                placeholder="Ej. Estados Unidos"
              />
            </label>

            <label>
              Fecha de lanzamiento
              <input
                required
                type="date"
                value={movie.releaseDate}
                onChange={(e) =>
                  setMovie({
                    ...movie,
                    releaseDate: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Duración (minutos)
              <input
                required
                min="1"
                type="number"
                value={movie.duration}
                onChange={(e) =>
                  setMovie({
                    ...movie,
                    duration: e.target.value,
                  })
                }
                placeholder="169"
              />
            </label>

            <label>
              Popularidad
              <input
                required
                min="0"
                type="number"
                value={movie.popularity}
                onChange={(e) =>
                  setMovie({
                    ...movie,
                    popularity: e.target.value,
                  })
                }
                placeholder="95"
              />
            </label>

            <label>
              URL del póster
              <input
                required
                type="url"
                value={movie.poster}
                onChange={(e) =>
                  setMovie({
                    ...movie,
                    poster: e.target.value,
                  })
                }
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="subFormTitle">
            Datos requeridos por el backend
          </div>

          <div className="formGrid formGridThree">
            <label>
              Género
              <select
                required
                value={genreId}
                onChange={(e) => setGenreId(e.target.value)}
              >
                {genres.map((genre, index) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.type || genre.name || `Género ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Director
              <select
                required
                value={directorId}
                onChange={(e) => setDirectorId(e.target.value)}
              >
                {directors.map((director, index) => (
                  <option key={director.id} value={director.id}>
                    {director.name || `Director ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Trailer
              <select
                required
                value={trailerId}
                onChange={(e) => setTrailerId(e.target.value)}
              >
                {trailers.map((trailer, index) => (
                  <option key={trailer.id} value={trailer.id}>
                    {trailer.title ||
                      trailer.url ||
                      `Trailer ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="formCard">
          <div className="formTitle">
            <div className="stepNumber">02</div>
            <div>
              <span className="eyebrow">ACTOR PRINCIPAL</span>
              <h2>Información del actor</h2>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Nombre
              <input
                required
                value={actor.name}
                onChange={(e) =>
                  setActor({
                    ...actor,
                    name: e.target.value,
                  })
                }
                placeholder="Ej. Matthew McConaughey"
              />
            </label>

            <label>
              Nacionalidad
              <input
                required
                value={actor.nationality}
                onChange={(e) =>
                  setActor({
                    ...actor,
                    nationality: e.target.value,
                  })
                }
                placeholder="Ej. Estadounidense"
              />
            </label>

            <label>
              Fecha de nacimiento
              <input
                required
                type="date"
                value={actor.birthDate}
                onChange={(e) =>
                  setActor({
                    ...actor,
                    birthDate: e.target.value,
                  })
                }
              />
            </label>

            <label>
              URL fotografía
              <input
                required
                type="url"
                value={actor.photo}
                onChange={(e) =>
                  setActor({
                    ...actor,
                    photo: e.target.value,
                  })
                }
                placeholder="https://..."
              />
            </label>

            <label className="fullWidth">
              Biografía
              <textarea
                required
                value={actor.biography}
                onChange={(e) =>
                  setActor({
                    ...actor,
                    biography: e.target.value,
                  })
                }
                placeholder="Breve biografía..."
              />
            </label>
          </div>
        </section>

        <section className="formCard">
          <div className="formTitle">
            <div className="stepNumber">03</div>
            <div>
              <span className="eyebrow">RECONOCIMIENTO</span>
              <h2>Premio de la película</h2>
            </div>
          </div>

          <div className="formGrid">
            <label>
              Nombre del premio
              <input
                required
                value={prize.name}
                onChange={(e) =>
                  setPrize({
                    ...prize,
                    name: e.target.value,
                  })
                }
                placeholder="Ej. Academy Awards"
              />
            </label>

            <label>
              Categoría
              <input
                required
                value={prize.category}
                onChange={(e) =>
                  setPrize({
                    ...prize,
                    category: e.target.value,
                  })
                }
                placeholder="Ej. Best Picture"
              />
            </label>

            <label>
              Año
              <input
                required
                type="number"
                value={prize.year}
                onChange={(e) =>
                  setPrize({
                    ...prize,
                    year: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Estado
              <select
                value={prize.status}
                onChange={(e) =>
                  setPrize({
                    ...prize,
                    status: e.target.value,
                  })
                }
              >
                <option value="won">Ganador</option>
                <option value="nominated">Nominado</option>
              </select>
            </label>
          </div>
        </section>

        {error && <div className="errorBox">{error}</div>}

        {progress && <div className="successBox">{progress}</div>}

        <div className="submitPanel">
          <div>
            <strong>¿Todo listo?</strong>
            <span>
              Las entidades se crearán por separado y después se asociarán.
            </span>
          </div>

          <button
            className="button primary large"
            disabled={saving || loadingOptions}
            type="submit"
          >
            {saving ? "Creando..." : "Crear película completa →"}
          </button>
        </div>
      </form>
    </main>
  );
}

