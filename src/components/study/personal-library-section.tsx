"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Clock3, Download, FileText, Highlighter, Loader2, Search, Trash2, Upload, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeading } from "./section-heading";
import type { ItemType } from "@/data/types";
import type { ReaderTarget } from "./reader-dialog";
import { prompts } from "@/data/prompts";
import { nextPrompts } from "@/data/nextPrompts";
import { formatNoteDate, useAllNotes, useDeleteNote, type NoteRow } from "@/hooks/use-notes";
import {
  useBookmarks,
  useDeleteHighlight,
  useHighlights,
  useReadingHistory,
  useToggleBookmark,
  type BookmarkRow,
  type HighlightRow,
  type HistoryRow,
} from "@/hooks/use-personal-data";
import { useToast } from "@/hooks/use-toast";

function studyTitle(itemType: ItemType, itemId: string): string {
  if (itemType === "PROMPT") {
    return prompts.find((study) => study.id === itemId)?.title ?? itemId;
  }
  return nextPrompts.find((study) => study.id === itemId)?.title ?? itemId;
}

function StudyLink({ itemType, itemId, anchor, onOpen }: StudyReferenceProps) {
  return (
    <button type="button" onClick={() => onOpen({ itemType, itemId, title: studyTitle(itemType, itemId), anchor: anchor ?? undefined })} className="text-left font-medium text-primary hover:underline">
      {itemType === "PROMPT" ? itemId : `Prompt ${itemId}`} · {studyTitle(itemType, itemId)}
    </button>
  );
}

interface StudyReferenceProps {
  itemType: ItemType;
  itemId: string;
  anchor?: string | null;
  onOpen: (target: ReaderTarget) => void;
}

function NoteCard({ note, onOpen }: { note: NoteRow; onOpen: (target: ReaderTarget) => void }) {
  const remove = useDeleteNote(note.itemType as ItemType, note.itemId);
  const { toast } = useToast();
  async function deleteNote() {
    try {
      await remove.mutateAsync(note.id);
      toast({ title: "Nota removida" });
    } catch {
      toast({ title: "Não foi possível remover a nota", variant: "destructive" });
    }
  }
  return (
    <Card><CardContent className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3"><StudyLink itemType={note.itemType as ItemType} itemId={note.itemId} onOpen={onOpen} /><Button variant="ghost" size="icon" aria-label="Remover nota" onClick={() => void deleteNote()} disabled={remove.isPending}><Trash2 className="size-4" aria-hidden /></Button></div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
      <p className="text-[11px] text-muted-foreground">{formatNoteDate(note.createdAt)}</p>
    </CardContent></Card>
  );
}

function BookmarkCard({ bookmark, onOpen }: { bookmark: BookmarkRow; onOpen: (target: ReaderTarget) => void }) {
  const remove = useToggleBookmark(bookmark.itemType, bookmark.itemId);
  const { toast } = useToast();
  async function toggle() {
    try {
      await remove.mutateAsync(true);
      toast({ title: "Favorito removido" });
    } catch {
      toast({ title: "Não foi possível remover o favorito", variant: "destructive" });
    }
  }
  return (
    <Card><CardContent className="flex items-center justify-between gap-3 p-4">
      <StudyLink itemType={bookmark.itemType} itemId={bookmark.itemId} onOpen={onOpen} />
      <Button variant="ghost" size="icon" aria-label="Remover favorito" onClick={() => void toggle()} disabled={remove.isPending}><Bookmark className="size-4 text-primary" aria-hidden /></Button>
    </CardContent></Card>
  );
}

