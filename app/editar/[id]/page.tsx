"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditarActorPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarActor() {
      try {
        console.log("Cargando actor con id:", id);

        const response = await fetch(
          `http://localhost:3000/api/v1/actors/${id}`
        );

        console.log("GET actor status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Error ${response.status} al cargar actor`
          );
        }

        const actor = await response.json();

        console.log("Actor recibido:", actor);

        setName(actor.name || "");
        setPhoto(actor.photo || "");
        setNationality(actor.nationality || "");

        if (actor.birthDate) {
          setBirthDate(
            actor.birthDate.substring(0, 10)
          );
        }

        setBiography(actor.biography || "");
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el actor.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      cargarActor();
    }
  }, [id]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);

    const actorActualizado = {
      name,
      photo,
      nationality,
      birthDate: new Date(
        birthDate + "T00:00:00.000Z"
      ).toISOString(),
      biography,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/actors/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actorActualizado),
        }
      );

      const texto = await response.text();

      console.log("PUT status:", response.status);
      console.log("PUT respuesta:", texto);

      if (!response.ok) {
        alert(
          `Error ${response.status}\n\n${texto}`
        );
        return;
      }

      alert("Actor actualizado correctamente");

      router.push("/actors");
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo actualizar el actor."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main>
        <h1>Editar Actor</h1>
        <p>Cargando actor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p>{error}</p>

        <Link href="/actors">
          Volver a actores
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Editar Actor</h1>

      <Link href="/actors">
        Volver a actores
      </Link>

      <hr />

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Foto</label>

          <input
            type="url"
            value={photo}
            onChange={(event) =>
              setPhoto(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Nacionalidad</label>

          <input
            type="text"
            value={nationality}
            onChange={(event) =>
              setNationality(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Fecha de nacimiento</label>

          <input
            type="date"
            value={birthDate}
            onChange={(event) =>
              setBirthDate(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Biografía</label>

          <textarea
            value={biography}
            onChange={(event) =>
              setBiography(event.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}
