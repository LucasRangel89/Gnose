"use client";

import { useEffect, useRef, useState } from "react";
import { BookLock, BookX, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MdArticle } from "./md-article";
import { NotesDialog } from "./notes-dialog";
import { StatusControl } from "./status-control";
import { contentFileFor } from "@/data/content-index";
import { nextPromptGroups, nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";
import type { ItemType, ProgressStatus } from "@/data/types";
import { getStatus, useProgressMap, useSetProgress } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";
import { useRecordReading } from "@/hooks/use-personal-data";
import { studySourceFor } from "@/data/study-sources";
import { FavoriteToggle, HighlightSelectionDialog } from "./study-actions";

/**
 * ReaderDialog — leitor de estudos em tela grande.
 *
 * Recebe apenas o alvo (`target`) do pai; a navegação Anterior/Próxima é
 * interna, atualizando o estado `current` e buscando o Markdown do item
 * (public/conteudo/) com cache por arquivo dentro da sessão do diálogo.
 */

/** Alvo do leitor: um item navegável do dashboard. */
export interface ReaderTarget {
  itemType: "PROMPT" | "NEXT_PROMPT";
  /** "P5" ou "5.3". */
  itemId: string;
  /** Título curto do item. */
  title: string;
  /** Subtítulo opcional (expansão 5.x tem). */
  subtitle?: string;
  /** Rótulo do pré-requisito, quando existir. */
  prereqLabel?: string;
  /** Âncora de seção para abrir um resultado da busca no trecho exato. */
  anchor?: string;
}

interface ReaderDialogProps {
  target: ReaderTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LoadPhase = "missing" | "loading" | "error" | "ready";

/** Prompts 5.x em ordem numérica garantida (5.1 … 5.11, com 5.10 após 5.9). */
const ORDERED_NEXT_PROMPTS = [...nextPrompts].sort((a, b) => {
  const [aMajor = 0, aMinor = 0] = a.id.split(".").map(Number);
  const [bMajor = 0, bMinor = 0] = b.id.split(".").map(Number);
  return aMajor - bMajor || aMinor - bMinor;
});

const STATUS_LABELS: Record<ProgressStatus, string> = {
  NOT_STARTED: "não iniciado",
  IN_PROGRESS: "em progresso",
  DONE: "concluído",
};

/** Reconstrói um ReaderTarget a partir dos dados estáticos (navegação). */
function toReaderTarget(
  itemType: ItemType,
  itemId: string,
): ReaderTarget | undefined {
  if (itemType === "PROMPT") {
    const prompt = prompts.find((p) => p.id === itemId);
    if (!prompt) return undefined;
    return {
      itemType,
      itemId: prompt.id,
      title: prompt.title,
      prereqLabel: prompt.prereq === "—" ? undefined : prompt.prereq,
    };
  }
  const next = ORDERED_NEXT_PROMPTS.find((p) => p.id === itemId);
  if (!next) return undefined;
  const group = nextPromptGroups.find((g) => g.id === next.group);
  return {
    itemType,
    itemId: next.id,
    title: next.title,
    subtitle: group ? `Grupo ${group.id} — ${group.title}` : undefined,
    prereqLabel: next.prereq || undefined,
  };
}

function ReaderSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 py-2" aria-hidden>
      <Skeleton className="h-9 w-2/3 max-w-sm" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
        <Skeleton className="h-4 w-11/12" />
      </div>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-6 w-1/2 max-w-xs" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-8/12" />
      </div>
    </div>
  );
}

