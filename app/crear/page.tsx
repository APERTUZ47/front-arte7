import Link from "next/link";
import ActorForm from "../../components/ActorForm";

export default function CrearActorPage() {
  return (
    <main>
      <h1>Crear Actor</h1>

      <Link href="/actors">
        Volver a actores
      </Link>

      <hr />

      <ActorForm />
    </main>
  );
}
