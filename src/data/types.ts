/**
 * Tipos compartilhados do Dashboard de Estudos — Gnose & Esoterismo.
 *
 * Todo o conteúdo do dashboard vive em arquivos de dados (src/data/*.ts)
 * para facilitar a manutenção no GitHub: basta editar os arquivos e commitar.
 */

/** Status de estudo de um item (prompt original ou prompt de expansão 5.x). */
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';

/** Coleções que possuem progresso rastreável. */
export type ItemType = 'PROMPT' | 'NEXT_PROMPT';

/** Uma linha da tabela "Mapa dos 10 Prompts" (Parte I do documento-mestre). */
export interface Prompt {
  /** Identificador estável, ex.: "P5". */
  id: string;
  /** Número ordinal (1–10). */
  number: number;
  title: string;
  /** Texto literal da coluna Pre-req (ex.: "2,3,4" ou "todos" ou "—"). */
  prereq: string;
  /** Identificadores dos prompts pré-requisito, ex.: ["P2","P3","P4"]. */
  prereqIds: string[];
  centralConcept: string;
  fundamentalQuestion: string;
  /** Linhas da tabela "Linhas de Influência Direta" em que este prompt é a fonte. */
  influences: PromptInfluence[];
}

export interface PromptInfluence {
  /** Prompts influenciados, ex.: ["P5","P8","P10"]. */
  influencedIds: string[];
  conceptTransmitted: string;
}

/** Categorias do Índice Cruzado (Parte II). */
export type ConceptCategory = 'A' | 'B' | 'C' | 'D';

export interface Concept {
  /** Slug estável, ex.: "emanacao". */
  id: string;
  name: string;
  category: ConceptCategory;
  /** Prompts em que o conceito aparece, ex.: ["P3","P4","P5","P10"]. */
  prompts: string[];
  /** Nota sobre como o tratamento varia entre os prompts. */
  note: string;
}

export interface ConceptCategoryInfo {
  id: ConceptCategory;
  name: string;
  /** Rótulo da coluna de notas no documento original (ex.: "Como o Tratamento Varia"). */
  noteLabel: string;
}

/** Uma entrada do Glossário Técnico Unificado (Parte III). */
export interface GlossaryTerm {
  /** Slug estável, ex.: "fagulha-divina-pneuma". */
  id: string;
  term: string;
  /** Tradição de origem, ex.: "Gnosticismo (Basilides, sec. II d.C.); relido por Jung (1916)". */
  tradition: string;
  /** Prompts em que o termo aparece, ex.: ["P5","P10"]. */
  prompts: string[];
  /** Definição completa. "||" separa usos divergentes entre tradições. */
  definition: string;
}

/** Uma rota de leitura temática (Parte IV). */
export interface ReadingRoute {
  /** "G" = ordem numérica (genealogia histórica); "A"–"D" = rotas temáticas. */
  id: string;
  title: string;
  description: string;
  /** Passos em ordem: ["P4","P5","P8","P10"] — pode incluir expansões ("5.6"). */
  steps: string[];
  /** Parágrafo de comentário do documento original. */
  comment: string;
}

/** Grupos da expansão (Parte V). */
export type NextPromptGroupId = 'A' | 'B' | 'C';

export interface NextPromptFront {
  /** Rótulo da frente, ex.: "F1 — O Texto". */
  label: string;
  /** Conteúdo da frente (pergunta central + material específico, quando houver). */
  text: string;
}

export interface NextPrompt {
  /** Identificador, ex.: "5.1". */
  id: string;
  group: NextPromptGroupId;
  title: string;
  /** Pré-requisito em texto, ex.: "Prompt 5" ou "Prompts 5, 5.1". */
  prereq: string;
  /** Metadados adicionais (ex.: "Estimativa: 300-400 parágrafos"). */
  meta?: string;
  /** Parágrafo introdutório do prompt. */
  intro?: string;
  fronts: NextPromptFront[];
}

export interface NextPromptGroup {
  id: NextPromptGroupId;
  title: string;
  description: string;
}
