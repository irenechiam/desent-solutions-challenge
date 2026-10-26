
import WorkspaceScene from "./components/WorkspaceScene";

export default function Home() {
  return (
    <main className="relative h-screen min-h-[600px] overflow-hidden bg-[#F5F1E9]">
      {/* Full-screen 3D environment */}
      <div className="absolute inset-0">
        <WorkspaceScene />
      </div>

      {/* Floating heading */}
      <header className="pointer-events-none absolute left-6 top-6 z-10 max-w-sm sm:left-10 sm:top-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          MONIS RENT · WORKSPACE STUDIO
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Make room for your best work.
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-6 text-stone-600 sm:text-base">
          Build a workspace that feels like yours.
          Choose your furniture and create your perfect setup in Bali.
        </p>
      </header>
    </main>
  );
}
