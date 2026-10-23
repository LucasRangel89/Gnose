"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Check,
  Compass,
  Lightbulb,
  Network,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "./section-heading";
import { ReaderDialog, type ReaderTarget } from "./reader-dialog";
import { concepts } from "@/data/concepts";
import { publishedStudyCount } from "@/data/content-index";
import { glossary } from "@/data/glossary";
import { nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";
import { readingRoutes } from "@/data/routes";
import type { ProgressStatus } from "@/data/types";
import { countStatuses, getStatus, useProgressMap } from "@/hooks/use-progress";
import type { DashboardSection } from "./dashboard";
import { cn } from "@/lib/utils";

const QUICK_LINKS: {
  section: DashboardSection;
  icon: typeof Compass;
  title: string;
  description: string;
  count: string;
}[] = [
  {
    section: "concepts",
    icon: Network,
    title: "Mapa de conceitos",
    description: "Veja como os temas atravessam tradições.",
    count: `${concepts.length} conceitos`,
  },
  {
    section: "glossary",
    icon: BookMarked,
    title: "Glossário",
    description: "Encontre termos, origens e usos distintos.",
    count: `${glossary.length} entradas`,
  },
  {
    section: "routes",
    icon: RouteIcon,
    title: "Rotas de leitura",
    description: "Escolha um percurso histórico ou temático.",
    count: `${readingRoutes.length} percursos`,
  },
];

function statusLabel(status: ProgressStatus): string {
  if (status === "DONE") return "Concluído";
  if (status === "IN_PROGRESS") return "Em andamento";
  return "Não iniciado";
}

function statusDotClass(status: ProgressStatus): string {
  if (status === "DONE") return "bg-emerald-500";
  if (status === "IN_PROGRESS") return "bg-amber-500";
  return "bg-muted-foreground/35";
}

function getContinueTarget(
  map: Map<string, ProgressStatus>,
): ReaderTarget {
  const activeOriginal = prompts.find(
    (prompt) => getStatus(map, "PROMPT", prompt.id) === "IN_PROGRESS",
  );
  if (activeOriginal) {
    return {
      itemType: "PROMPT",
      itemId: activeOriginal.id,
      title: activeOriginal.title,
      prereqLabel: activeOriginal.prereq === "—" ? undefined : activeOriginal.prereq,
    };
  }

  const nextOriginal = prompts.find(
    (prompt) => getStatus(map, "PROMPT", prompt.id) !== "DONE",
  );
  if (nextOriginal) {
    return {
      itemType: "PROMPT",
      itemId: nextOriginal.id,
      title: nextOriginal.title,
      prereqLabel: nextOriginal.prereq === "—" ? undefined : nextOriginal.prereq,
    };
  }

  const activeExpansion = nextPrompts.find(
    (prompt) => getStatus(map, "NEXT_PROMPT", prompt.id) === "IN_PROGRESS",
  );
  const nextExpansion = activeExpansion ?? nextPrompts.find(
    (prompt) => getStatus(map, "NEXT_PROMPT", prompt.id) !== "DONE",
  );
  if (nextExpansion) {
    return {
      itemType: "NEXT_PROMPT",
      itemId: nextExpansion.id,
      title: nextExpansion.title,
      prereqLabel: nextExpansion.prereq,
    };
  }

  const first = prompts[0];
  return {
    itemType: "PROMPT",
    itemId: first.id,
    title: first.title,
    prereqLabel: undefined,
  };
}

/** Página inicial do atlas: progresso, próximo passo e atalhos de navegação. */
export function OverviewTab({
  onNavigate,
}: {
  onNavigate: (section: DashboardSection) => void;
}) {
  const { map, isLoading, isError } = useProgressMap();
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerTarget, setReaderTarget] = useState<ReaderTarget | null>(null);

  const promptStats = countStatuses(map, "PROMPT", prompts.map((item) => item.id));
  const expansionStats = countStatuses(map, "NEXT_PROMPT", nextPrompts.map((item) => item.id));
  const totalDone = promptStats.done + expansionStats.done;
  const totalItems = promptStats.total + expansionStats.total;
  const totalInProgress = promptStats.inProgress + expansionStats.inProgress;
  const percent = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;
  const continueTarget = getContinueTarget(map);
  const allDone = totalDone === totalItems;

  function openContinue() {
    setReaderTarget(continueTarget);
    setReaderOpen(true);
  }

  return (
    <div className="space-y-10">
      <section className="relative isolate overflow-hidden rounded-[28px] border border-primary/25 bg-[#151923] shadow-[0_20px_70px_-32px_rgba(0,0,0,0.7)]">
        <Image
          src="/images/hero-gnose.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="-z-20 object-cover object-center opacity-25"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(18,21,29,0.98)_0%,rgba(18,21,29,0.91)_55%,rgba(18,21,29,0.48)_100%)]" />
        <div aria-hidden className="absolute -right-10 -top-20 -z-10 size-80 rounded-full bg-amber-300/10 blur-[90px]" />
        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center lg:p-11">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                <span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.7)]" />
                Um atlas para pensar conexões
              </span>
              <Badge className="border border-white/15 bg-white/10 text-[10px] font-medium text-stone-200 hover:bg-white/10">GNOSTICISMO · ESOTERISMO</Badge>
            </div>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-stone-50 sm:text-5xl lg:text-[3.5rem]">
              Siga os fios.<br className="hidden sm:block" /> Encontre o sentido.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-300/85 sm:text-base">
              Navegue por uma biblioteca de estudos sobre Gnosticismo e Esoterismo — do contexto histórico às ideias que continuam se transformando.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button onClick={() => onNavigate("studies")} className="h-11 gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-black/20 hover:bg-primary/90">
                Explorar os estudos
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button variant="outline" onClick={() => onNavigate("routes")} className="h-11 gap-2 rounded-xl border-white/20 bg-white/5 px-4 text-stone-100 hover:bg-white/10 hover:text-white">
                <Compass className="size-4" aria-hidden />
                Escolher uma rota
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/12 bg-black/25 p-5 shadow-xl backdrop-blur-md sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Seu percurso</p>
                <p className="mt-2 font-serif text-4xl font-semibold leading-none text-stone-50">
                  {isLoading ? "—" : `${percent}%`}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl border border-amber-200/20 bg-amber-100/10 text-amber-200">
                <Sparkles className="size-5" aria-hidden />
              </span>
            </div>
            <Progress value={percent} aria-label="Progresso geral dos estudos" className="mt-5 h-1.5 bg-white/10 [&>div]:bg-amber-300" />
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-stone-300/75">
              <span>{totalDone} de {totalItems} estudos concluídos</span>
              <span>{totalInProgress} em andamento</span>
            </div>
            <Button variant="ghost" onClick={openContinue} className="mt-5 h-auto w-full justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-stone-100 hover:bg-white/10 hover:text-white">
              <span className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.14em] text-stone-400">{allDone ? "Revisar o percurso" : "Próximo passo"}</span>
                <span className="mt-1 block truncate text-sm font-medium">{continueTarget.itemId} · {continueTarget.title}</span>
              </span>
              <ArrowRight className="ml-3 size-4 shrink-0 text-amber-200" aria-hidden />
            </Button>
          </div>
        </div>
      </section>

      {isError ? (
        <div role="status" className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <Lightbulb className="size-4 shrink-0" aria-hidden />
          <span>O acervo está disponível, mas o progresso não pôde ser carregado. Configure o banco local para salvar seu percurso.</span>
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            overline="O acervo em números"
            title="Um campo de estudo, várias entradas"
            description="Comece pelos estudos, siga os conceitos ou escolha um caminho temático."
          />
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => onNavigate("studies")}>
            Ver coleção <ArrowRight className="size-3.5" aria-hidden />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard icon={BookOpen} value={prompts.length} label="Estudos principais" detail={`${prompts.length} textos integrais`} />
          <MetricCard
            icon={Sparkles}
            value={nextPrompts.length}
            label="Aprofundamentos"
            detail={`${publishedStudyCount - prompts.length} integrais · ${nextPrompts.length - publishedStudyCount + prompts.length} pendentes`}
          />
          <MetricCard icon={Network} value={concepts.length} label="Conceitos cruzados" detail="Conexões entre prompts" />
          <MetricCard icon={BookMarked} value={glossary.length} label="Termos no glossário" detail="Tradições e definições" />
          <MetricCard icon={RouteIcon} value={readingRoutes.length} label="Rotas de leitura" detail="1 histórica + 4 temáticas" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
        <Card className="overflow-hidden border-border/80 bg-card/75 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Trilha principal</p>
                <h3 className="mt-1 font-serif text-2xl font-semibold">A série em dez passos</h3>
              </div>
              <p className="text-xs text-muted-foreground">Selecione um estudo para abrir o leitor</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {prompts.map((prompt) => {
                const status = getStatus(map, "PROMPT", prompt.id);
                const target: ReaderTarget = {
                  itemType: "PROMPT",
                  itemId: prompt.id,
                  title: prompt.title,
                  prereqLabel: prompt.prereq === "—" ? undefined : prompt.prereq,
                };
                return (
                  <button
                    key={prompt.id}
                    type="button"
                    title={`${prompt.id} — ${prompt.title} · ${statusLabel(status)}`}
                    onClick={() => { setReaderTarget(target); setReaderOpen(true); }}
                    className="group flex min-h-[86px] flex-col items-start rounded-xl border border-border/70 bg-background/45 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40"
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-primary">{prompt.id}</span>
                      <span className={cn("size-1.5 rounded-full", statusDotClass(status))} aria-label={statusLabel(status)} />
                    </span>
                    <span className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-foreground/85 group-hover:text-foreground">{prompt.title}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/75 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lightbulb className="size-[18px]" aria-hidden />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Como navegar</p>
                <h3 className="mt-1 font-serif text-xl font-semibold">Siga a pergunta que interessa</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A ordem dos cadernos acompanha uma genealogia histórica; as rotas e o mapa cruzado revelam aproximações temáticas. Não há uma única porta de entrada.
            </p>
            <div className="mt-5 space-y-2">
              <GuideRow number="01" title="Leia" description="Abra um caderno e marque seu progresso." />
              <GuideRow number="02" title="Conecte" description="Cruze conceitos e tradições no índice." />
              <GuideRow number="03" title="Registre" description="Guarde dúvidas e insights nas notas." />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading overline="Portas de entrada" title="Por onde você quer começar?" />
          <Badge variant="outline" className="font-mono text-[10px]">{readingRoutes.length - 1} percursos temáticos</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.section}
                type="button"
                onClick={() => onNavigate(item.section)}
                className="group rounded-2xl border border-border/80 bg-card/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg hover:shadow-black/5 sm:p-5"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary/12 group-hover:text-primary">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{item.count}</span>
                </span>
                <span className="mt-4 block font-serif text-xl font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{item.description}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">Abrir seção <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-start gap-2 rounded-xl border border-border/60 bg-card/35 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary/75" aria-hidden />
        <p>Este atlas organiza materiais de estudo e comparação. As interpretações podem variar entre fontes e tradições; consulte as referências de cada caderno para aprofundar a pesquisa.</p>
      </div>

      <ReaderDialog target={readerTarget} open={readerOpen} onOpenChange={setReaderOpen} />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
  detail,
}: {
  icon: typeof BookOpen;
  value: number;
  label: string;
  detail: string;
}) {
  return (
    <Card className="group border-border/75 bg-card/65 shadow-none transition-colors hover:bg-card">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-serif text-3xl font-semibold leading-none tracking-tight">{value}</p>
          <p className="mt-2 truncate text-xs font-semibold">{label}</p>
          <p className="mt-1 truncate text-[10px] text-muted-foreground">{detail}</p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary/75 text-primary transition-colors group-hover:bg-primary/10">
          <Icon className="size-[17px]" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}

function GuideRow({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-[10px] font-semibold text-secondary-foreground">{number}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold">{title}</span>
        <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{description}</span>
      </span>
      <Check className="size-3.5 shrink-0 text-primary/70" aria-hidden />
    </div>
  );
}
