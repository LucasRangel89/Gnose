"use client";

import { BookOpen, Clock3, ListOrdered, Loader2, Sparkles, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "./section-heading";
import { InfluenceSection } from "./influence-section";
import { PromptCard } from "./prompt-card";
import { prompts } from "@/data/prompts";
import { nextPrompts } from "@/data/nextPrompts";
import { countStatuses, useProgressMap } from "@/hooks/use-progress";

const HOW_TO_USE = [
  {
    title: "Antes de ler um Prompt",
    body: "Consulte o Sumário Executivo e o Índice Cruzado para saber que conceitos você já conhece de Prompts anteriores e quais são novos.",
  },
  {
    title: "Durante uma questão específica",
    body: "Use o Glossário para encontrar a definição precisa e os Prompts em que o conceito aparece.",
  },
  {
    title: "Para planejar os próximos estudos",
    body: "A aba Expansão 5.x oferece 11 Prompts desenvolvidos e prontos para uso, em ordem de aprofundamento crescente.",
  },
];

/** Aba "Visão Geral": progresso geral, mapa dos 10 prompts e linhas de influência. */
export function OverviewTab() {
  const { map, isLoading } = useProgressMap();

  const promptIds = prompts.map((p) => p.id);
  const nextIds = nextPrompts.map((p) => p.id);

  const promptStats = countStatuses(map, "PROMPT", promptIds);
  const nextStats = countStatuses(map, "NEXT_PROMPT", nextIds);
  const totalDone = promptStats.done + nextStats.done;
  const totalInProgress = promptStats.inProgress + nextStats.inProgress;
  const totalItems = promptStats.total + nextStats.total;
  const percent = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  return (
    <div className="space-y-10">
      <SectionHeading
        overline="Parte I"
        title="Mapa dos 10 Prompts"
        description="Visão sinóptica da série completa: temas, pré-requisitos, conceitos centrais e o 'problema fundamental' que cada Prompt tenta responder."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Progresso geral */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-serif text-xl">Seu progresso</CardTitle>
            <Target className="h-5 w-5 text-primary" aria-hidden />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div className="font-serif text-4xl font-semibold leading-none">
                {isLoading ? <Skeleton className="h-10 w-16" /> : `${percent}%`}
              </div>
              <p className="text-sm text-muted-foreground">
                {totalDone} de {totalItems} itens concluídos
                {totalInProgress > 0
                  ? ` · ${totalInProgress} em progresso`
                  : ""}
              </p>
            </div>
            {isLoading ? (
              <Skeleton className="h-2.5 w-full" />
            ) : (
              <Progress value={percent} aria-label="Progresso geral dos estudos" />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-lg border bg-card/60 p-3">
                <p className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="h-4 w-4 text-primary" aria-hidden /> Prompts originais
                </p>
                <p className="mt-1 text-muted-foreground">
                  {promptStats.done}/{promptStats.total} concluídos
                </p>
              </div>
              <div className="rounded-lg border bg-card/60 p-3">
                <p className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden /> Expansão 5.x
                </p>
                <p className="mt-1 text-muted-foreground">
                  {nextStats.done}/{nextStats.total} concluídos
                </p>
              </div>
              <div className="col-span-2 rounded-lg border bg-card/60 p-3 sm:col-span-1">
                <p className="flex items-center gap-1.5 font-medium">
                  <Clock3 className="h-4 w-4 text-amber-500" aria-hidden /> Em
                  andamento
                </p>
                <p className="mt-1 text-muted-foreground">
                  {totalInProgress} {totalInProgress === 1 ? "item" : "itens"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Como usar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <ListOrdered className="h-5 w-5 text-primary" aria-hidden />
              Como usar este dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {HOW_TO_USE.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-semibold text-secondary-foreground"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Grid dos 10 prompts */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            status={
              map.get(`PROMPT:${prompt.id}`) ?? "NOT_STARTED"
            }
            statusLoading={isLoading}
          />
        ))}
      </div>

      {isLoading && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Carregando seu progresso…
        </p>
      )}

      <InfluenceSection prompts={prompts} />
    </div>
  );
}

