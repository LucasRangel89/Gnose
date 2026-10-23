import type { Concept, ConceptCategoryInfo } from './types';

/**
 * PARTE II — Índices Cruzados de Conceitos.
 * Transcrito do documento-mestre (editável livremente).
 */
export const conceptCategories: ConceptCategoryInfo[] = [
  {
    id: 'A',
    name: 'Cosmologia e Estrutura do Real',
    noteLabel: 'Como o Tratamento Varia',
  },
  {
    id: 'B',
    name: 'Figuras e Entidades',
    noteLabel: 'Transformações do Papel',
  },
  {
    id: 'C',
    name: 'Práticas e Sistemas Operativos',
    noteLabel: 'Evolução Histórica',
  },
  {
    id: 'D',
    name: 'Conceitos Filosóficos Transversais',
    noteLabel: 'Nota Comparativa',
  },
];

/**
 * PARTE II — "Indice por Tema — Onde Cada Conceito Aparece".
 * Transcrito verbatim do documento-mestre (upload/extracted_content.txt),
 * preservando a ortografia original (sem acentos onde o original não os tem).
 * Total: 20 conceitos — A:5, B:6, C:5, D:4.
 */
export const concepts: Concept[] = [
  // ---- A — Cosmologia e Estrutura do Real (coluna de notas: Como o Tratamento Varia) ----
  {
    id: `emanacao`,
    name: `Emanacao (o cosmos surge do Divino por transbordamento, nao por criacao voluntaria)`,
    category: `A`,
    prompts: [`P3`, `P4`, `P5`, `P10`],
    note: `P3: formula hermetica 'como em cima assim em baixo'; P4: o Um de Plotino emana por necessidade; P5: a emanacao torna-se tragica (Queda de Sophia); P10: Jung ve o inconsciente emergindo do Self por um processo identico`,
  },
  {
    id: `dualismo`,
    name: `Dualismo (cosmos material como mal ou limitacao)`,
    category: `A`,
    prompts: [`P1`, `P4`, `P5`, `P8`, `P9`],
    note: `P1: dualismo orficoPylosin vs. cosmos; P4: Plotino REJEITA o dualismo gnostico; P5: dualismo central (Demiurgo vs. Pleroma); P8: Cataros como dualismo medieval; P9: Teosofia atenua o dualismo com evolucao`,
  },
  {
    id: `hierarquia-ontologica`,
    name: `Hierarquia Ontologica (niveis de ser do mais denso ao mais sutil)`,
    category: `A`,
    prompts: [`P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `P9`, `P10`],
    note: `A mesma estrutura em camadas: P2=10 Sefirot; P3=mundos hermeticos; P4=Um/Nous/Psique; P5=Pleroma/Kenoma; P6=patentes dos 72 espiritos; P7=3 livros de Agrippa; P9=graus da Golden Dawn; P10=Self/Ego/Persona`,
  },
  {
    id: `kosmos-como-prisao-vs-kosmos-como-templo`,
    name: `Kosmos como Prisao vs. Kosmos como Templo`,
    category: `A`,
    prompts: [`P1`, `P4`, `P5`, `P10`],
    note: `P1: o corpo e o tumulo da alma (orfismo); P4: Plotino CELEBRA o cosmos como belo; P5: o cosmos e a prisao do Demiurgo; P10: Eliade ve o cosmos como hierofania — tensao nao resolvida`,
  },
  {
    id: `o-eterno-retorno-e-o-tempo-ciclico`,
    name: `O Eterno Retorno e o Tempo Ciclico`,
    category: `A`,
    prompts: [`P1`, `P3`, `P5`, `P10`],
    note: `P1: ciclo de mortes e renascimentos (orfismo); P3: ciclos planetarios e suas correspondencias; P5: o Gnosticismo REJEITA o eterno retorno como armadilha; P10: Eliade vs. Nietzsche vs. Gnosticismo`,
  },
  // ---- B — Figuras e Entidades (coluna de notas: Transformacoes do Papel) ----
  {
    id: `sophia`,
    name: `Sophia (o Feminino Divino)`,
    category: `B`,
    prompts: [`P4`, `P5`, `P9`, `P10`],
    note: `P4: Sophia como nivel inferior do Nous em Plotino; P5: Sophia como o Eon que cai e gera o Demiurgo; P9: Anima de Jung como equivalente secular; P10: Anima como guia ao inconsciente = Sofia que guia ao Pleroma`,
  },
  {
    id: `demiurgo`,
    name: `Demiurgo (o criador do cosmos material)`,
    category: `B`,
    prompts: [`P4`, `P5`, `P6`, `P10`],
    note: `P4: Demiurgo de Platao e BENIGNO — o Nous que ordena o cosmos; P5: Demiurgo Yaldabaoth e IGNORANTE e potencialmente mau; P6: os 72 Reis como o Demiurgo distribuido em governadores; P10: a Sombra de Jung como o Demiurgo psiquico`,
  },
  {
    id: `o-trickster-o-portador-da-gnose`,
    name: `O Trickster / O Portador da Gnose`,
    category: `B`,
    prompts: [`P1`, `P5`, `P7`, `P8`, `P10`],
    note: `P1: Prometeu e Hermes como portadores do fogo/conhecimento proibido; P5: a Serpente ofita e Judas como herois; P7: Bruno como portador do conhecimento que o mata; P8: Hiram Abiff como portador da Palavra perdida; P10: o Puer Aeternus de Jung como arquetipo do conhecimento transformador`,
  },
  {
    id: `o-anjo-guardiao-o-guia-interno`,
    name: `O Anjo Guardiao / O Guia Interno`,
    category: `B`,
    prompts: [`P2`, `P4`, `P6`, `P7`, `P9`, `P10`],
    note: `P2: Metatron e anjos do Merkabah; P4: o Daimon de Socrates / o anjo de Jambico; P6: Santo Anjo Guardiao de Abramelin; P7: o anjo de John Dee (Aiwass antecipado); P9: Aiwass de Crowley; P10: Filemao de Jung no Livro Vermelho`,
  },
  {
    id: `abraxas`,
    name: `Abraxas`,
    category: `B`,
    prompts: [`P5`, `P9`, `P10`],
    note: `P5: Abraxas como o Deus supremo de Basilides que transcende a dualidade bem/mal; P9: Crowley e a EGC; P10: as Sete Pregacoes de Jung — Abraxas como o arquetipo que unifica os opostos`,
  },
  {
    id: `hermes-trismegistus`,
    name: `Hermes Trismegistus`,
    category: `B`,
    prompts: [`P3`, `P7`],
    note: `P3: origem, o Corpus Hermeticum, a formula central; P7: Ficino o posiciona como mais antigo que Platao — a escolha que mudan a historia intelectual europeia`,
  },
  // ---- C — Praticas e Sistemas Operativos (coluna de notas: Evolucao Historica) ----
  {
    id: `invocacao-teurgia`,
    name: `Invocacao / Teurgia`,
    category: `C`,
    prompts: [`P1`, `P4`, `P6`, `P7`, `P9`],
    note: `P1: rituais de misterio como invocacao das divindades ctônicas; P4: Jambico sistematiza a Teurgia como magia divina vs. Goetia como magia inferior; P6: Goetia salomonica; P7: Agrippa codifica os 3 niveis; P9: Golden Dawn como Teurgia sistematizada`,
  },
  {
    id: `iniciacao-em-graus`,
    name: `Iniciacao em Graus`,
    category: `C`,
    prompts: [`P1`, `P2`, `P4`, `P6`, `P8`, `P9`, `P10`],
    note: `P1: os graus de Eleusis (myesis, epopteia); P2: ascensao pelo Merkabah; P4: os graus da escada da virtude plotiniana; P6: os 11 graus da Golden Dawn; P8: os 3 graus basicos + 33 do Rito Escoces; P9: A.A. de Crowley; P10: a Individuacao de Jung como processo de graus`,
  },
  {
    id: `sigils-e-nomes-de-poder`,
    name: `Sigils e Nomes de Poder`,
    category: `C`,
    prompts: [`P2`, `P3`, `P6`, `P7`],
    note: `P2: os 72 nomes do Shemhamphorasch; P3: os nomes divinos hermeticos nos pentaculos; P6: os 72 selos da Ars Goetia; P7: a Lingua Enochiana de Dee como sistema de nomes angelicos`,
  },
  {
    id: `meditacao-e-contemplacao`,
    name: `Meditacao e Contemplacao`,
    category: `C`,
    prompts: [`P1`, `P2`, `P4`, `P5`, `P9`, `P10`],
    note: `P1: contemplacao nos Misterios; P2: Kavvanah e oracoes do Merkabah; P4: a contemplacao platonica como retorno ao Um; P5: a Gnose como illuminacao direta (nao discursiva); P9: o sistema de meditacao de Crowley no A.A.; P10: a Imaginacao Ativa de Jung`,
  },
  {
    id: `alquimia`,
    name: `Alquimia`,
    category: `C`,
    prompts: [`P3`, `P5`, `P7`, `P9`, `P10`],
    note: `P3: as 4 fases (Nigredo/Albedo/Citrinitas/Rubedo) como processo espiritual; P5: a transformacao da Fagulha; P7: Paracelse e Agrippa; P9: Newton como alquimista; P10: Jung interpreta a alquimia como projecao da psique — 'a psicologia do inconsciente em forma de imagens'`,
  },
  // ---- D — Conceitos Filosoficos Transversais (coluna de notas: Nota Comparativa) ----
  {
    id: `philosophia-perennis`,
    name: `Philosophia Perennis (a sabedoria perene que atravessa todas as tradicoes)`,
    category: `D`,
    prompts: [`P3`, `P4`, `P7`, `P8`, `P9`, `P10`],
    note: `P3: Ficino como seu formulador renascentista; P7: Bruno radicaliza ate o ponto da morte; P8: a Golden Dawn como sua ultima expressao institucional organizada; P10: o debate Aldous Huxley vs. Steven Katz — a experiencia mistica e universal ou culturalmente especifica?`,
  },
  {
    id: `o-problema-do-mal-teodiceia`,
    name: `O Problema do Mal (teodiceia)`,
    category: `D`,
    prompts: [`P4`, `P5`, `P8`, `P10`],
    note: `P4: Plotino — o mal e privacao de ser, nao forca ativa; P5: o Gnosticismo inverte — o mal e o Demiurgo criador; P8: o dualismo Cataro como solucao radical; P10: Jung — o mal e a Sombra nao integrada, nao uma entidade externa`,
  },
  {
    id: `o-segredo-como-pedagogia`,
    name: `O Segredo como Pedagogia`,
    category: `D`,
    prompts: [`P1`, `P2`, `P6`, `P8`, `P10`],
    note: `Atravessa toda a serie: P1=os Misterios como 'o que nao pode ser dito'; P2=a Cabala como sabedoria restrita; P6=os grimorios como conhecimento perigoso; P8=o segredo da Maconaria; P10=Hillman: o segredo e parte do conteudo, nao separavel dele`,
  },
  {
    id: `sincretismo`,
    name: `Sincretismo (fusao de tradicoes de origens distintas)`,
    category: `D`,
    prompts: [`P3`, `P5`, `P7`, `P8`, `P9`],
    note: `P3: Hermetismo como fusao grego-egipcia; P5: Gnosticismo como fusao judaico-platonica-persa; P7: Pico e as 900 Teses; P8: Golden Dawn; P9: Crowley como o sincretismo maximo — toda a historia esoterica em um sistema`,
  },
];
