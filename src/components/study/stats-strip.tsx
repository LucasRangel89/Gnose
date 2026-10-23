import {
  BookMarked,
  BookOpen,
  Network,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import { concepts } from "@/data/concepts";
import { glossary } from "@/data/glossary";
import { nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";
import { readingRoutes } from "@/data/routes";

/** Faixa de estatísticas estáticas do acervo (conteúdo dos arquivos de dados). */
export function StatsStrip() {
  const stats = [
    {
      icon: BookOpen,
      label: "Prompts originais",
      value: String(prompts.length),
    },
    {
      icon: Sparkles,
      label: "Prompts de expansão",
      value: String(nextPrompts.length),
    },
    {
      icon: Network,
      label: "Conceitos cruzados",
      value: String(concepts.length),
    },
    {
      icon: BookMarked,
      label: "Termos no glossário",
      value: String(glossary.length),
    },
    {
      icon: RouteIcon,
      label: "Rotas de leitura",
      value: String(readingRoutes.length),
    },
  ];

  return (
    <section aria-label="Estatísticas do acervo" className="border-b">
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-6 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-3 px-2 py-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <dd className="font-serif text-2xl font-semibold leading-none">
                  {stat.value}
                </dd>
                <dt className="mt-1 truncate text-xs text-muted-foreground">
                  {stat.label}
                </dt>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
