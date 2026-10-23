"use client";

import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { StepBadge } from "./step-badge";
import { nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";
import { readingRoutes } from "@/data/routes";
import type { ProgressStatus } from "@/data/types";
import { useProgressMap } from "@/hooks/use-progress";

/** Status de um passo de rota: prompts usam PROMPT; "5.x" usam NEXT_PROMPT. */
function stepStatus(
  map: Map<string, ProgressStatus>,
  step: string,
): ProgressStatus {
  const itemType = step.startsWith("P") ? "PROMPT" : "NEXT_PROMPT";
  return map.get(`${itemType}:${step}`) ?? "NOT_STARTED";
}

function stepTitle(step: string): string {
  if (step.startsWith("P")) {
    const prompt = prompts.find((p) => p.id === step);
    return prompt ? `${step} — ${prompt.title}` : step;
  }
  const next = nextPrompts.find((p) => p.id === step);
  return next ? `${step} — ${next.title}` : step;
}

/** Aba "Rotas de Leitura": ordem numérica + quatro rotas temáticas. */
export function RoutesSection() {
  const { map, isLoading } = useProgressMap();

  return (
    <div className="space-y-8">
      <SectionHeading
        overline="Parte IV"
        title="Caminhos de Leitura — Quatro Rotas Temáticas"
        description="A ordem numérica (P1→P10) é uma rota válida — a genealogia histórica. Mas há quatro outras rotas que revelam conexões que a ordem cronológica obscurece."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {readingRoutes.map((route) => {
          const done = route.steps.filter(
            (step) => stepStatus(map, step) === "DONE",
          ).length;
          return (
            <Card key={route.id} className="flex h-full flex-col p-5 sm:p-6">
              <CardHeader className="p-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="font-serif text-xl font-semibold">
                    {route.id !== "G" && (
                      <span className="mr-2 text-primary">Rota {route.id}</span>
                    )}
                    {route.title}
                  </CardTitle>
                  <span className="font-mono text-xs text-muted-foreground">
                    {done}/{route.steps.length} concluídos
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 p-0 pt-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {route.description}
                </p>

                <ol
                  className="flex flex-wrap items-center gap-1"
                  aria-label={`Passos da rota ${route.title}`}
                >
                  {route.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-1">
                      {index > 0 && (
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60"
                          aria-hidden
                        />
                      )}
                      <span title={stepTitle(step)}>
                        <StepBadge id={step} status={stepStatus(map, step)} />
                      </span>
                    </li>
                  ))}
                </ol>

                <p className="mt-auto border-l-2 border-primary/40 pl-3 text-sm italic leading-relaxed text-foreground/75">
                  {route.comment}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading && (
        <p className="text-center text-xs text-muted-foreground">
          Sincronizando status das rotas…
        </p>
      )}
    </div>
  );
}