function HighlightCard({ highlight, onOpen }: { highlight: HighlightRow; onOpen: (target: ReaderTarget) => void }) {
  const remove = useDeleteHighlight();
  const { toast } = useToast();
  async function deleteHighlight() {
    try {
      await remove.mutateAsync(highlight.id);
      toast({ title: "Destaque removido" });
    } catch {
      toast({ title: "Não foi possível remover o destaque", variant: "destructive" });
    }
  }
  return (
    <Card><CardContent className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3"><StudyLink itemType={highlight.itemType} itemId={highlight.itemId} anchor={highlight.anchor} onOpen={onOpen} /><Button variant="ghost" size="icon" aria-label="Remover destaque" onClick={() => void deleteHighlight()} disabled={remove.isPending}><Trash2 className="size-4" aria-hidden /></Button></div>
      <blockquote className="border-l-2 border-primary/60 pl-3 text-sm leading-relaxed">{highlight.quote}</blockquote>
      {highlight.note ? <p className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">{highlight.note}</p> : null}
      <p className="text-[11px] text-muted-foreground">{formatNoteDate(highlight.createdAt)}</p>
    </CardContent></Card>
  );
}

function HistoryCard({ row, onOpen }: { row: HistoryRow; onOpen: (target: ReaderTarget) => void }) {
  return (
    <Card><CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <StudyLink itemType={row.itemType} itemId={row.itemId} onOpen={onOpen} />
      <span className="text-[11px] text-muted-foreground">Aberto em {formatNoteDate(row.lastOpenedAt)}</span>
    </CardContent></Card>
  );
}

function EmptyPanel({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return <div className="rounded-xl border border-dashed p-10 text-center"><Icon className="mx-auto size-7 text-muted-foreground/60" aria-hidden /><p className="mt-3 text-sm text-muted-foreground">{children}</p></div>;
}

export function PersonalLibrarySection({ onOpenStudy }: { onOpenStudy: (target: ReaderTarget) => void }) {
  const [search, setSearch] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const notes = useAllNotes();
  const bookmarks = useBookmarks();
  const highlights = useHighlights();
  const history = useReadingHistory();
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const filteredNotes = useMemo(() => (notes.data ?? []).filter((row) => `${row.content} ${studyTitle(row.itemType as ItemType, row.itemId)}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch)), [notes.data, normalizedSearch]);
  const filteredHighlights = useMemo(() => (highlights.data ?? []).filter((row) => `${row.quote} ${row.note ?? ""} ${studyTitle(row.itemType, row.itemId)}`.toLocaleLowerCase("pt-BR").includes(normalizedSearch)), [highlights.data, normalizedSearch]);

  const loading = notes.isLoading || bookmarks.isLoading || highlights.isLoading || history.isLoading;
  const hasError = notes.isError || bookmarks.isError || highlights.isError || history.isError;

  async function handleRestore(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Backup acima do limite", description: "O tamanho máximo é 10 MB.", variant: "destructive" });
      return;
    }
    if (!window.confirm("Restaurar este backup substituirá notas, progresso, favoritos, destaques, histórico e revisões atuais desta conta. Continuar?")) return;
    setIsRestoring(true);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await file.text(),
      });
      const payload = await response.json().catch(() => null) as { error?: string; counts?: Record<string, number> } | null;
      if (!response.ok) throw new Error(payload?.error ?? "Arquivo inválido.");
      await queryClient.invalidateQueries();
      const total = Object.values(payload?.counts ?? {}).reduce((sum, count) => sum + count, 0);
      toast({ title: "Backup restaurado", description: `${total} registros importados para esta conta.` });
    } catch (error) {
      toast({ title: "Falha ao restaurar backup", description: error instanceof Error ? error.message : "Confira o arquivo e tente novamente.", variant: "destructive" });
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        overline="Seu espaço"
        title="Minha biblioteca"
        description="Favoritos, notas, trechos destacados e histórico ficam isolados no seu perfil. Exporte um backup JSON quando quiser guardar ou migrar seus dados."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar em notas e destaques…" aria-label="Buscar nas anotações pessoais" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="gap-2">
            <a href="/api/export"><Download className="size-4" aria-hidden />Exportar backup JSON</a>
          </Button>
          <Button type="button" variant="outline" className="gap-2" disabled={isRestoring} onClick={() => restoreInputRef.current?.click()}>
            {isRestoring ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
            Restaurar backup
          </Button>
          <input ref={restoreInputRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Selecionar arquivo JSON de backup" onChange={handleRestore} />
        </div>
      </div>

      {loading ? <div className="flex items-center justify-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" aria-hidden />Carregando sua biblioteca…</div> : null}
      {hasError ? <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">Não foi possível carregar todos os dados pessoais. Verifique o banco ou sua sessão e tente novamente.</div> : null}

      <Tabs defaultValue="notes" className="space-y-5">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="notes" className="gap-1.5"><FileText className="size-3.5" aria-hidden />Notas <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{notes.data?.length ?? 0}</Badge></TabsTrigger>
          <TabsTrigger value="bookmarks" className="gap-1.5"><Bookmark className="size-3.5" aria-hidden />Favoritos <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{bookmarks.data?.length ?? 0}</Badge></TabsTrigger>
          <TabsTrigger value="highlights" className="gap-1.5"><Highlighter className="size-3.5" aria-hidden />Destaques <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{highlights.data?.length ?? 0}</Badge></TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><Clock3 className="size-3.5" aria-hidden />Histórico <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{history.data?.length ?? 0}</Badge></TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-3">
          {filteredNotes.length ? filteredNotes.map((row) => <NoteCard key={row.id} note={row} onOpen={onOpenStudy} />) : <EmptyPanel icon={FileText}>{normalizedSearch ? "Nenhuma nota corresponde à busca." : "Suas notas de estudo aparecerão aqui."}</EmptyPanel>}
        </TabsContent>
        <TabsContent value="bookmarks" className="space-y-3">
          {(bookmarks.data ?? []).length ? bookmarks.data?.map((row) => <BookmarkCard key={row.id} bookmark={row} onOpen={onOpenStudy} />) : <EmptyPanel icon={Bookmark}>Ainda não há estudos favoritos. Use o ícone de marcador dentro do leitor.</EmptyPanel>}
        </TabsContent>
        <TabsContent value="highlights" className="space-y-3">
          {filteredHighlights.length ? filteredHighlights.map((row) => <HighlightCard key={row.id} highlight={row} onOpen={onOpenStudy} />) : <EmptyPanel icon={Highlighter}>{normalizedSearch ? "Nenhum destaque corresponde à busca." : "Selecione um trecho no leitor e use Destacar para guardá-lo."}</EmptyPanel>}
        </TabsContent>
        <TabsContent value="history" className="space-y-3">
          {(history.data ?? []).length ? history.data?.map((row) => <HistoryCard key={row.id} row={row} onOpen={onOpenStudy} />) : <EmptyPanel icon={Clock3}>Os estudos que você abrir aparecerão no histórico.</EmptyPanel>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
