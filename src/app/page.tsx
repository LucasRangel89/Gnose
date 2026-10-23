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
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 sm:justify-end">
          <span>Progresso e notas salvos automaticamente · Estudo autodidata ·</span>
          <a
            href="/gnose-dashboard.zip"
            download
            className="underline decoration-primary/40 underline-offset-4 transition-colors hover:text-foreground"
            title="Baixar o pacote completo do projeto para upload no GitHub"
          >
            Baixar pacote (.zip)
          </a>
        </p>
        </div>
      </footer>
    </div>
  );
}
