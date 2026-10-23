"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ItemType, ProgressStatus } from "@/data/types";

export interface ProgressRow {
  id: string;
  itemType: string;
  itemId: string;
  status: ProgressStatus;
  updatedAt: string;
}

export type ProgressMap = Map<string, ProgressStatus>;

/** Chave do mapa de progresso: `${itemType}:${itemId}`. */
export function progressKey(itemType: ItemType, itemId: string): string {
  return `${itemType}:${itemId}`;
}

export function useProgressRows() {
  return useQuery<ProgressRow[]>({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("Falha ao carregar o progresso.");
      return (await res.json()) as ProgressRow[];
    },
  });
}

export function useProgressMap() {
  const query = useProgressRows();
  const map: ProgressMap = new Map();
  for (const row of query.data ?? []) {
    map.set(progressKey(row.itemType as ItemType, row.itemId), row.status);
  }
  return { map, isLoading: query.isLoading, isError: query.isError };
}

export function getStatus(
  map: ProgressMap,
  itemType: ItemType,
  itemId: string,
): ProgressStatus {
  return map.get(progressKey(itemType, itemId)) ?? "NOT_STARTED";
}

/** Contagem de itens concluídos / em progresso dentro de um conjunto de ids. */
export function countStatuses(
  map: ProgressMap,
  itemType: ItemType,
  ids: string[],
) {
  let done = 0;
  let inProgress = 0;
  for (const id of ids) {
    const s = getStatus(map, itemType, id);
    if (s === "DONE") done += 1;
    else if (s === "IN_PROGRESS") inProgress += 1;
  }
  return { done, inProgress, total: ids.length };
}

export interface SetProgressVars {
  itemType: ItemType;
  itemId: string;
  status: ProgressStatus;
}

/** Mutation com atualização otimista + rollback em caso de erro. */
export function useSetProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: SetProgressVars) => {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vars),
      });
      if (!res.ok) throw new Error("Falha ao salvar o progresso.");
      return (await res.json()) as ProgressRow;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["progress"] });
      const previous =
        queryClient.getQueryData<ProgressRow[]>(["progress"]) ?? [];
      const next = [
        ...previous.filter(
          (r) => !(r.itemType === vars.itemType && r.itemId === vars.itemId),
        ),
        {
          id: `optimistic-${vars.itemType}-${vars.itemId}`,
          itemType: vars.itemType,
          itemId: vars.itemId,
          status: vars.status,
          updatedAt: new Date().toISOString(),
        },
      ];
      queryClient.setQueryData<ProgressRow[]>(["progress"], next);
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["progress"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}
