"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Prompt } from "@/data/types";
import { prompts } from "@/data/prompts";
import type { ReaderTarget } from "./reader-dialog";

const POSITIONS: Record<string, { x: number; y: number }> = {
  P1: { x: 105, y: 94 },
  P2: { x: 105, y: 265 },
  P3: { x: 105, y: 436 },
  P4: { x: 315, y: 436 },
  P5: { x: 493, y: 265 },
  P6: { x: 690, y: 436 },
  P7: { x: 690, y: 94 },
  P8: { x: 840, y: 265 },
  P9: { x: 930, y: 436 },
  P10: { x: 930, y: 94 },
};

function shortTitle(prompt: Prompt): string {
  const normalized = prompt.title.replace(/[—:].*$/, "").trim();
  return normalized.length > 21 ? `${normalized.slice(0, 19)}…` : normalized;
}

function edgePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

export function InfluenceGraph({ onOpenStudy }: { onOpenStudy: (target: ReaderTarget) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const edges = useMemo(
    () => prompts.flatMap((prompt) => prompt.influences.flatMap((influence) =>
      influence.influencedIds.map((targetId) => ({
        id: `${prompt.id}:${targetId}`,
        source: prompt.id,
        target: targetId,
        concept: influence.conceptTransmitted,
      })),
    )),
    [],
  );

  function open(prompt: Prompt) {
    onOpenStudy({
      itemType: "PROMPT",
      itemId: prompt.id,
      title: prompt.title,
      prereqLabel: prompt.prereq === "—" ? undefined : prompt.prereq,
    });
  }

  return (
    <Card className="overflow-hidden border-border/70 bg-card/70">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            <Network className="size-4" aria-hidden />
            Rede de influência
          </div>
          <CardTitle className="font-serif text-xl">Como as ideias se conectam</CardTitle>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            As setas representam linhas de influência direta transcritas do mapa de estudos. Selecione um nó para abrir o caderno correspondente.
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-muted-foreground sm:inline-flex">
          {edges.length} relações <ArrowUpRight className="size-3" aria-hidden />
        </span>
      </CardHeader>
      <CardContent>
        <div className="study-scroll overflow-x-auto pb-2" role="region" aria-label="Grafo interativo de influência entre os dez estudos" tabIndex={0}>
          <svg
            viewBox="0 0 1040 530"
            className="h-auto min-w-[760px] w-full"
            role="img"
            aria-labelledby="influence-graph-title influence-graph-desc"
          >
            <title id="influence-graph-title">Grafo de influências entre os estudos P1 a P10</title>
            <desc id="influence-graph-desc">Dez estudos conectados por setas direcionais de influência. Use Tab e Enter para abrir um estudo.</desc>
            <defs>
              <marker id="influence-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" className="fill-primary/55" />
              </marker>
              <radialGradient id="node-glow">
                <stop offset="0%" className="[stop-color:var(--primary)] [stop-opacity:0.16]" />
                <stop offset="100%" className="[stop-color:var(--primary)] [stop-opacity:0]" />
              </radialGradient>
            </defs>
            {edges.map((edge) => {
              const from = POSITIONS[edge.source];
              const to = POSITIONS[edge.target];
              if (!from || !to) return null;
              const isActive = activeId === edge.source || activeId === edge.target;
              return (
                <path
                  key={edge.id}
                  d={edgePath(from, to)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isActive ? 2.4 : 1.35}
                  markerEnd="url(#influence-arrow)"
                  className={isActive ? "text-primary opacity-80" : "text-primary opacity-25"}
                >
                  <title>{`${edge.source} → ${edge.target}: ${edge.concept}`}</title>
                </path>
              );
            })}
            {prompts.map((prompt) => {
              const position = POSITIONS[prompt.id];
              if (!position) return null;
              const active = activeId === prompt.id;
              return (
                <g
                  key={prompt.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Abrir ${prompt.id}: ${prompt.title}`}
                  onMouseEnter={() => setActiveId(prompt.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(prompt.id)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => open(prompt)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      open(prompt);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={position.x} cy={position.y} r={active ? 45 : 39} fill="url(#node-glow)" />
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={active ? 29 : 26}
                    className={active ? "fill-primary stroke-primary" : "fill-card stroke-primary/60"}
                    strokeWidth={active ? 2.5 : 1.5}
                  />
                  <text
                    x={position.x}
                    y={position.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={active ? "fill-primary-foreground font-mono text-[13px] font-bold" : "fill-primary font-mono text-[13px] font-bold"}
                  >
                    {prompt.id}
                  </text>
                  <text
                    x={position.x}
                    y={position.y + 43}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-medium"
                  >
                    {shortTitle(prompt)}
                  </text>
                  <title>{`${prompt.id} · ${prompt.title}. ${prompt.centralConcept}`}</title>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full border border-primary/60 bg-card" /> Estudo</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-px w-5 bg-primary/60" /> Influência direta</span>
          <span className="ml-auto">Passe o cursor para realçar conexões · Enter para abrir</span>
        </div>
      </CardContent>
    </Card>
  );
}
