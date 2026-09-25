import Link from "next/link";
import ActorForm from "../../components/ActorForm";

export default function CrearActorPage() {
  return (
    <main className="page-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Crear Actor</h1>

          <p>
            Agrega un nuevo actor a la plataforma.
          </p>
        </div>

        <ActorForm />

        <div style={{ marginTop: "20px" }}>
          <Link
            href="/actors"
            className="secondary-button"
          >
            Volver a actores
          </Link>
        </div>
      </div>
    </main>
  );
}
