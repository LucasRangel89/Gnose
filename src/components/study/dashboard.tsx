"use client";

import {
  BookMarked,
  Compass,
  Network,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConceptIndex } from "./concept-index";
import { GlossarySection } from "./glossary-section";
import { NextPromptsSection } from "./next-prompts-section";
import { OverviewTab } from "./overview-tab";
import { RoutesSection } from "./routes-section";

const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/** Corpo do dashboard: navegação por abas fixa no topo + conteúdo. */
export function Dashboard() {
  return (
    <div className={CONTAINER}>
      <Tabs defaultValue="visao-geral" className="gap-8 sm:gap-10">
        <div className="sticky top-0 z-30 -mx-4 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <TabsList className="study-scroll h-auto w-full max-w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-2 flex-nowrap sm:flex-wrap">
            <TabsTrigger value="visao-geral" className="gap-1.5">
              <Compass className="h-4 w-4" aria-hidden />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="indice" className="gap-1.5">
              <Network className="h-4 w-4" aria-hidden />
              Índice Cruzado
            </TabsTrigger>
            <TabsTrigger value="glossario" className="gap-1.5">
              <BookMarked className="h-4 w-4" aria-hidden />
              Glossário
            </TabsTrigger>
            <TabsTrigger value="rotas" className="gap-1.5">
              <RouteIcon className="h-4 w-4" aria-hidden />
              Rotas de Leitura
            </TabsTrigger>
            <TabsTrigger value="expansao" className="gap-1.5">
              <Sparkles className="h-4 w-4" aria-hidden />
              Expansão 5.x
            </TabsTrigger>
          </TabsList>
        </div>

        <main className="pb-16 sm:pb-20">
          <TabsContent value="visao-geral" className="mt-0">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="indice" className="mt-0">
            <ConceptIndex />
          </TabsContent>
          <TabsContent value="glossario" className="mt-0">
            <GlossarySection />
          </TabsContent>
          <TabsContent value="rotas" className="mt-0">
            <RoutesSection />
          </TabsContent>
          <TabsContent value="expansao" className="mt-0">
            <NextPromptsSection />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
