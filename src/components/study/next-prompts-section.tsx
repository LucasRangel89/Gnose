"use client";

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { NotesDialog } from "./notes-dialog";
import { ReaderDialog, type ReaderTarget } from "./reader-dialog";
import { StatusControl } from "./status-control";
import { nextPromptGroups, nextPrompts } from "@/data/nextPrompts";
import { contentFileFor } from "@/data/content-index";
import type { ProgressStatus } from "@/data/types";
import { useSetProgress } from "@/hooks/use-progress";
import { useProgressMap } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/** Aba "Expansão 5.x": os próximos 11 prompts, agrupados e colapsáveis. */
export function NextPromptsSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const { map, isLoading } = useProgressMap();
  const setStatus = useSetProgress();
  const { toast } = useToast();
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerTarget, setReaderTarget] = useState<ReaderTarget | null>(null);

  function openReader(id: string, title: string, prereq: string, groupTitle?: string) {
    setReaderTarget({
      itemType: "NEXT_PROMPT",
      itemId: id,
      title,
      subtitle: groupTitle,
      prereqLabel: prereq || undefined,
    });
    setReaderOpen(true);
  }

  function toggleOpen(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleChange(id: string, title: string, newStatus: ProgressStatus) {
    setStatus.mutate(
      { itemType: "NEXT_PROMPT", itemId: id, status: newStatus },
      {
        onSuccess: () => {
          const label =
            newStatus === "DONE"
              ? "concluído"
              : newStatus === "IN_PROGRESS"
                ? "em progresso"
                : "não iniciado";
          toast({
            title: "Progresso atualizado",
            description: `Prompt ${id} marcado como ${label}.`,
          });
        },
        onError: () => {
          toast({
            title: "Não foi possível salvar o progresso",
            description: "Verifique a configuração do banco e tente novamente.",
            variant: "destructive",
          });
        },
      },
    );
  }

  return (
    <div className="space-y-10">
      <SectionHeading
        overline="Parte V"
        title="Expansão do Gnosticismo — Os Próximos Prompts"
        description="O Prompt 5 original cobriu o Gnosticismo em 7 frentes — mas o tratou necessariamente como um campo, não como um sistema. Estes prompts são descidas de rua a rua: cada um toma um aspecto e o expande ao ponto em que o tema pode ser estudado por si mesmo."
      />

      {nextPromptGroups.map((group) => {
        const items = nextPrompts.filter((p) => p.group === group.id);
        if (items.length === 0) return null;
        return (
          <section key={group.id} aria-label={`Grupo ${group.id}`}>
            <div className="mb-4">
              <h3 className="font-serif text-xl font-semibold text-primary">
                GRUPO {group.id} — {group.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {group.description}
              </p>
            </div>

            <div className="space-y-3">
              {items.map((prompt) => {
                const open = openItems.has(prompt.id);
                const status = map.get(`NEXT_PROMPT:${prompt.id}`) ?? "NOT_STARTED";
                const itemLabel = `Prompt ${prompt.id} — ${prompt.title}`;
                return (
                  <Card key={prompt.id} className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => toggleOpen(prompt.id)}
                        aria-expanded={open}
                        className="group flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <Badge
                          variant="secondary"
                          className="shrink-0 font-mono text-xs"
                        >
                          {prompt.id}
                        </Badge>
                        <span className="min-w-0">
                          <span className="block font-serif text-base font-semibold leading-snug sm:text-lg">
                            {prompt.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            Pré-req: {prompt.prereq}
                            {prompt.meta ? ` · ${prompt.meta}` : ""}
                          </span>
                          <span className="mt-1 block text-[10px] text-muted-foreground/80">
                            {contentFileFor("NEXT_PROMPT", prompt.id)
                              ? "Texto integral disponível"
                              : "Roteiro disponível · texto integral em preparação"}
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                            open && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          aria-label={`Ler o estudo completo: ${itemLabel}`}
                          onClick={() =>
                            openReader(prompt.id, prompt.title, prompt.prereq)
                          }
                        >
                          <BookOpen className="h-4 w-4" aria-hidden />
                        </Button>
                        <StatusControl
                          compact
                          value={status}
                          onChange={(newStatus) =>
                            handleChange(prompt.id, prompt.title, newStatus)
                          }
                          disabled={isLoading}
                          itemLabel={itemLabel}
                        />
                        <NotesDialog
                          itemType="NEXT_PROMPT"
                          itemId={prompt.id}
                          itemTitle={itemLabel}
                        />
                      </div>
                    </div>

                    {open && (
                      <CardContent className="space-y-4 border-t p-4 pt-4 sm:p-5">
                        {prompt.intro ? (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {prompt.intro}
                          </p>
                        ) : null}

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() =>
                            openReader(prompt.id, prompt.title, prompt.prereq)
                          }
                        >
                          <BookOpen className="h-4 w-4" aria-hidden />
                          Abrir o estudo completo
                        </Button>

                        <ul className="space-y-4">
                          {prompt.fronts.map((front) => (
                            <li key={front.label} className="space-y-1">
                              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                                {front.label}
                              </p>
                              <p className="text-sm leading-relaxed text-foreground/80">
                                {front.text}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      <ReaderDialog
        target={readerTarget}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </div>
  );
}
