"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  BrainCircuit,
  Bookmark,
  Compass,
  Command as CommandIcon,
  Menu,
  Network,
  Route as RouteIcon,
  Search,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { AuthControl } from "./auth-control";
import { OverviewTab } from "./overview-tab";
import { PersonalLibrarySection } from "./personal-library-section";
import { FlashcardsSection } from "./flashcards-section";
import { StudiesSection } from "./studies-section";
import { ConceptIndex } from "./concept-index";
import { GlossarySection } from "./glossary-section";
import { RoutesSection } from "./routes-section";
import { NextPromptsSection } from "./next-prompts-section";
import { ReaderDialog, type ReaderTarget } from "./reader-dialog";
import { concepts } from "@/data/concepts";
import { glossary } from "@/data/glossary";
import { nextPrompts } from "@/data/nextPrompts";
import { prompts } from "@/data/prompts";
import { useProgressMap, countStatuses } from "@/hooks/use-progress";
import type { ItemType } from "@/data/types";
import { cn } from "@/lib/utils";
import { normalizeSearchText } from "@/lib/content-search";

export type DashboardSection =
  | "overview"
  | "studies"
  | "concepts"
  | "glossary"
  | "routes"
  | "expansion"
  | "library"
  | "flashcards";

interface NavigationItem {
  id: DashboardSection;
  label: string;
  helper: string;
  icon: LucideIcon;
}

const NAV_GROUPS: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Navegação",
    items: [
      { id: "overview", label: "Visão geral", helper: "Panorama do acervo", icon: Compass },
      { id: "studies", label: "Cadernos de estudo", helper: "21 estudos da série", icon: BookOpen },
    ],
  },
  {
    label: "Explorar acervo",
    items: [
      { id: "concepts", label: "Mapa de conceitos", helper: "Conexões entre ideias", icon: Network },
      { id: "glossary", label: "Glossário", helper: "Termos e tradições", icon: BookMarked },
      { id: "routes", label: "Rotas de leitura", helper: "Percursos por tema", icon: RouteIcon },
      { id: "expansion", label: "Expansão 5.x", helper: "Aprofundamentos", icon: Sparkles },
    ],
  },
  {
    label: "Meu estudo",
    items: [
      { id: "library", label: "Minha biblioteca", helper: "Notas, favoritos e histórico", icon: Bookmark },
      { id: "flashcards", label: "Revisão espaçada", helper: "Flashcards do glossário", icon: BrainCircuit },
    ],
  },
];

const SECTION_TITLES: Record<DashboardSection, string> = {
  overview: "Visão geral",
  studies: "Cadernos de estudo",
  concepts: "Mapa de conceitos",
  glossary: "Glossário",
  routes: "Rotas de leitura",
  expansion: "Expansão 5.x",
  library: "Minha biblioteca",
  flashcards: "Revisão espaçada",
};

type SearchKind = "navigation" | "study" | "passage" | "concept" | "glossary";

interface SearchResult {
  key: string;
  title: string;
  description: string;
  searchable: string;
  kind: SearchKind;
  section: DashboardSection;
  query?: string;
  target?: ReaderTarget;
}

interface PassageApiResult {
  itemType: ItemType;
  itemId: string;
  studyTitle: string;
  sectionTitle: string;
  anchor: string;
  excerpt: string;
  score: number;
}

function normalizeSearch(value: string): string {
  return normalizeSearchText(value);
}

function createSearchIndex(): SearchResult[] {
  const navigation: SearchResult[] = NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      key: `nav:${item.id}`,
      title: item.label,
      description: item.helper,
      searchable: `${item.label} ${item.helper} ${group.label}`,
      kind: "navigation" as const,
      section: item.id,
    })),
  );

  const originalStudies: SearchResult[] = prompts.map((prompt) => {
    const itemId = prompt.id;
    const title = `P${prompt.number} · ${prompt.title}`;
    const description = prompt.centralConcept;
    return {
      key: `study:${itemId}`,
      title,
      description,
      searchable: `${title} ${description} ${prompt.fundamentalQuestion}`,
      kind: "study",
      section: "studies",
      target: {
        itemType: "PROMPT",
        itemId,
        title: prompt.title,
        prereqLabel: prompt.prereq === "—" ? undefined : prompt.prereq,
      },
    };
  });

  const expansionStudies: SearchResult[] = nextPrompts.map((prompt) => {
    const title = `${prompt.id} · ${prompt.title}`;
    const description = prompt.fronts.map((front) => front.text).join(" ");
    return {
      key: `study:${prompt.id}`,
      title,
      description: `Expansão 5.x · ${prompt.prereq}`,
      searchable: `${title} ${description} ${prompt.prereq} ${prompt.intro ?? ""}`,
      kind: "study",
      section: "expansion",
      target: {
        itemType: "NEXT_PROMPT",
        itemId: prompt.id,
        title: prompt.title,
        prereqLabel: prompt.prereq,
      },
    };
  });

  const conceptResults: SearchResult[] = concepts.map((concept) => ({
    key: `concept:${concept.id}`,
    title: concept.name,
    description: `Mapa de conceitos · Prompts ${concept.prompts.join(", ")}`,
    searchable: `${concept.name} ${concept.note} ${concept.prompts.join(" ")}`,
    kind: "concept",
    section: "concepts",
    query: concept.name,
  }));

  const glossaryResults: SearchResult[] = glossary.map((term) => ({
    key: `glossary:${term.id}`,
    title: term.term,
    description: term.tradition,
    searchable: `${term.term} ${term.tradition} ${term.definition} ${term.prompts.join(" ")}`,
    kind: "glossary",
    section: "glossary",
    query: term.term,
  }));

  return [
    ...navigation,
    ...originalStudies,
    ...expansionStudies,
    ...conceptResults,
    ...glossaryResults,
  ];
}

