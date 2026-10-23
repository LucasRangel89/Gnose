"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ItemType } from "@/data/types";

export interface NoteRow {
  id: string;
  itemType: string;
  itemId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function notesKey(itemType: string, itemId: string) {
  return ["notes", itemType, itemId] as const;
}

export function useNotes(
  itemType: ItemType,
  itemId: string,
  enabled: boolean,
) {
  return useQuery<NoteRow[]>({
    queryKey: notesKey(itemType, itemId),
    enabled,
    queryFn: async () => {
      const res = await fetch(
        `/api/notes?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`,
      );
      if (!res.ok) throw new Error("Falha ao carregar as notas.");
      return (await res.json()) as NoteRow[];
    },
  });
}

export function useAddNote(itemType: ItemType, itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, content }),
      });
      if (!res.ok) throw new Error("Falha ao salvar a nota.");
      return (await res.json()) as NoteRow;
    },
    onSuccess: (note) => {
      queryClient.setQueryData<NoteRow[]>(
        notesKey(itemType, itemId),
        (prev) => [note, ...(prev ?? [])],
      );
    },
  });
}

export function useDeleteNote(itemType: ItemType, itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao remover a nota.");
      return { ok: true as const };
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notesKey(itemType, itemId) });
      const previous =
        queryClient.getQueryData<NoteRow[]>(notesKey(itemType, itemId)) ?? [];
      queryClient.setQueryData<NoteRow[]>(
        notesKey(itemType, itemId),
        previous.filter((n) => n.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notesKey(itemType, itemId), context.previous);
      }
    },
  });
}

export function formatNoteDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
