"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import ActorList from "../../components/ActorList";

type Actor = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

export default function ActorsPage() {
  const [actors, setActors] =
    useState<Actor[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetch(
      "http://localhost:3000/api/v1/actors"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Error al obtener actores"
          );
        }

        return response.json();
      })
      .then((data) => {
        setActors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  async function handleDelete(
    id: string
  ) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este actor?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/actors/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo eliminar el actor"
        );
      }

      setActors((actorsActuales) =>
        actorsActuales.filter(
          (actor) =>
            actor.id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Ocurrió un error al eliminar el actor"
      );
    }
  }

  return (
    <main>
      <h1>Actores</h1>

      <Link href="/crear">
        Crear actor
      </Link>

      <hr />

      {loading ? (
        <p>Cargando actores...</p>
      ) : (
        <ActorList
          actors={actors}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
