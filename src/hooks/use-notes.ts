"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { ItemType } from "@/data/types";

export interface NoteRow {
  id: string;
  itemType: string;
  itemId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function notesKey(owner: string, itemType: string, itemId: string) {
  return ["notes", owner, itemType, itemId] as const;
}

function useOwner() {
  const { data } = useSession();
  return data?.user?.id ?? "local";
}

export function useNotes(itemType: ItemType, itemId: string, enabled: boolean) {
  const owner = useOwner();
  const { status } = useSession();
  return useQuery<NoteRow[]>({
    queryKey: notesKey(owner, itemType, itemId),
    enabled: enabled && status !== "loading",
    queryFn: async () => {
      const res = await fetch(
        `/api/notes?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`,
      );
      if (!res.ok) throw new Error("Falha ao carregar as notas.");
      return (await res.json()) as NoteRow[];
    },
  });
}

export function useAllNotes(enabled = true) {
  const owner = useOwner();
  const { status } = useSession();
  return useQuery<NoteRow[]>({
    queryKey: ["notes", owner, "all"],
    enabled: enabled && status !== "loading",
    queryFn: async () => {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Falha ao carregar as notas.");
      return (await res.json()) as NoteRow[];
    },
  });
}

export function useAddNote(itemType: ItemType, itemId: string) {
  const owner = useOwner();
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
      queryClient.setQueryData<NoteRow[]>(notesKey(owner, itemType, itemId), (prev) => [note, ...(prev ?? [])]);
      void queryClient.invalidateQueries({ queryKey: ["notes", owner, "all"] });
    },
  });
}

export function useDeleteNote(itemType: ItemType, itemId: string) {
  const owner = useOwner();
  const queryClient = useQueryClient();
  const key = notesKey(owner, itemType, itemId);
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao remover a nota.");
      return { ok: true as const };
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<NoteRow[]>(key) ?? [];
      queryClient.setQueryData<NoteRow[]>(key, previous.filter((note) => note.id !== id));
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => void queryClient.invalidateQueries({ queryKey: ["notes", owner, "all"] }),
  });
}

export function formatNoteDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return "";
  }
}
