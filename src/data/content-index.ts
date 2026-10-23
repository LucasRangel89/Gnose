import type { ItemType } from "./types";

/** Mapa entre identificadores do acervo e estudos Markdown disponíveis. */
const contentFiles: Record<ItemType, Record<string, string>> = {
  PROMPT: {
    P1: "/conteudo/prompts/prompt-01-as-raizes.md",
    P2: "/conteudo/prompts/prompt-02-judaismo-mistico.md",
    P3: "/conteudo/prompts/prompt-03-hermetismo.md",
    P4: "/conteudo/prompts/prompt-04-neoplatonismo.md",
    P5: "/conteudo/prompts/prompt-05-gnosticismo.md",
    P6: "/conteudo/prompts/prompt-06-goetia.md",
    P7: "/conteudo/prompts/prompt-07-renascenca-oculta.md",
    P8: "/conteudo/prompts/prompt-08-rosacruzes-e-maconaria.md",
    P9: "/conteudo/prompts/prompt-09-seculo-19-e-crowley.md",
    P10: "/conteudo/prompts/prompt-10-jung-e-a-psicologia-do-oculto.md",
  },
  NEXT_PROMPT: {
    "5.1": "/conteudo/serie-5/prompt-5.1-evangelho-de-tomas.md",
    "5.2": "/conteudo/serie-5/prompt-5.2-nag-hammadi-em-detalhe.md",
    "5.3": "/conteudo/serie-5/prompt-5.3-os-mandeus.md",
    "5.4": "/conteudo/serie-5/prompt-5.4-o-sethianismo.md",
    "5.5": "/conteudo/serie-5/prompt-5.5-valentinismo.md",
    "5.6": "/conteudo/serie-5/prompt-5.6-sophia.md",
    "5.7": "/conteudo/serie-5/prompt-5.7-gnosticismo-medieval.md",
    "5.8": "/conteudo/serie-5/prompt-5.8-philip-k-dick.md",
    "5.9": "/conteudo/serie-5/prompt-5.9-vajrayana.md",
    "5.10": "/conteudo/serie-5/prompt-5.10-o-evangelho-de-judas.md",
    "5.11": "/conteudo/serie-5/prompt-5.11-gnose-americana-harold-bloom.md",
  },
};

/** Retorna o caminho público do Markdown, ou undefined para conteúdo pendente. */
export function contentFileFor(
  itemType: ItemType,
  itemId: string,
): string | undefined {
  return contentFiles[itemType]?.[itemId];
}

export const publishedStudyCount = Object.values(contentFiles).reduce(
  (total, collection) => total + Object.keys(collection).length,
  0,
);
