import { Dashboard } from "@/components/study/dashboard";
import { Hero } from "@/components/study/hero";
import { StatsStrip } from "@/components/study/stats-strip";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <StatsStrip />
      <div className="flex-1 pt-6 sm:pt-8">
        <Dashboard />
      </div>
      <footer className="mt-auto border-t bg-card/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            Série: Mapa de Estudos sobre Gnosticismo e Esoterismo —
            Documento-Mestre de Referência
          </p>
          <p>Progresso e notas salvos automaticamente · Estudo autodidata</p>
        </div>
      </footer>
    </div>
  );
}
