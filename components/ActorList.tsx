import ActorCard from "./ActorCard";

type Actor = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

type Props = {
  actors: Actor[];
  onDelete: (id: string) => void;
};

export default function ActorList({
  actors,
  onDelete,
}: Props) {
  if (actors.length === 0) {
    return <p>No hay actores.</p>;
  }

  return (
    <div>
      {actors.map((actor) => (
        <ActorCard
          key={actor.id}
          actor={actor}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