function PendingState() {
  return (
    <div className="flex min-h-full items-center justify-center py-10">
      <div className="max-w-md rounded-lg border bg-card/60 p-8 text-center shadow-sm">
        <BookLock className="mx-auto h-10 w-10 text-primary/60" aria-hidden />
        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
          Conteúdo pendente
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Este estudo ainda não foi adicionado ao dashboard. O arquivo Markdown
          pode ser colocado em{" "}
          <code className="rounded bg-accent px-1 py-0.5 font-mono text-[12px] text-foreground/85">
            public/conteudo/
          </code>{" "}
          e registrado em{" "}
          <code className="rounded bg-accent px-1 py-0.5 font-mono text-[12px] text-foreground/85">
            src/data/content-index.ts
          </code>{" "}
          — veja o README.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center py-10">
      <div className="max-w-md rounded-lg border bg-card/60 p-8 text-center shadow-sm">
        <BookX className="mx-auto h-10 w-10 text-destructive/70" aria-hidden />
        <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
          Não foi possível carregar o estudo
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ocorreu um erro ao buscar o conteúdo deste estudo. Verifique sua
          conexão e tente novamente.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

export function ReaderDialog({ target, open, onOpenChange }: ReaderDialogProps) {
  const { toast } = useToast();
  const { map, isLoading: progressLoading } = useProgressMap();
  const setProgress = useSetProgress();
  const { mutate: recordReading } = useRecordReading();
  const [selectedText, setSelectedText] = useState("");
  const [selectedAnchor, setSelectedAnchor] = useState<string | undefined>();

  // `current` segue `target`: o pai só abre o diálogo; a navegação
  // Anterior/Próxima atualiza o estado interno. A sincronização é feita
  // ajustando o estado durante o render (padrão recomendado pelo React),
  // pois o eslint-plugin-react-hooks v7 proíbe setState síncrono em effects.
  const [current, setCurrent] = useState<ReaderTarget | null>(target);
  const targetKey = target ? `${target.itemType}:${target.itemId}:${target.anchor ?? ""}` : null;
  const [lastTargetKey, setLastTargetKey] = useState<string | null>(targetKey);
  if (targetKey !== lastTargetKey) {
    setLastTargetKey(targetKey);
    setCurrent(target);
    setSelectedText("");
    setSelectedAnchor(undefined);
  }

  // Cache arquivo -> conteúdo (em estado, não em ref, para poder derivar a
  // fase de carregamento durante o render). `failed` guarda arquivos cujo
  // fetch falhou; "Tentar novamente" remove a entrada e refaz o fetch.
  const [cache, setCache] = useState<Map<string, string>>(new Map());
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const file = current
    ? contentFileFor(current.itemType, current.itemId)
    : undefined;
  const cached = file !== undefined ? cache.get(file) : undefined;
  const hasFailed = file !== undefined ? failed.has(file) : false;

  const phase: LoadPhase =
    file === undefined
      ? "missing"
      : cached !== undefined
        ? "ready"
        : hasFailed
          ? "error"
          : "loading";

  // Busca do Markdown — somente com o diálogo aberto e conteúdo ainda não
  // cacheado/marcado como falho. Atualizações são mesclagens idempotentes.
  useEffect(() => {
    if (!open || file === undefined) return;
    if (cache.has(file) || failed.has(file)) return;
    void (async () => {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        setCache((prev) => new Map(prev).set(file, text));
      } catch {
        setFailed((prev) => new Set(prev).add(file));
      }
    })();
  }, [open, file, cache, failed]);

  // Cada abertura atualiza o histórico pessoal do usuário atual.
  useEffect(() => {
    if (!open || !current) return;
    recordReading({ itemType: current.itemType, itemId: current.itemId });
  }, [open, current?.itemType, current?.itemId, recordReading]);

  // Volta ao topo ao abrir/trocar de item; um resultado de busca pode reposicionar
  // o leitor no título da seção correspondente assim que o Markdown estiver pronto.
  useEffect(() => {
    if (!open) return;
    bodyRef.current?.scrollTo({ top: 0 });
  }, [open, current?.itemId]);

  useEffect(() => {
    if (!open || phase !== "ready" || !current?.anchor) return;
    const frame = window.requestAnimationFrame(() => {
      bodyRef.current?.querySelector<HTMLElement>(`#${current.anchor}`)?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, phase, current?.itemId, current?.anchor]);

  const collection =
    current?.itemType === "NEXT_PROMPT" ? ORDERED_NEXT_PROMPTS : prompts;
  const currentIndex = current
    ? collection.findIndex((item) => item.id === current.itemId)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < collection.length - 1;

  function navigate(direction: -1 | 1) {
    if (!current || currentIndex === -1) return;
    const neighbor = collection[currentIndex + direction];
    if (!neighbor) return;
    const nextTarget = toReaderTarget(current.itemType, neighbor.id);
    if (!nextTarget) return;
    setSelectedText("");
    setSelectedAnchor(undefined);
    setCurrent(nextTarget);
    bodyRef.current?.scrollTo({ top: 0 });
  }

  function updateSelectedText() {
    const selection = window.getSelection();
    const body = bodyRef.current;
    const quote = selection?.toString().trim() ?? "";
    if (!quote || !selection?.anchorNode || !body?.contains(selection.anchorNode)) return;
    setSelectedText(quote.slice(0, 3000));
    const selectedTop = selection.anchorNode.parentElement?.getBoundingClientRect().top;
    const headings = Array.from(body.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"));
    const nearestHeading = headings
      .filter((heading) => selectedTop !== undefined && heading.getBoundingClientRect().top <= selectedTop)
      .at(-1);
    setSelectedAnchor(nearestHeading?.id);
  }

  function handleRetry() {
    if (file === undefined) return;
    setFailed((prev) => {
      const next = new Set(prev);
      next.delete(file);
      return next;
    });
  }

  function handleStatusChange(status: ProgressStatus) {
    if (!current) return;
    setProgress.mutate(
      { itemType: current.itemType, itemId: current.itemId, status },
      {
        onSuccess: () => {
          toast({
            title: "Progresso atualizado",
            description: `Prompt ${current.itemId} marcado como ${STATUS_LABELS[status]}.`,
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

  const itemLabel = current
    ? `Prompt ${current.itemId} — ${current.title}`
    : "";
  const sourceInfo = current
    ? studySourceFor(current.itemType, current.itemId)
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:h-[85vh] sm:max-w-4xl"
      >
        {current ? (
          <>
            <header className="shrink-0 border-b bg-background/95 p-4 backdrop-blur">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Badge
                  variant="secondary"
                  className="shrink-0 font-mono text-xs"
                >
                  {current.itemId}
                </Badge>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="truncate font-serif text-base font-semibold leading-snug sm:text-lg">
                    {current.title}
                  </DialogTitle>
                  {current.subtitle ? (
                    <p className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
                      {current.subtitle}
                    </p>
                  ) : null}
                  {current.prereqLabel ? (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Pré-req: {current.prereqLabel}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5">
                  <FavoriteToggle
                    itemType={current.itemType}
                    itemId={current.itemId}
                    itemTitle={itemLabel}
                  />
                  <HighlightSelectionDialog
                    itemType={current.itemType}
                    itemId={current.itemId}
                    itemTitle={itemLabel}
                    quote={selectedText}
                    anchor={selectedAnchor}
                    onSaved={() => {
                      setSelectedText("");
                      setSelectedAnchor(undefined);
                    }}
                  />
                  <StatusControl
                    value={getStatus(map, current.itemType, current.itemId)}
                    onChange={handleStatusChange}
                    disabled={progressLoading}
                    itemLabel={itemLabel}
                  />
                  <NotesDialog
                    itemType={current.itemType}
                    itemId={current.itemId}
                    itemTitle={itemLabel}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    aria-label="Fechar leitor"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </header>
            <DialogDescription className="sr-only">
              Leitor do estudo completo. Use os botões Anterior e Próximo para
              navegar entre os estudos da coleção.
            </DialogDescription>

            <div
              ref={bodyRef}
              onMouseUp={updateSelectedText}
              onKeyUp={updateSelectedText}
              className="study-scroll min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"
            >
              {sourceInfo ? (
                <aside className="mx-auto mb-6 max-w-3xl rounded-lg border bg-muted/25 p-4 text-xs leading-relaxed text-muted-foreground" aria-label="Proveniência e revisão editorial">
                  <p className="font-semibold text-foreground">Origem e estado das referências</p>
                  <p className="mt-1">Documento-fonte: <code className="rounded bg-background px-1 py-0.5">{sourceInfo.sourceFile}</code></p>
                  <p className="mt-1">{sourceInfo.transcribedAt ? `Transcrição: ${sourceInfo.transcribedAt}.` : "Data de transcrição/revisão: ainda não registrada."}</p>
                  <p className="mt-1">{sourceInfo.editorialNote}</p>
                  <p className="mt-1">Citações e referências permanecem no corpo do texto conforme a fonte; nenhuma bibliografia externa foi acrescentada nesta conversão.</p>
                </aside>
              ) : null}
              {phase === "ready" && cached !== undefined ? (
                <MdArticle content={cached} className="mx-auto max-w-3xl" />
              ) : phase === "loading" ? (
                <ReaderSkeleton />
              ) : phase === "error" ? (
                <ErrorState onRetry={handleRetry} />
              ) : (
                <PendingState />
              )}
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-2 border-t p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                disabled={!hasPrev}
                aria-label="Estudo anterior"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Anterior
              </Button>
              {currentIndex >= 0 ? (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {currentIndex + 1} / {collection.length}
                </span>
              ) : (
                <span aria-hidden />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(1)}
                disabled={!hasNext}
                aria-label="Próximo estudo"
              >
                Próximo
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Button>
            </footer>
          </>
        ) : (
          <DialogTitle className="sr-only">Leitor de estudo</DialogTitle>
        )}
      </DialogContent>
    </Dialog>
  );
}
