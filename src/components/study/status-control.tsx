"use client";

import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { ProgressStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const OPTIONS: {
  value: ProgressStatus;
  label: string;
  shortLabel: string;
  icon: typeof Circle;
}[] = [
  { value: "NOT_STARTED", label: "Não iniciado", shortLabel: "Não iniciado", icon: Circle },
  { value: "IN_PROGRESS", label: "Em progresso", shortLabel: "Em progresso", icon: Clock3 },
  { value: "DONE", label: "Concluído", shortLabel: "Concluído", icon: CheckCircle2 },
];

const ACTIVE_CLASSES: Record<ProgressStatus, string> = {
  NOT_STARTED: "bg-secondary text-secondary-foreground",
  IN_PROGRESS:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-inner",
  DONE: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shadow-inner",
};

interface StatusControlProps {
  value: ProgressStatus;
  onChange: (status: ProgressStatus) => void;
  disabled?: boolean;
  compact?: boolean;
  /** Rótulo do item usado no aria-label dos botões. */
  itemLabel: string;
}

export function StatusControl({
  value,
  onChange,
  disabled = false,
  compact = false,
  itemLabel,
}: StatusControlProps) {
  return (
    <div
      role="group"
      aria-label={`Status de estudo: ${itemLabel}`}
      className={cn(
        "study-scroll inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border bg-background/60 p-0.5",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={`${option.label}: ${itemLabel}`}
            title={option.label}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2.5 transition-colors",
              compact ? "h-7 w-7" : "h-8",
              active
                ? ACTIVE_CLASSES[option.value]
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className={cn("shrink-0", compact ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden />
            {!compact && (
              <span className="text-xs font-medium">{option.shortLabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
