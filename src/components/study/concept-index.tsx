"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "./section-heading";
import { conceptCategories, concepts } from "@/data/concepts";
import { prompts } from "@/data/prompts";
import type { ConceptCategory } from "@/data/types";
import { cn } from "@/lib/utils";

/** Aba "Índice Cruzado": conceitos por tema, filtráveis por busca e por prompt. */
export function ConceptIndex() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ConceptCategory | "ALL">("ALL");
  const [promptFilter, setPromptFilter] = useState<Set<string>>(new Set());

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return concepts.filter((concept) => {
      if (category !== "ALL" && concept.category !== category) return false;
      if (
        promptFilter.size > 0 &&
        !concept.prompts.some((p) => promptFilter.has(p))
      ) {
        return false;
      }
      if (!normalizedSearch) return true;
      return (
        concept.name.toLowerCase().includes(normalizedSearch) ||
        concept.note.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [category, normalizedSearch, promptFilter]);

  const grouped = useMemo(() => {
    return conceptCategories
      .map((cat) => ({
        category: cat,
        items: filtered.filter((c) => c.category === cat.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [filtered]);

  function togglePrompt(id: string) {
    setPromptFilter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        overline="Parte II"
        title="Índice por Tema — Onde Cada Conceito Aparece"
        description="Cada conceito é seguido pelos números dos Prompts em que aparece com desenvolvimento substantivo, e uma nota sobre como o tratamento varia entre eles."
      />

      {/* Controles */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar conceito ou nota…"
              aria-label="Buscar conceitos"
              className="pl-9"
            />
          </div>
          <Tabs
            value={category}
            onValueChange={(value) => setCategory(value as ConceptCategory | "ALL")}
          >
            <TabsList className="h-9 flex-wrap justify-start sm:flex-nowrap">
              <TabsTrigger value="ALL">Todos</TabsTrigger>
              {conceptCategories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.id} · {cat.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs text-muted-foreground">
            Filtrar por Prompt:
          </span>
          {prompts.map((prompt) => {
            const active = promptFilter.has(prompt.id);
            return (
              <button
                key={prompt.id}
                type="button"
                aria-pressed={active}
                onClick={() => togglePrompt(prompt.id)}
                className={cn(
                  "inline-flex h-7 items-center rounded-md border px-2 font-mono text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {prompt.id}
              </button>
            );
          })}
          {promptFilter.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setPromptFilter(new Set())}
            >
              Limpar filtro
            </Button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {grouped.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Nenhum conceito encontrado com os filtros atuais.
        </p>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <section key={group.category.id} aria-label={group.category.name}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-xl font-semibold text-primary">
                  {group.category.id} — {group.category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {group.items.length}{" "}
                  {group.items.length === 1 ? "conceito" : "conceitos"} ·{" "}
                  {group.category.noteLabel}
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {group.items.map((concept) => (
                  <Card key={concept.id} className="p-5">
                    <CardContent className="space-y-3 p-0">
                      <h4 className="font-serif text-base font-semibold leading-snug">
                        {concept.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {concept.prompts.map((id) => {
                          const active = promptFilter.has(id);
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => togglePrompt(id)}
                              aria-pressed={active}
                              aria-label={`Filtrar por ${id}`}
                              className={cn(
                                "inline-flex h-6 items-center rounded-md border px-2 font-mono text-[11px] transition-colors",
                                active
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-secondary/60 text-secondary-foreground hover:bg-accent",
                              )}
                            >
                              {id}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {concept.note}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {filtered.length} de {concepts.length} conceitos exibidos
        <Badge variant="outline" className="ml-2 align-middle text-[10px]">
          Parte II do documento-mestre
        </Badge>
      </p>
    </div>
  );
}
