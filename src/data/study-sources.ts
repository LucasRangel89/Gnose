import type { ItemType } from "./types";

export interface StudySourceInfo {
  sourceFile: string;
  transcribedAt?: string;
  editorialNote: string;
}

/** Proveniência editorial: fonte original e estado real da revisão. */
const sources: Record<string, StudySourceInfo> = {
  "PROMPT:P1": { sourceFile: "content/gnosticismo_prompt1_as_raizes.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P2": { sourceFile: "content/gnosticismo_prompt2_judaismo_mistico.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P3": { sourceFile: "content/gnosticismo_prompt3_hermetismo.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P4": { sourceFile: "content/gnosticismo_prompt4_neoplatonismo.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P5": { sourceFile: "content/gnosticismo_prompt5_pesquisa_central.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P6": { sourceFile: "content/gnosticismo_prompt6_goetia.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P7": { sourceFile: "content/gnosticismo_prompt7_renascenca_oculta.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P8": { sourceFile: "content/gnosticismo_prompt8_rosacruzes_maconaria.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P9": { sourceFile: "content/gnosticismo_prompt9_seculo19_crowley.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "PROMPT:P10": { sourceFile: "content/gnosticismo_prompt10_jung_psicologia_oculto.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "NEXT_PROMPT:5.1": { sourceFile: "content/gnosticismo_prompt51_evangelho_tomas.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "NEXT_PROMPT:5.2": { sourceFile: "content/gnosticismo_prompt52_nag_hammadi.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "NEXT_PROMPT:5.3": { sourceFile: "content/gnosticismo_prompt53_mandeus.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "NEXT_PROMPT:5.4": { sourceFile: "content/gnosticismo_prompt54_sethianismo.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "NEXT_PROMPT:5.5": { sourceFile: "content/gnosticismo_prompt55_valentinismo.docx", transcribedAt: "2026-10-23", editorialNote: "Texto convertido do DOCX; fontes citadas foram preservadas do original e ainda não passaram por verificação externa." },
  "NEXT_PROMPT:5.6": { sourceFile: "content/gnosticismo_prompt56_sophia.docx", transcribedAt: "2026-10-23", editorialNote: "Texto convertido do DOCX; fontes citadas foram preservadas do original e ainda não passaram por verificação externa." },
  "NEXT_PROMPT:5.7": { sourceFile: "content/gnosticismo_prompt57_gnosticismo_medieval.docx", transcribedAt: "2026-10-23", editorialNote: "Texto convertido do DOCX; fontes citadas foram preservadas do original e ainda não passaram por verificação externa." },
  "NEXT_PROMPT:5.8": { sourceFile: "content/gnosticismo_prompt58_philip_k_dick.docx", transcribedAt: "2026-10-23", editorialNote: "Texto convertido do DOCX; fontes citadas foram preservadas do original e ainda não passaram por verificação externa." },
  "NEXT_PROMPT:5.9": { sourceFile: "content/gnosticismo_prompt59_vajrayana.docx", transcribedAt: "2026-10-23", editorialNote: "Texto convertido do DOCX; fontes citadas foram preservadas do original e ainda não passaram por verificação externa." },
  "NEXT_PROMPT:5.10": { sourceFile: "content/gnosticismo_prompt510_evangelho_judas.docx", editorialNote: "Referências conforme aparecem no documento-fonte; verificação independente pendente." },
  "NEXT_PROMPT:5.11": { sourceFile: "gnosticismo_prompt511_bloom_gnose_americana.docx", transcribedAt: "2026-10-23", editorialNote: "Texto convertido do DOCX; fontes citadas foram preservadas do original e ainda não passaram por verificação externa." },
};

export function studySourceFor(
  itemType: ItemType,
  itemId: string,
): StudySourceInfo | undefined {
  return sources[`${itemType}:${itemId}`];
}
