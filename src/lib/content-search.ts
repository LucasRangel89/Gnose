export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function slugifyHeading(value: string): string {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "secao";
}

export function markdownToPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[>*_`|~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RELATED_TERMS: Record<string, string[]> = {
  sophia: ["sabedoria", "achamoth", "feminino divino", "pleroma", "queda"],
  sabedoria: ["sophia", "achamoth", "feminino divino"],
  demiurgo: ["yaldabaoth", "arcontes", "criador", "kenoma"],
  gnose: ["conhecimento", "despertar", "anamnese", "fagulha divina"],
  gnosticismo: ["gnose", "pleroma", "demiurgo", "nag hammadi"],
  valentinismo: ["valentino", "pleroma", "eons", "leito nupcial"],
  nag: ["nag hammadi", "códices", "evangelho de tomé"],
  arconte: ["arcontes", "demiurgo", "yaldabaoth"],
  pleroma: ["eons", "sophia", "bythos", "silêncio"],
  jung: ["inconsciente coletivo", "individuação", "arquétipo", "gnose"],
};

export function expandSearchTerms(query: string): string[] {
  const normalized = normalizeSearchText(query);
  const direct = normalized.split(/[^a-z0-9]+/).filter((token) => token.length > 1);
  const related = Object.entries(RELATED_TERMS)
    .filter(([key]) => normalized.includes(normalizeSearchText(key)))
    .flatMap(([, values]) => values.flatMap((value) => normalizeSearchText(value).split(/[^a-z0-9]+/)));
  return [...new Set([...direct, ...related].filter((token) => token.length > 1))];
}

export interface SearchSection {
  heading: string;
  anchor: string;
  text: string;
}

export interface RankedSection extends SearchSection {
  score: number;
  excerpt: string;
}

export function splitMarkdownSections(markdown: string): SearchSection[] {
  const sections: SearchSection[] = [];
  let heading = "Introdução";
  let anchor = slugifyHeading(heading);
  let lines: string[] = [];
  const flush = () => {
    const text = markdownToPlainText(lines.join("\n"));
    if (text) sections.push({ heading, anchor, text });
  };

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      flush();
      heading = match[1].trim();
      anchor = slugifyHeading(heading);
      lines = [];
    } else {
      lines.push(line);
    }
  }
  flush();
  return sections;
}

export function rankSearchSection(
  query: string,
  section: SearchSection,
  studyTitle: string,
): RankedSection | null {
  const normalizedQuery = normalizeSearchText(query.trim());
  const normalizedHeading = normalizeSearchText(section.heading);
  const normalizedText = normalizeSearchText(section.text);
  const normalizedTitle = normalizeSearchText(studyTitle);
  const directTokens = normalizeSearchText(query).split(/[^a-z0-9]+/).filter((token) => token.length > 1);
  const expanded = expandSearchTerms(query);
  let score = 0;

  if (normalizedText.includes(normalizedQuery)) score += 12;
  if (normalizedHeading.includes(normalizedQuery)) score += 10;
  if (normalizedTitle.includes(normalizedQuery)) score += 7;
  for (const token of directTokens) {
    if (normalizedHeading.includes(token)) score += 3;
    else if (normalizedText.includes(token)) score += 2;
    if (normalizedTitle.includes(token)) score += 2;
  }
  for (const token of expanded) {
    if (directTokens.includes(token)) continue;
    if (normalizedHeading.includes(token)) score += 1.2;
    else if (normalizedText.includes(token)) score += 0.65;
  }
  if (score === 0) return null;

  const sentences = section.text.split(/(?<=[.!?])\s+/);
  const excerptSentence = sentences.find((sentence) => {
    const normalized = normalizeSearchText(sentence);
    return directTokens.some((token) => normalized.includes(token));
  }) ?? section.text;
  const excerpt = excerptSentence.length > 260
    ? `${excerptSentence.slice(0, 257).trimEnd()}…`
    : excerptSentence;

  return { ...section, score, excerpt };
}
