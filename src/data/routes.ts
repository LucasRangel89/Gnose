import type { ReadingRoute } from './types';

/**
 * PARTE IV — Caminhos de Leitura.
 * "G" é a ordem numérica (genealogia histórica); A–D são as rotas temáticas.
 */
export const readingRoutes: ReadingRoute[] = [
  {
    id: 'G',
    title: `Ordem Numerica — A Genealogia Historica`,
    description: `A ordem numerica (P1→P10) e uma rota valida — a genealogia historica.`,
    steps: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'],
    comment: `Mas ha quatro outras rotas que revelam conexoes que a ordem cronologica obscurece:`,
  },
  {
    id: 'A',
    title: `O Problema do Mal (Teodiceia)`,
    description: `P4 (Plotino: o mal como privacao, nao como forca ativa) → P5 (Gnosticismo: o mal como o Demiurgo criador) → P8 (Cataros: o dualismo como solucao radical) → P10 (Jung: o mal como Sombra nao integrada)`,
    steps: ['P4', 'P5', 'P8', 'P10'],
    comment: `Esta rota mostra como o mesmo problema — por que um Deus bom permite o sofrimento — gerou quatro solucoes radicalmente diferentes que sao ainda as quatro posicoes basicas no debate contemporaneo.`,
  },
  {
    id: 'B',
    title: `O Feminino Sagrado`,
    description: `P1 (Demeter, Persephone, Isis — as Deusas dos Misterios) → P3 (Isis do Corpus Hermeticum) → P5 (Sophia como o feminino que cai e precisa ser resgatado) → P9 (Anima de Jung como Sophia secular; Dion Fortune como a primeira maga moderna em plena igualdade) → NOVO PROMPT 5.6 (Sophia: genealogia completa)`,
    steps: ['P1', 'P3', 'P5', 'P9', '5.6'],
    comment: `O fio do feminino divino atravessa toda a serie mas nunca e tratado como protagonista em nenhum Prompt individual — o que o torna o candidato mais rico para aprofundamento.`,
  },
  {
    id: 'C',
    title: `A Transmissao do Conhecimento Proibido`,
    description: `P1 (os Misterios como 'o que nao pode ser dito') → P2 (a Kabbalah como saber restrito a adultos casados) → P5 (o Gnosticismo como heresia) → P6 (os grimorios como textos perigosos) → P8 (o sigilo como estrutura das sociedades secretas) → P10 (o segredo como mecanismo pedagogico — Hillman)`,
    steps: ['P1', 'P2', 'P5', 'P6', 'P8', 'P10'],
    comment: `Esta rota pergunta: o que a humanidade considerou 'conhecimento demais para circular livremente' em cada epoca — e o que isso revela sobre o poder e seus medos?`,
  },
  {
    id: 'D',
    title: `O Sistema de Correspondencias`,
    description: `P2 (Gematria e nomes divinos como forcas cosmicas) → P3 (como em cima assim em baixo — o axioma hermetico) → P4 (a Teurgia de Jambico: os symbolos como pontes entre planos) → P6 (selos e nomes como tecnologia de invocacao) → P7 (Agrippa: os tres niveis de magia como tres tipos de correspondencia) → P10 (Jung: os arquétipos como o equivalente psiquico das correspondencias cosmicas)`,
    steps: ['P2', 'P3', 'P4', 'P6', 'P7', 'P10'],
    comment: `Esta rota e a mais diretamente util para quem quer entender a LOGICA interna do esoterismo — por que os sistemas de correspondencias fazem sentido internamente, independentemente de sua verdade ontologica.`,
  },
];
