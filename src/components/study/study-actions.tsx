"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ItemType } from "@/data/types";
import { useToast } from "@/hooks/use-toast";
import { useAddHighlight, useBookmarks, useToggleBookmark } from "@/hooks/use-personal-data";

export function FavoriteToggle({ itemType, itemId, itemTitle }: {
  itemType: ItemType;
  itemId: string;
  itemTitle: string;
}) {
  const bookmarks = useBookmarks();
  const toggle = useToggleBookmark(itemType, itemId);
  const { toast } = useToast();
  const saved = bookmarks.data?.some((row) => row.itemType === itemType && row.itemId === itemId) ?? false;

  async function handleClick() {
    try {
      await toggle.mutateAsync(saved);
      toast({ title: saved ? "Removido dos favoritos" : "Adicionado aos favoritos", description: itemTitle });
    } catch {
      toast({ title: "Não foi possível atualizar o favorito", description: "Verifique a conexão ou sua sessão.", variant: "destructive" });
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={saved ? "gap-1.5 text-primary" : "gap-1.5 text-muted-foreground"}
      aria-pressed={saved}
      aria-label={saved ? `Remover ${itemTitle} dos favoritos` : `Adicionar ${itemTitle} aos favoritos`}
      disabled={toggle.isPending || bookmarks.isLoading}
      onClick={() => void handleClick()}
    >
      {toggle.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : saved ? <BookmarkCheck className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
      <span className="hidden md:inline">{saved ? "Favorito" : "Favoritar"}</span>
    </Button>
  );
}

export function HighlightSelectionDialog({
  itemType,
  itemId,
  itemTitle,
  quote,
  anchor,
  onSaved,
}: {
  itemType: ItemType;
  itemId: string;
  itemTitle: string;
  quote: string;
  anchor?: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const addHighlight = useAddHighlight(itemType, itemId);
  const { toast } = useToast();

  async function handleSave() {
    if (!quote.trim()) return;
    try {
      await addHighlight.mutateAsync({ quote: quote.slice(0, 3000), note: note.trim(), anchor });
      setOpen(false);
      setNote("");
      onSaved();
      toast({ title: "Destaque guardado", description: itemTitle });
    } catch {
      toast({ title: "Não foi possível guardar o destaque", description: "Verifique a conexão ou sua sessão.", variant: "destructive" });
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground"
        aria-label="Guardar seleção como destaque"
        disabled={!quote.trim() || addHighlight.isPending}
        onClick={() => setOpen(true)}
      >
        <Quote className="size-4" aria-hidden />
        <span className="hidden md:inline">Destacar</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar trecho destacado</DialogTitle>
            <DialogDescription>{itemTitle}</DialogDescription>
          </DialogHeader>
          <blockquote className="max-h-40 overflow-y-auto rounded-md border-l-2 border-primary bg-primary/5 px-3 py-2 text-sm leading-relaxed">
            {quote.slice(0, 3000)}
          </blockquote>
          <label className="space-y-2 text-sm font-medium">
            Nota (opcional)
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} placeholder="Por que este trecho é importante?" />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => void handleSave()} disabled={addHighlight.isPending}>
              {addHighlight.isPending ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> : null}
              Guardar destaque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
