"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NotesDialog } from "./notes-dialog";
import { ReaderDialog, type ReaderTarget } from "./reader-dialog";
import { StatusControl } from "./status-control";
import type { Prompt } from "@/data/types";
import type { ProgressStatus } from "@/data/types";
import { useSetProgress } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  prompt: Prompt;
  status: ProgressStatus;
  statusLoading: boolean;
}

export function PromptCard({ prompt, status, statusLoading }: PromptCardProps) {
  const setStatus = useSetProgress();
  const { toast } = useToast();
  const itemLabel = `P${prompt.number} — ${prompt.title}`;
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerTarget, setReaderTarget] = useState<ReaderTarget | null>(null);

  function openReader() {
    setReaderTarget({
      itemType: "PROMPT",
      itemId: prompt.id,
      title: prompt.title,
      prereqLabel: prompt.prereq === "—" ? undefined : prompt.prereq,
    });
    setReaderOpen(true);
  }

  function handleChange(newStatus: ProgressStatus) {
    setStatus.mutate(
      { itemType: "PROMPT", itemId: prompt.id, status: newStatus },
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
            description: `P${prompt.number} marcado como ${label}.`,
          });
        },
      },
    );
  }

  return (
    <Card className="flex h-full flex-col gap-4 p-5 transition-shadow duration-200 hover:shadow-md sm:p-6">
      <CardHeader className="p-0">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground"
          >
            {prompt.number}
          </span>
          <CardTitle className="pt-1 font-serif text-lg font-semibold leading-snug">
            {prompt.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {prompt.prereqIds.length > 0 ? (
            <>
              <span className="text-xs text-muted-foreground">Req:</span>
              {prompt.prereqIds.map((id) => (
                <Badge key={id} variant="outline" className="font-mono text-[11px]">
                  {id}
                </Badge>
              ))}
            </>
          ) : (
            <Badge variant="outline" className="text-[11px]">
              Sem pré-requisitos
            </Badge>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {prompt.centralConcept}
        </p>

        <blockquote className="mt-auto border-l-2 border-primary/50 pl-3 text-sm italic leading-relaxed text-foreground/80">
          “{prompt.fundamentalQuestion}”
        </blockquote>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t p-0 pt-4">
        <StatusControl
          value={status}
          onChange={handleChange}
          disabled={statusLoading}
          itemLabel={itemLabel}
        />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            aria-label={`Ler o estudo completo: ${itemLabel}`}
            onClick={openReader}
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Ler o estudo</span>
          </Button>
          <NotesDialog itemType="PROMPT" itemId={prompt.id} itemTitle={itemLabel} />
        </div>
      </CardFooter>

      <ReaderDialog
        target={readerTarget}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </Card>
  );
}
