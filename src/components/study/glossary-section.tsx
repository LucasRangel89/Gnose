"use client";

import { useMemo, useState } from "react";
import { BookMarked, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "./section-heading";
import { glossary } from "@/data/glossary";
import { cn } from "@/lib/utils";

function firstLetter(term: string): string {
  const normalized = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const letter = normalized.match(/[a-zA-Z]/)?.[0] ?? "#";
  return letter.toUpperCase();
}

/** Aba "Glossário": busca + navegação por letra inicial. */
export function GlossarySection() {
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string>("ALL");

  const letters = useMemo(() => {
    const set = new Set<string>();
    for (const term of glossary) set.add(firstLetter(term.term));
    return Array.from(set).sort();
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return glossary.filter((term) => {
      if (letter !== "ALL" && firstLetter(term.term) !== letter) return false;
      if (!normalizedSearch) return true;
      return (
        term.term.toLowerCase().includes(normalizedSearch) ||
        term.tradition.toLowerCase().includes(normalizedSearch) ||
        term.definition.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [letter, normalizedSearch]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const term of filtered) {
      const key = firstLetter(term.term);
      const list = map.get(key) ?? [];
      list.push(term);
      map.set(key, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <SectionHeading
        overline="Parte III"
        title="Glossário — Termos Essenciais da Série"
        description="Cada entrada inclui o termo, a tradição de origem, os Prompts em que aparece e a definição precisa com notas sobre usos divergentes entre tradições."
      />

      <div className="space-y-4">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar termo, tradição ou definição…"
            aria-label="Buscar no glossário"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            aria-pressed={letter === "ALL"}
            onClick={() => setLetter("ALL")}
            className={letterChipClass(letter === "ALL")}
          >
            Todos
          </button>
          {letters.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={letter === l}
              onClick={() => setLetter(letter === l ? "ALL" : l)}
              className={letterChipClass(letter === l)}
            >
              {l}
            </button>
          ))}
          <span className="ml-2 text-xs text-muted-foreground">
            <BookMarked className="mr-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden />
            {filtered.length} de {glossary.length} termos
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          Nenhum termo encontrado com os filtros atuais.
        </p>
      ) : (
        <div className="space-y-10">
          {grouped.map(([groupLetter, terms]) => (
            <section key={groupLetter} aria-label={`Termos com inicial ${groupLetter}`}>
              <h3 className="mb-4 border-b border-primary/30 pb-1 font-serif text-2xl font-semibold text-primary">
                {groupLetter}
              </h3>
              <div className="grid items-start gap-4 xl:grid-cols-2">
                {terms.map((term) => (
                  <Card key={term.id} className="p-5">
                    <CardContent className="space-y-3 p-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-serif text-lg font-semibold">
                          {term.term}
                        </h4>
                        <Badge variant="secondary" className="max-w-full text-[11px] font-normal">
                          <span className="truncate">{term.tradition}</span>
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {term.prompts.map((id) => (
                          <Badge
                            key={id}
                            variant="outline"
                            className="font-mono text-[11px]"
                          >
                            {id}
                          </Badge>
                        ))}
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                        {formatDefinition(term.definition)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/** "||" separa usos divergentes entre tradições — renderizado como parágrafos. */
function formatDefinition(definition: string): string {
  return definition.replace(/\s*\|\|\s*/g, "\n\n");
}

function letterChipClass(active: boolean): string {
  return cn(
    "inline-flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  );
}
