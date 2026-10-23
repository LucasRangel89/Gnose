import type { Prompt } from './types';

/**
 * PARTE I — Mapa dos 10 Prompts + Linhas de Influência Direta.
 * Transcrito verbatim do documento-mestre (upload/extracted_content.txt),
 * preservando a ortografia original (sem acentos onde o original não os tem).
 *
 * A coluna "Pre-req." usa o texto literal do documento; prereqIds é a
 * derivação estrutural (— => [], "todos" => P1..P9).
 * As 9 linhas da tabela "Linhas de Influencia Direta entre os Prompts"
 * estão anexadas ao prompt-fonte correspondente como `influences`
 * (P10 é apenas destino, nunca fonte).
 */
export const prompts: Prompt[] = [
  {
    id: `P1`,
    number: 1,
    title: `As Raizes — Religioes de Misterio`,
    prereq: `—`,
    prereqIds: [],
    centralConcept: `Catabasis e Anabasis; morte e ressurreicao ritual`,
    fundamentalQuestion: `O que acontece depois da morte — e como a experiencia de 'morrer antes de morrer' transforma o vivo?`,
    influences: [
      {
        influencedIds: [`P5`, `P8`, `P10`],
        conceptTransmitted: `Estrutura morte-iniciacao-ressurreicao; descida ao submundo como transformacao`,
      },
    ],
  },
  {
    id: `P2`,
    number: 2,
    title: `Judaismo Mistico: Kabbalah e Apocalipse`,
    prereq: `—`,
    prereqIds: [],
    centralConcept: `Arvore da Vida; 10 Sefirot; Merkabah; Shemhamphorasch`,
    fundamentalQuestion: `Como Deus, que e Um e infinito, se relaciona com um mundo multiplo e finito?`,
    influences: [
      {
        influencedIds: [`P5`, `P6`, `P7`, `P8`, `P9`, `P10`],
        conceptTransmitted: `Arvore da Vida; nomes divinos; Gematria; Qliphoth como Archons`,
      },
    ],
  },
  {
    id: `P3`,
    number: 3,
    title: `Hermetismo: Corpus Hermeticum`,
    prereq: `—`,
    prereqIds: [],
    centralConcept: `Como em cima assim em baixo; alquimia; Poimandres`,
    fundamentalQuestion: `O cosmos e uma unidade inteligente cujas partes se correspondem — como operar a partir dessa correspondencia?`,
    influences: [
      {
        influencedIds: [`P4`, `P5`, `P6`, `P7`, `P9`, `P10`],
        conceptTransmitted: `Correspondencias; emanacao; Poimandres; Philosophia Perennis`,
      },
    ],
  },
  {
    id: `P4`,
    number: 4,
    title: `Neoplatonismo: Plotino e Jambico`,
    prereq: `3`,
    prereqIds: [`P3`],
    centralConcept: `O Um, o Nous, a Psique; Teurgia vs. Goetia`,
    fundamentalQuestion: `Como retornar a unidade sem negar a multiplicidade da experiencia?`,
    influences: [
      {
        influencedIds: [`P5`, `P6`, `P7`, `P10`],
        conceptTransmitted: `Hierarquia ontologica; Teurgia; O Um como ponto de retorno`,
      },
    ],
  },
  {
    id: `P5`,
    number: 5,
    title: `Gnosticismo — A Pesquisa Central`,
    prereq: `2,3,4`,
    prereqIds: [`P2`, `P3`, `P4`],
    centralConcept: `Pleroma, Kenoma, Demiurgo, Fagulha, Gnose`,
    fundamentalQuestion: `Por que existe sofrimento num cosmos criado por um Deus bom? E como escapar?`,
    influences: [
      {
        influencedIds: [`P6`, `P8`, `P9`, `P10`],
        conceptTransmitted: `Pleroma/Kenoma; Demiurgo; Fagulha; o problema do mal`,
      },
    ],
  },
  {
    id: `P6`,
    number: 6,
    title: `Goetia e Magia Salomonica`,
    prereq: `2,4,5`,
    prereqIds: [`P2`, `P4`, `P5`],
    centralConcept: `72 espiritos; selos; hierarquia demoniaca; circulo magico`,
    fundamentalQuestion: `Se o cosmos e governado por forcas especificas, como um humano pode negociar com elas?`,
    influences: [
      {
        influencedIds: [`P7`, `P8`, `P9`],
        conceptTransmitted: `72 espiritos; selos; hierarquia ritual; negociacao com Archons`,
      },
    ],
  },
  {
    id: `P7`,
    number: 7,
    title: `Renascença Oculta: Ficino a Bruno`,
    prereq: `3,4,5`,
    prereqIds: [`P3`, `P4`, `P5`],
    centralConcept: `Philosophia Perennis; Arte da Memoria; universo infinito`,
    fundamentalQuestion: `E possivel reunir toda a sabedoria antiga num unico sistema antes que a Igreja destrua a tentativa?`,
    influences: [
      {
        influencedIds: [`P8`, `P9`, `P10`],
        conceptTransmitted: `Arte da Memoria; Lingua Enochiana de Dee; Kabbalah Crista; universo infinito`,
      },
    ],
  },
  {
    id: `P8`,
    number: 8,
    title: `Rosacruzes, Maconaria e Soc. de Misterio`,
    prereq: `2,5,7`,
    prereqIds: [`P2`, `P5`, `P7`],
    centralConcept: `Ludibrium; Hiram Abiff; 33 graus; tradicao inventada`,
    fundamentalQuestion: `Como transmitir conhecimento esoterico de forma institucional em ambiente hostil?`,
    influences: [
      {
        influencedIds: [`P9`, `P10`],
        conceptTransmitted: `Curriculo iniciativo; transmissao institucional; Hiram Abiff`,
      },
    ],
  },
  {
    id: `P9`,
    number: 9,
    title: `O Seculo XIX e Crowley`,
    prereq: `5,6,7,8`,
    prereqIds: [`P5`, `P6`, `P7`, `P8`],
    centralConcept: `Teosofia; Racas-Raiz; Thelema; Verdadeira Vontade`,
    fundamentalQuestion: `Como sistematizar o esoterismo completo numa linguagem que o mundo moderno possa absorver?`,
    influences: [
      {
        influencedIds: [`P10`],
        conceptTransmitted: `Sintese total; Thelema; traducao moderna`,
      },
    ],
  },
  {
    id: `P10`,
    number: 10,
    title: `Jung e a Psicologia do Oculto`,
    prereq: `todos`,
    prereqIds: [`P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P8`, `P9`],
    centralConcept: `Arquétipos; Inconsciente Coletivo; Individuacao; Liber Novus`,
    fundamentalQuestion: `O territorio descrito pelo esoterismo e cosmologia objetiva ou mapa da psique — e e possivel distinguir?`,
    influences: [],
  },
];
