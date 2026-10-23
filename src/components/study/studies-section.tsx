"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "./section-heading";
import { InfluenceSection } from "./influence-section";
import { PromptCard } from "./prompt-card";
import { prompts } from "@/data/prompts";
import type { ProgressStatus } from "@/data/types";
import { useProgressMap, getStatus } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

const FILTERS: { value: "ALL" | ProgressStatus; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "NOT_STARTED", label: "Não iniciados" },
  { value: "DONE", label: "Concluídos" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

/** Catálogo completo dos dez cadernos originais com busca e filtros de progresso. */
export function StudiesSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProgressStatus>("ALL");
  const { map, isLoading, isError } = useProgressMap();

  const filtered = useMemo(() => {
    const query = normalize(search.trim());
    return prompts.filter((prompt) => {
      const status = getStatus(map, "PROMPT", prompt.id);
      if (statusFilter !== "ALL" && status !== statusFilter) return false;
      if (!query) return true;
      const searchable = normalize(
        `${prompt.id} ${prompt.title} ${prompt.centralConcept} ${prompt.fundamentalQuestion}`,
      );
      return searchable.includes(query);
    });
  }, [map, search, statusFilter]);

  const inProgressCount = prompts.filter(
    (prompt) => getStatus(map, "PROMPT", prompt.id) === "IN_PROGRESS",
  ).length;

  return (
    <div className="space-y-9">
      <SectionHeading
        overline="Parte I · coleção principal"
        title="Cadernos de estudo"
        description="Dez estudos articulados por pré-requisitos, perguntas fundamentais e influências diretas. Abra um caderno para ler o conteúdo integral, registrar notas e acompanhar o percurso."
      />

      <div className="flex flex-col gap-4 rounded-2xl border bg-card/55 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por tema, pergunta ou prompt…"
            aria-label="Buscar nos cadernos de estudo"
            className="h-10 rounded-xl bg-background/70 pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Filtrar cadernos por status">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === filter.value
                  ? "border-primary/50 bg-primary/12 text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{filtered.length}</span> de {prompts.length} cadernos
          {inProgressCount > 0 ? <span> · {inProgressCount} em andamento</span> : null}
        </p>
        {isError ? (
          <p role="status" className="text-xs text-amber-700 dark:text-amber-300">
            O progresso não pôde ser sincronizado. Os estudos continuam disponíveis.
          </p>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-6 py-14 text-center">
          <BookOpen className="mx-auto size-8 text-muted-foreground/60" aria-hidden />
          <p className="mt-3 font-medium">Nenhum caderno encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">Tente outro termo ou limpe o filtro de status.</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              status={getStatus(map, "PROMPT", prompt.id)}
              statusLoading={isLoading}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-mono">P1—P10</Badge>
        A sequência principal é complementada por onze estudos de expansão na seção 5.x.
      </div>

      <InfluenceSection prompts={prompts} />
    </div>
  );
}
