import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/** Cabeçalho do dashboard: marca, título, descrição e arte gerada. */
export function Hero() {
  return (
    <header className="relative overflow-hidden border-b bg-gradient-to-b from-accent/40 via-background to-background">
      <div className={CONTAINER}>
        <div className="flex items-center justify-between py-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Mapa de Estudos · Gnosticismo &amp; Esoterismo
          </p>
          <ThemeToggle />
        </div>

        <div className="grid items-center gap-8 pb-10 pt-4 sm:pb-12 lg:grid-cols-[1fr_auto] lg:gap-12 lg:pb-16">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Documento-Mestre · Série de Pesquisa Profunda
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Gnose — Dashboard de Estudos
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Seu centro de comando para a série completa: o mapa dos 10
              prompts, o índice cruzado de conceitos, o glossário técnico
              unificado, as rotas de leitura temáticas e a expansão em 11 novos
              prompts. Marque seu progresso, anote insights e navegue pelo
              arquivo como um instrumento de navegação — não um substituto para
              os documentos da série.
            </p>
          </div>

          <figure className="relative mx-auto hidden w-full max-w-xs sm:block lg:max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl"
            />
            <Image
              src="/images/hero-gnose.png"
              alt="Ilustração esotérica em estilo de gravura antiga: astrolábio-mandala com a Árvore da Vida, sete selos planetários e anel zodiacal, em tinta sépia e dourada"
              width={768}
              height={768}
              priority
              className="relative rounded-xl border border-primary/25 shadow-xl"
            />
          </figure>
        </div>
      </div>
    </header>
  );
}
