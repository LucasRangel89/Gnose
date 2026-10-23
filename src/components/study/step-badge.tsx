import type { ProgressStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<ProgressStatus, string> = {
  NOT_STARTED: "border-border bg-card text-muted-foreground",
  IN_PROGRESS:
    "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DONE: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

interface StepBadgeProps {
  /** "P5" ou "5.6". */
  id: string;
  status: ProgressStatus;
}

/** Badge de um passo de rota, colorido conforme o status do item. */
export function StepBadge({ id, status }: StepBadgeProps) {
  return (
    <span
      title={
        status === "DONE"
          ? "Concluído"
          : status === "IN_PROGRESS"
            ? "Em progresso"
            : "Não iniciado"
      }
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 font-mono text-xs font-medium transition-colors",
        STATUS_CLASSES[status],
      )}
    >
      {id}
    </span>
  );
}
