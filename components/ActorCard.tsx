import Link from "next/link";

type Actor = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

type Props = {
  actor: Actor;
  onDelete: (id: string) => void;
};

export default function ActorCard({
  actor,
  onDelete,
}: Props) {
  return (
    <article className="actor-card">
      <div className="actor-image-wrapper">
        <img
          className="actor-image"
          src={actor.photo}
          alt={actor.name}
        />
      </div>

      <div className="actor-content">
        <h2 className="actor-name">
          {actor.name}
        </h2>

        <p className="actor-info">
          <strong>Nacionalidad:</strong>{" "}
          {actor.nationality}
        </p>

        <p className="actor-info">
          <strong>Fecha de nacimiento:</strong>{" "}
          {new Date(
            actor.birthDate
          ).toLocaleDateString()}
        </p>

        <p className="actor-biography">
          {actor.biography}
        </p>

        <div className="actor-actions">
          <Link
            className="secondary-button"
            href={`/editar/${actor.id}`}
          >
            Editar
          </Link>

          <button
            className="danger-button"
            onClick={() =>
              onDelete(actor.id)
            }
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
