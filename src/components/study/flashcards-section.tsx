"use client";

import { useMemo, useState } from "react";
import { BrainCircuit, Check, RotateCcw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { glossary } from "@/data/glossary";
import { prompts } from "@/data/prompts";
import type { ReaderTarget } from "./reader-dialog";
import { useReviewFlashcard, useReviewRows } from "@/hooks/use-personal-data";
import type { ReviewRating } from "@/lib/spaced-repetition";
import { useToast } from "@/hooks/use-toast";

const RATINGS: { value: ReviewRating; label: string; helper: string; variant: "outline" | "secondary" | "default" }[] = [
  { value: "again", label: "De novo", helper: "1 dia", variant: "outline" },
  { value: "hard", label: "Difícil", helper: "curto", variant: "outline" },
  { value: "good", label: "Lembrei", helper: "normal", variant: "secondary" },
  { value: "easy", label: "Fácil", helper: "longo", variant: "default" },
];

export function FlashcardsSection({ onOpenStudy }: { onOpenStudy: (target: ReaderTarget) => void }) {
  const [revealed, setRevealed] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);
  const reviews = useReviewRows();
  const reviewMutation = useReviewFlashcard();
  const { toast } = useToast();
  const reviewById = useMemo(() => new Map((reviews.data ?? []).map((row) => [row.cardId, row])), [reviews.data]);
  const dueCards = useMemo(() => {
    const now = Date.now();
    return glossary
      .filter((term) => {
        const review = reviewById.get(term.id);
        return !review || new Date(review.dueAt).getTime() <= now;
      })
      .sort((a, b) => {
        const aDue = reviewById.get(a.id)?.dueAt ?? "";
        const bDue = reviewById.get(b.id)?.dueAt ?? "";
        return aDue.localeCompare(bDue);
      });
  }, [reviewById]);
  const card = dueCards[0];
  const reviewedCount = reviews.data?.filter((row) => row.lastReviewedAt).length ?? 0;

  async function rate(rating: ReviewRating) {
    if (!card) return;
    try {
      await reviewMutation.mutateAsync({ cardId: card.id, rating });
      setReviewedToday((count) => count + 1);
      setRevealed(false);
    } catch {
      toast({ title: "Não foi possível registrar a revisão", description: "Verifique a conexão ou sua sessão.", variant: "destructive" });
    }
  }

  function openStudy(id: string) {
    const prompt = prompts.find((item) => item.id === id);
    if (!prompt) return;
    onOpenStudy({
      itemType: "PROMPT",
      itemId: prompt.id,
      title: prompt.title,
      prereqLabel: prompt.prereq === "—" ? undefined : prompt.prereq,
    });
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        overline="Estudo ativo"
        title="Revisão espaçada"
        description="Pratique os termos do glossário com cartões de evocação ativa. A agenda inspirada no SM-2 ajusta o intervalo conforme a facilidade da resposta."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><CardContent className="flex items-center gap-3 p-0"><BrainCircuit className="size-5 text-primary" aria-hidden /><div><p className="text-xl font-semibold tabular-nums">{reviews.isLoading ? "—" : dueCards.length}</p><p className="text-xs text-muted-foreground">cartões para revisar agora</p></div></CardContent></Card>
        <Card className="p-4"><CardContent className="flex items-center gap-3 p-0"><Check className="size-5 text-primary" aria-hidden /><div><p className="text-xl font-semibold tabular-nums">{reviewedToday}</p><p className="text-xs text-muted-foreground">revisões nesta sessão</p></div></CardContent></Card>
        <Card className="p-4"><CardContent className="flex items-center gap-3 p-0"><Sparkles className="size-5 text-primary" aria-hidden /><div><p className="text-xl font-semibold tabular-nums">{reviewedCount}/{glossary.length}</p><p className="text-xs text-muted-foreground">termos já revisados</p></div></CardContent></Card>
      </div>

      {reviews.isError ? (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          O progresso de revisão não foi carregado. Tente novamente ou verifique o banco de dados.
          <Button className="ml-3" size="sm" variant="outline" onClick={() => void reviews.refetch()}>Tentar novamente</Button>
        </div>
      ) : null}

      {reviews.isLoading ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">Preparando seus cartões…</Card>
      ) : card ? (
        <Card className="mx-auto max-w-3xl overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
          <div className="flex items-center justify-between border-b bg-primary/[0.035] px-5 py-3 text-xs text-muted-foreground">
            <span>Cartão {glossary.length - dueCards.length + 1} · sessão de hoje</span>
            <span className="inline-flex items-center gap-1"><RotateCcw className="size-3.5" aria-hidden />Evocação ativa</span>
          </div>
          <CardContent className="p-6 sm:p-10">
            <div className="min-h-52">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{revealed ? "Resposta" : "Termo"}</p>
              {!revealed ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-6 text-center">
                  <h3 className="font-serif text-3xl font-semibold sm:text-4xl">{card.term}</h3>
                  <Badge variant="outline">{card.tradition}</Badge>
                  <Button onClick={() => setRevealed(true)}>Revelar resposta</Button>
                </div>
              ) : (
                <div className="mx-auto max-w-2xl space-y-5 pt-5">
                  <h3 className="text-center font-serif text-2xl font-semibold">{card.term}</h3>
                  <p className="text-center text-xs text-muted-foreground">{card.tradition}</p>
                  <div className="space-y-3">
                    {card.definition.split("||").map((definition, index) => (
                      <p key={index} className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">{definition.trim()}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="mr-1 text-xs text-muted-foreground">Relaciona-se a:</span>
                    {card.prompts.map((id) => (
                      <button key={id} type="button" onClick={() => openStudy(id)} className="rounded border px-2 py-1 font-mono text-xs text-primary hover:bg-primary/10">{id}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {revealed ? (
              <div className="mt-7 border-t pt-5">
                <p className="mb-3 text-center text-xs font-medium text-muted-foreground">Como foi lembrar?</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {RATINGS.map((rating) => (
                    <Button key={rating.value} variant={rating.variant} className="h-auto flex-col gap-0.5 py-2" disabled={reviewMutation.isPending} onClick={() => void rate(rating.value)}>
                      <span>{rating.label}</span><span className="text-[10px] opacity-70">{rating.helper}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <Card className="mx-auto max-w-3xl border-primary/20 p-10 text-center">
          <Check className="mx-auto size-8 text-primary" aria-hidden />
          <h3 className="mt-3 font-serif text-xl font-semibold">Tudo revisado por enquanto</h3>
          <p className="mt-2 text-sm text-muted-foreground">Seus {reviewedCount} cartões já estão agendados para uma próxima sessão. Volte quando vencerem.</p>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">Baseado no glossário de {glossary.length} termos · avaliações e agenda sincronizadas com seu perfil</p>
    </div>
  );
}
