"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { ItemType } from "@/data/types";
import type { ReviewRating } from "@/lib/spaced-repetition";

export interface StudyReference {
  itemType: ItemType;
  itemId: string;
}

export interface BookmarkRow extends StudyReference {
  id: string;
  createdAt: string;
}

export interface HighlightRow extends StudyReference {
  id: string;
  quote: string;
  anchor: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryRow extends StudyReference {
  id: string;
  lastOpenedAt: string;
}

export interface ReviewRow {
  id: string;
  cardId: string;
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string;
  lastReviewedAt: string | null;
  updatedAt: string;
}

function useIdentityScope() {
  const { data, status } = useSession();
  return { scope: data?.user?.id ?? "local", ready: status !== "loading" };
}

async function fetchRows<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Não foi possível carregar os dados pessoais.");
  return (await response.json()) as T[];
}

export function useBookmarks() {
  const { scope, ready } = useIdentityScope();
  return useQuery<BookmarkRow[]>({
    queryKey: ["bookmarks", scope],
    enabled: ready,
    queryFn: () => fetchRows<BookmarkRow>("/api/bookmarks"),
  });
}

export function useToggleBookmark(itemType: ItemType, itemId: string) {
  const { scope } = useIdentityScope();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (isSaved: boolean) => {
      const response = await fetch(
        `/api/bookmarks?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`,
        isSaved ? { method: "DELETE" } : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemType, itemId }),
        },
      );
      if (!response.ok) throw new Error("Não foi possível atualizar o favorito.");
      return isSaved;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["bookmarks", scope] }),
  });
}

export function useHighlights(itemType?: ItemType, itemId?: string) {
  const { scope, ready } = useIdentityScope();
  const params = itemType && itemId
    ? `?itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`
    : "";
  return useQuery<HighlightRow[]>({
    queryKey: ["highlights", scope, itemType ?? "all", itemId ?? "all"],
    enabled: ready,
    queryFn: () => fetchRows<HighlightRow>(`/api/highlights${params}`),
  });
}

export function useAddHighlight(itemType: ItemType, itemId: string) {
  const { scope } = useIdentityScope();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ quote, note, anchor }: { quote: string; note?: string; anchor?: string }) => {
      const response = await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, quote, note, anchor }),
      });
      if (!response.ok) throw new Error("Não foi possível salvar o destaque.");
      return (await response.json()) as HighlightRow;
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["highlights", scope] });
    },
  });
}

export function useDeleteHighlight() {
  const { scope } = useIdentityScope();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/highlights?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Não foi possível remover o destaque.");
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["highlights", scope] }),
  });
}

export function useReadingHistory() {
  const { scope, ready } = useIdentityScope();
  return useQuery<HistoryRow[]>({
    queryKey: ["history", scope],
    enabled: ready,
    queryFn: () => fetchRows<HistoryRow>("/api/history"),
  });
}

export function useRecordReading() {
  const { scope } = useIdentityScope();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (target: StudyReference) => {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      });
      if (!response.ok) throw new Error("Não foi possível registrar a leitura.");
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["history", scope] }),
  });
}

export function useReviewRows() {
  const { scope, ready } = useIdentityScope();
  return useQuery<ReviewRow[]>({
    queryKey: ["reviews", scope],
    enabled: ready,
    queryFn: () => fetchRows<ReviewRow>("/api/reviews"),
  });
}

export function useReviewFlashcard() {
  const { scope } = useIdentityScope();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ cardId, rating }: { cardId: string; rating: ReviewRating }) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, rating }),
      });
      if (!response.ok) throw new Error("Não foi possível registrar a revisão.");
      return (await response.json()) as ReviewRow;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["reviews", scope] }),
  });
}
