"use client";

import { useState } from "react";
import { Loader2, MessageSquarePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  formatNoteDate,
  useAddNote,
  useDeleteNote,
  useNotes,
} from "@/hooks/use-notes";
import type { ItemType } from "@/data/types";

interface NotesDialogProps {
  itemType: ItemType;
  itemId: string;
  itemTitle: string;
}

/** Diálogo de notas de estudo de um item, persistidas no banco via API. */
export function NotesDialog({ itemType, itemId, itemTitle }: NotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { toast } = useToast();

  const notesQuery = useNotes(itemType, itemId, open);
  const addNote = useAddNote(itemType, itemId);
  const deleteNote = useDeleteNote(itemType, itemId);

  const notes = notesQuery.data ?? [];

  async function handleAdd() {
    const content = draft.trim();
    if (!content) return;
    try {
      await addNote.mutateAsync(content);
      setDraft("");
      toast({ title: "Nota adicionada", description: itemTitle });
    } catch {
      toast({
        title: "Erro ao salvar a nota",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote.mutateAsync(id);
      toast({ title: "Nota removida" });
    } catch {
      toast({
        title: "Erro ao remover a nota",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          aria-label={`Notas de estudo: ${itemTitle}`}
        >
          <MessageSquarePlus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Notas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Notas de estudo</DialogTitle>
          <DialogDescription className="line-clamp-2">{itemTitle}</DialogDescription>
        </DialogHeader>

        <div className="study-scroll max-h-64 space-y-2 overflow-y-auto pr-1">
          {notesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            </div>
          ) : notesQuery.isError ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Não foi possível carregar as notas.
            </p>
          ) : notes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma nota ainda. Registre seus insights abaixo — eles ficam
              salvos automaticamente.
            </p>
          ) : (
            notes.map((note) => (
              <article
                key={note.id}
                className="group rounded-lg border bg-card/60 p-3"
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {note.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <time className="text-xs text-muted-foreground">
                    {formatNoteDate(note.createdAt)}
                  </time>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                    aria-label="Remover nota"
                    onClick={() => void handleDelete(note.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="space-y-2 border-t pt-4">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escreva sua reflexão sobre este item…"
            rows={3}
            maxLength={5000}
            aria-label="Nova nota"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => void handleAdd()}
              disabled={addNote.isPending || !draft.trim()}
              className="gap-1.5"
            >
              {addNote.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Plus className="h-4 w-4" aria-hidden />
              )}
              Adicionar nota
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
