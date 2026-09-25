"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ActorForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const nuevoActor = {
      name,
      photo,
      nationality,
      birthDate: new Date(
        birthDate + "T00:00:00.000Z"
      ).toISOString(),
      biography,
    };

    console.log("Enviando:", nuevoActor);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/actors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoActor),
        }
      );

      const texto = await response.text();

      console.log("Status:", response.status);
      console.log("Respuesta backend:", texto);

      if (!response.ok) {
        alert(
          "Error " +
            response.status +
            "\n\n" +
            texto
        );

        return;
      }

      alert("Actor creado correctamente");

      router.push("/actors");
      router.refresh();
    } catch (error) {
      console.error("Error de conexión:", error);

      alert(
        "No fue posible conectarse con el backend. Revisa la consola."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
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
          placeholder="https://..."
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
        disabled={loading}
      >
        {loading
          ? "Creando..."
          : "Crear actor"}
      </button>
    </form>
  );
}