const SEARCH_INDEX = createSearchIndex();

function SidebarNavigation({
  activeSection,
  onNavigate,
  done,
  total,
  isLoading,
  isError,
  onSearch,
  mobile = false,
}: {
  activeSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  done: number;
  total: number;
  isLoading: boolean;
  isError: boolean;
  onSearch: () => void;
  mobile?: boolean;
}) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-7 pt-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/35 bg-primary/10 font-serif text-2xl font-semibold text-primary shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_12%,transparent)]">
          G
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-xl font-semibold leading-none tracking-wide">Gnose</span>
          <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Atlas de estudos</span>
        </span>
      </div>

      <div className="px-4 pb-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-start gap-2.5 rounded-xl border-sidebar-border bg-background/40 px-3 text-muted-foreground shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onSearch}
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left text-sm">Buscar no acervo</span>
          <kbd className="rounded border bg-background/80 px-1.5 py-0.5 font-mono text-[9px]">Ctrl/⌘ K</kbd>
        </Button>
      </div>

      <nav aria-label="Navegação principal" className="study-scroll flex-1 space-y-7 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.19em] text-muted-foreground/70">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-primary/12 text-primary shadow-[inset_2px_0_0_var(--primary)]"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon className={cn("size-[18px] shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">{item.label}</span>
                      </span>
                      {item.id === "expansion" ? (
                        <Badge variant="outline" className="h-5 border-primary/25 px-1.5 font-mono text-[9px] text-primary">11</Badge>
                      ) : null}
                      {active ? <ArrowRight className="size-3.5 text-primary/80" aria-hidden /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-2xl border border-sidebar-border bg-background/35 p-3.5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <BookOpenCheck className="size-4 text-primary" aria-hidden />
              Seu percurso
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {isLoading ? "…" : `${done}/${total}`}
            </span>
          </div>
          <Progress value={percent} aria-label={`${percent}% do acervo concluído`} className="h-1.5" />
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{isError ? "Sincronização indisponível" : `${percent}% concluído`}</span>
            <span>21 estudos</span>
          </div>
        </div>
        <p className="mt-3 px-1 text-[10px] leading-relaxed text-muted-foreground/70">
          Um mapa para explorar ideias, tradições e conexões.
        </p>
      </div>

      {mobile ? null : <span className="sr-only">Menu de navegação fixo</span>}
    </div>
  );
}

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [passageSearchData, setPassageSearchData] = useState<{ query: string; results: SearchResult[] }>({ query: "", results: [] });
  const [conceptSearch, setConceptSearch] = useState("");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerTarget, setReaderTarget] = useState<ReaderTarget | null>(null);
  const { map, isLoading, isError } = useProgressMap();

  const progress = countStatuses(
    map,
    "PROMPT",
    prompts.map((prompt) => prompt.id),
  );
  const expansionProgress = countStatuses(
    map,
    "NEXT_PROMPT",
    nextPrompts.map((prompt) => prompt.id),
  );
  const done = progress.done + expansionProgress.done;
  const total = progress.total + expansionProgress.total;

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
          if (!response.ok) throw new Error("Search unavailable");
          const payload = await response.json() as { results: PassageApiResult[] };
          const results: SearchResult[] = payload.results.map((hit) => {
            const study = hit.itemType === "PROMPT"
              ? prompts.find((item) => item.id === hit.itemId)
              : nextPrompts.find((item) => item.id === hit.itemId);
            return {
              key: `passage:${hit.itemType}:${hit.itemId}:${hit.anchor}`,
              title: `${hit.studyTitle} · ${hit.sectionTitle}`,
              description: hit.excerpt,
              searchable: `${hit.studyTitle} ${hit.sectionTitle} ${hit.excerpt}`,
              kind: "passage",
              section: hit.itemType === "PROMPT" ? "studies" : "expansion",
              target: {
                itemType: hit.itemType,
                itemId: hit.itemId,
                title: study?.title ?? hit.studyTitle,
                anchor: hit.anchor,
              },
            };
          });
          setPassageSearchData({ query, results });
        } catch {
          if (!controller.signal.aborted) setPassageSearchData({ query, results: [] });
        }
      })();
    }, 220);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  const currentQuery = searchQuery.trim();
  const passageResults = passageSearchData.query === currentQuery ? passageSearchData.results : [];
  const passageSearchLoading = currentQuery.length >= 2 && passageSearchData.query !== currentQuery;
  const searchResults = useMemo(() => {
    const query = normalizeSearch(currentQuery);
    if (!query) return [];
    const local = SEARCH_INDEX.filter((result) => normalizeSearch(result.searchable).includes(query));
    return [...local, ...passageResults];
  }, [currentQuery, passageResults]);

  function navigate(section: DashboardSection) {
    setActiveSection(section);
    setMobileNavOpen(false);
  }

  function openSearch() {
    setSearchQuery("");
    setSearchOpen(true);
  }

  function openStudy(target: ReaderTarget) {
    setReaderTarget(target);
    setReaderOpen(true);
  }

  function selectSearchResult(result: SearchResult) {
    navigate(result.section);
    if (result.kind === "concept") setConceptSearch(result.query ?? result.title);
    if (result.kind === "glossary") setGlossarySearch(result.query ?? result.title);
    if (result.target) openStudy(result.target);
    setSearchOpen(false);
    setSearchQuery("");
  }

  let content: ReactNode;
  switch (activeSection) {
    case "studies":
      content = <StudiesSection />;
      break;
    case "concepts":
      content = <ConceptIndex searchValue={conceptSearch} onSearchChange={setConceptSearch} onOpenStudy={openStudy} />;
      break;
    case "glossary":
      content = <GlossarySection searchValue={glossarySearch} onSearchChange={setGlossarySearch} />;
      break;
    case "routes":
      content = <RoutesSection />;
      break;
    case "expansion":
      content = <NextPromptsSection />;
      break;
    case "library":
      content = <PersonalLibrarySection onOpenStudy={openStudy} />;
      break;
    case "flashcards":
      content = <FlashcardsSection onOpenStudy={openStudy} />;
      break;
    default:
      content = <OverviewTab onNavigate={navigate} />;
  }

  const resultGroups: { label: string; kind: SearchKind; icon: LucideIcon; items: SearchResult[] }[] = [
    { label: "Navegação", kind: "navigation", icon: Compass, items: searchResults.filter((item) => item.kind === "navigation").slice(0, 4) },
    { label: "Estudos", kind: "study", icon: BookOpen, items: searchResults.filter((item) => item.kind === "study").slice(0, 6) },
    { label: "Trechos nos estudos", kind: "passage", icon: BookOpen, items: searchResults.filter((item) => item.kind === "passage").slice(0, 8) },
    { label: "Mapa de conceitos", kind: "concept", icon: Network, items: searchResults.filter((item) => item.kind === "concept").slice(0, 4) },
    { label: "Glossário", kind: "glossary", icon: BookMarked, items: searchResults.filter((item) => item.kind === "glossary").slice(0, 4) },
  ];
  const visibleResultGroups = resultGroups.filter((group) => group.items.length > 0);

  return (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <div className="dashboard-atmosphere min-h-screen">
        <div aria-hidden className="dashboard-grid pointer-events-none fixed inset-x-0 top-0 z-0 h-[520px] opacity-40" />
        <div className="relative z-10 flex min-h-screen">
          <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-sidebar-border bg-sidebar/90 lg:block">
            <SidebarNavigation
              activeSection={activeSection}
              onNavigate={navigate}
              done={done}
              total={total}
              isLoading={isLoading}
              isError={isError}
              onSearch={openSearch}
            />
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
              <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-10">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="-ml-2 shrink-0 lg:hidden" aria-label="Abrir menu de navegação">
                    <Menu className="size-5" aria-hidden />
                  </Button>
                </SheetTrigger>
                <div className="min-w-0">
                  <p className="hidden text-[10px] font-semibold uppercase tracking-[0.19em] text-muted-foreground sm:block">Gnose <span className="mx-1 text-primary/60">/</span> Acervo</p>
                  <h1 className="truncate text-sm font-medium">{SECTION_TITLES[activeSection]}</h1>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-[min(38vw,280px)] justify-start gap-2 rounded-xl border-border/80 bg-card/50 px-3 text-muted-foreground shadow-none hover:bg-card hover:text-foreground sm:w-[260px]"
                    onClick={openSearch}
                  >
                    <Search className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-left text-xs sm:text-sm">Buscar estudos e conceitos…</span>
                    <kbd className="hidden rounded border bg-background/70 px-1.5 py-0.5 font-mono text-[9px] lg:inline-flex">Ctrl/⌘K</kbd>
                  </Button>
                  <AuthControl />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main className="mx-auto min-h-[calc(100vh-68px)] w-full max-w-[1600px] px-4 pb-12 pt-7 sm:px-6 sm:pt-9 lg:px-10 lg:pt-10">
              <div key={activeSection} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                {content}
              </div>
            </main>

            <footer className="border-t border-border/70 px-4 py-5 text-center text-[11px] text-muted-foreground sm:px-6 lg:px-10">
              <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-2 sm:flex-row sm:text-left">
                <span>Mapa de Estudos sobre Gnosticismo e Esoterismo</span>
                <span>Biblioteca de pesquisa independente · Conteúdo acadêmico em expansão</span>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <SheetContent side="left" className="w-[min(84vw,300px)] gap-0 border-sidebar-border bg-sidebar p-0 lg:hidden">
        <SheetHeader className="sr-only">
          <SheetTitle>Navegação do Gnose</SheetTitle>
          <SheetDescription>Acesse as seções do atlas de estudos.</SheetDescription>
        </SheetHeader>
        <SidebarNavigation
          activeSection={activeSection}
          onNavigate={navigate}
          done={done}
          total={total}
          isLoading={isLoading}
          isError={isError}
          onSearch={() => {
            setMobileNavOpen(false);
            openSearch();
          }}
          mobile
        />
      </SheetContent>

      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Buscar no acervo"
        description="Busque títulos, conceitos e termos relacionados; a busca aprofundada localiza trechos nos textos integrais e abre a seção correspondente."
        showCloseButton={false}
        className="top-[15%] translate-y-0 sm:max-w-2xl"
      >
        <Command shouldFilter={false}>
          <div className="flex items-center border-b pr-3">
            <CommandInput
              autoFocus
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Ex.: Sophia, Hermetismo, Demiurgo…"
              className="border-0"
            />
            <kbd className="hidden rounded border px-1.5 py-1 font-mono text-[10px] text-muted-foreground sm:inline">ESC</kbd>
          </div>
          <CommandList className="max-h-[min(62vh,520px)] p-2">
            {searchQuery.trim() ? (
              <>
                {visibleResultGroups.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <CommandGroup key={group.kind} heading={group.label}>
                      {group.items.map((result) => (
                        <CommandItem
                          key={result.key}
                          value={`${result.title} ${result.description}`}
                          onSelect={() => selectSearchResult(result)}
                          className="min-h-12 gap-3 rounded-lg px-3 py-2.5"
                        >
                          <GroupIcon className="size-4 text-primary" aria-hidden />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{result.title}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{result.description}</span>
                          </span>
                          <CommandShortcut><ArrowRight className="size-3.5" aria-hidden /></CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })}
                <CommandEmpty>{passageSearchLoading ? "Buscando trechos relacionados nos estudos…" : "Nenhum resultado encontrado para essa busca."}</CommandEmpty>
              </>
            ) : (
              <CommandGroup heading="Ir para uma seção">
                {NAV_GROUPS.flatMap((group) => group.items).map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.helper}`}
                      onSelect={() => selectSearchResult({
                        key: `nav:${item.id}`,
                        title: item.label,
                        description: item.helper,
                        searchable: `${item.label} ${item.helper}`,
                        kind: "navigation",
                        section: item.id,
                      })}
                      className="min-h-11 gap-3 rounded-lg px-3"
                    >
                      <Icon className="size-4 text-primary" aria-hidden />
                      <span className="flex-1 text-sm">{item.label}</span>
                      <CommandShortcut><CommandIcon className="size-3.5" aria-hidden /></CommandShortcut>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
          <div className="flex items-center justify-between border-t px-4 py-2.5 text-[10px] text-muted-foreground">
            <span>Busca ampliada por conceitos, termos relacionados e trechos</span>
            <span className="font-mono">{prompts.length + nextPrompts.length} estudos · {concepts.length} conceitos · {glossary.length} termos</span>
          </div>
        </Command>
      </CommandDialog>

      <ReaderDialog target={readerTarget} open={readerOpen} onOpenChange={setReaderOpen} />
    </Sheet>
  );
}
