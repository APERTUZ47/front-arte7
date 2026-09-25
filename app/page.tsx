"use client";

import { useEffect, useState } from "react";

type Actor = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/actors")
      .then((response) => response.json())
      .then((data) => {
        setActors(data);
      })
      .catch((error) => {
        console.error("Error al obtener actores:", error);
      });
  }, []);

  return (
    <main>
      <h1>Actores</h1>

      {actors.map((actor) => (
        <div key={actor.id}>
          <h2>{actor.name}</h2>
          <p>Nacionalidad: {actor.nationality}</p>
          <p>Fecha de nacimiento: {actor.birthDate}</p>
          <p>{actor.biography}</p>
        </div>
      ))}
    </main>
  );
}