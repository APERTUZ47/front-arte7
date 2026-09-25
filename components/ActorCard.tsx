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
    <div>
      <h2>{actor.name}</h2>

      {actor.photo && (
        <img
          src={actor.photo}
          alt={actor.name}
          width="150"
        />
      )}

      <p>
        Nacionalidad: {actor.nationality}
      </p>

      <p>
        Fecha de nacimiento:{" "}
        {new Date(
          actor.birthDate
        ).toLocaleDateString()}
      </p>

      <p>{actor.biography}</p>

      <Link
        href={`/editar/${actor.id}`}
      >
        Editar
      </Link>

      {" "}

      <button
        onClick={() =>
          onDelete(actor.id)
        }
      >
        Eliminar
      </button>

      <hr />
    </div>
  );
}
