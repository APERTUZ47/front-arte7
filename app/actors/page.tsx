"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";

type Actor = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

type ActorForm = {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

const initialForm: ActorForm = {
  name: "",
  photo: "",
  nationality: "",
  birthDate: "",
  biography: "",
};

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [form, setForm] = useState<ActorForm>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadActors() {
    try {
      setLoading(true);
      setError("");

      const data = await api<Actor[]>("/actors");
      setActors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible cargar actores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActors();
  }, []);

  function updateField(field: keyof ActorForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveActor(event: FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        birthDate: new Date(form.birthDate).toISOString(),
      };

      if (editingId) {
        await api(`/actors/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/actors", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm(initialForm);
      setEditingId(null);
      await loadActors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando actor");
    } finally {
      setSaving(false);
    }
  }

  function editActor(actor: Actor) {
    setEditingId(actor.id);

    setForm({
      name: actor.name,
      photo: actor.photo,
      nationality: actor.nationality,
      birthDate: actor.birthDate.slice(0, 10),
      biography: actor.biography,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteActor(id: string) {
    if (!window.confirm("¿Eliminar este actor?")) {
      return;
    }

    try {
      setError("");

      await api(`/actors/${id}`, {
        method: "DELETE",
      });

      await loadActors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando actor");
    }
  }

  return (
    <main className="container page">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">TALENTO</span>
          <h1>Actores</h1>
          <p>Gestiona los actores registrados en la plataforma.</p>
        </div>

        <div className="counter">
          <strong>{actors.length}</strong>
          <span>actores</span>
        </div>
      </div>

      <section className="formCard">
        <div className="formTitle">
          <div>
            <span className="stepBadge">{editingId ? "EDITAR" : "NUEVO"}</span>
            <h2>{editingId ? "Editar actor" : "Registrar actor"}</h2>
          </div>

          {editingId && (
            <button
              className="button ghost small"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={saveActor}>
          <div className="formGrid">
            <label>
              Nombre completo
              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Ej. Leonardo DiCaprio"
              />
            </label>

            <label>
              Nacionalidad
              <input
                required
                value={form.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
                placeholder="Ej. Estadounidense"
              />
            </label>

            <label>
              Fecha de nacimiento
              <input
                required
                type="date"
                value={form.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
              />
            </label>

            <label>
              URL de fotografía
              <input
                required
                type="url"
                value={form.photo}
                onChange={(e) => updateField("photo", e.target.value)}
                placeholder="https://..."
              />
            </label>

            <label className="fullWidth">
              Biografía
              <textarea
                required
                value={form.biography}
                onChange={(e) => updateField("biography", e.target.value)}
                placeholder="Breve descripción del actor..."
              />
            </label>
          </div>

          {error && <div className="errorBox">{error}</div>}

          <div className="formActions">
            <button disabled={saving} className="button primary" type="submit">
              {saving
                ? "Guardando..."
                : editingId
                ? "Guardar cambios"
                : "Registrar actor"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="sectionHeading">
          <div>
            <span className="eyebrow">CATÁLOGO</span>
            <h2>Actores registrados</h2>
          </div>
        </div>

        {loading ? (
          <div className="emptyState">Cargando actores...</div>
        ) : actors.length === 0 ? (
          <div className="emptyState">No hay actores registrados.</div>
        ) : (
          <div className="actorGrid">
            {actors.map((actor) => (
              <article className="actorCard" key={actor.id}>
                <div className="actorImageWrapper">
                  <img src={actor.photo} alt={actor.name} />
                </div>

                <div className="actorContent">
                  <span className="miniLabel">{actor.nationality}</span>
                  <h3>{actor.name}</h3>

                  <p className="biography">
                    {actor.biography || "Sin biografía registrada."}
                  </p>

                  <div className="actorMeta">
                    <span>
                      Nacimiento{" "}
                      <strong>
                        {new Date(actor.birthDate).toLocaleDateString("es-CO")}
                      </strong>
                    </span>
                  </div>

                  <div className="cardActions">
                    <button
                      className="button secondary small"
                      onClick={() => editActor(actor)}
                    >
                      Editar
                    </button>

                    <button
                      className="button danger small"
                      onClick={() => deleteActor(actor.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
