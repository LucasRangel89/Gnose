import type { NextPrompt, NextPromptGroup } from './types';

/**
 * PARTE V — Os Próximos Prompts: Expansão do Gnosticismo (5.1–5.11).
 */
export const nextPromptGroups: NextPromptGroup[] = [
  {
    id: 'A',
    title: 'Textos e Fontes Primárias',
    description: 'O que os Gnósticos realmente disseram',
  },
  {
    id: 'B',
    title: 'Sistemas Específicos em Profundidade',
    description: 'As grandes escolas em profundidade',
  },
  {
    id: 'C',
    title: 'Legados e Conexões Contemporâneas',
    description: 'Onde o Gnosticismo vive hoje',
  },
];

export const nextPrompts: NextPrompt[] = [
  {
    id: '5.1',
    group: 'A',
    title: `O Evangelho de Tomas: o Jesus que Nao Foi Canonizado`,
    prereq: `Prompt 5`,
    meta: `Estimativa: 300-400 paragrafos`,
    fronts: [
      {
        label: `F1 — O Texto`,
        text: `O que e o Evangelho de Tomas? Como se estrutura? O que o distingue dos Evangelhos canonicos? Material especifico: 114 ditos de Jesus sem narrativa; escrito em copta no Codex II de Nag Hammadi; provavelmente traduzido de um original grego anterior; sem narrativa de Paixao; sem milagres como provas`,
      },
      {
        label: `F2 — A Questao Historica`,
        text: `O Evangelho de Tomas tem accesso a ditos historicos independentes dos Sinopticos — ou e derivado deles? Material especifico: ~1/3 dos ditos tem paralelos nos Sinopticos mas em versao mais curta e potencialmente mais antiga; o debate Koester/Meier sobre a independencia do Tomas; a hipotese Q e sua relacao com Tomas`,
      },
      {
        label: `F3 — O Jesus de Tomas`,
        text: `Que imagem de Jesus emerge do Evangelho de Tomas — e como ela difere do Jesus canonico? Material especifico: Jesus como revelador do autoconhecimento ('Conhece a ti mesmo'); o 'Reino' como presente e interno; a centralizacao na salvacao pelo conhecimento, nao pela fe; a ausencia de escatologia apocaliptica`,
      },
      {
        label: `F4 — Ditos Chave Analisados`,
        text: `Analise profunda dos ditos mais importantes: Logion 1, 3, 13, 22, 28, 50, 70, 77, 108 Material especifico: Logion 3: 'O reino esta dentro de vos e fora de vos'; Logion 70: 'Se trouxeres para fora o que esta dentro de ti, o que trouxeres te salvara; se nao o trouxeres, o que nao trouxeres te destruira'`,
      },
      {
        label: `F5 — Conexoes`,
        text: `Tomas e a Kabbalah; Tomas e Jung; o dito 22 e o 'making two into one' como alquimia e Individuacao Material especifico: O Logion 22 como o mais citado em contextos alquimicos e psicologicos; a androginia primordial como tema transversal (Prompt 5 → P5.1)`,
      },
    ],
  },
  {
    id: '5.2',
    group: 'A',
    title: `Nag Hammadi em Detalhe: os 52 Tratados`,
    prereq: `Prompts 5, 5.1`,
    intro: `O Prompt 5 mencionou que Nag Hammadi continha 52 tratados mas nao os examinou individualmente. Este Prompt faz o catalogo completo — cada tratado com autor (quando identificado), sistema a que pertence, conteudo central e importancia historica. As frentes:`,
    fronts: [
      {
        label: `F1 — Contexto`,
        text: `a descoberta em 1945; a jornada dos manuscritos pelo mercado negro ate chegar ao Institut Francais; a disputa de direitos entre o governo egipcio e os scholars internacionais; a publicacao final em 1977`,
      },
      {
        label: `F2 — Catalogo dos 13 Codices`,
        text: `descricao de cada codex, os tratados que contem, e o sistema gnostico a que pertencem (Setiano, Valentiniano, Hermetico, Acessos incertos)`,
      },
      {
        label: `F3 — Os 10 Tratados Mais Importantes em Detalhe`,
        text: `Apocrife de Joao (o texto gnostico mais influente), Evangelho de Tomas (P5.1), Evangelho de Filipe, Evangelho da Verdade (Valentino), Evangelho dos Egipcios, Trueno (Mente Perfeita — o mais enigmatico), Exegese da Alma, Livro de Tomas, Allogenes, Hipostase dos Archons`,
      },
      {
        label: `F4 — O que ainda nao sabemos`,
        text: `textos que permanecem sem interpretacao consensual; fragmentos sem contexto; os codices que ainda aguardam edicao critica completa`,
      },
      {
        label: `F5 — Nag Hammadi e a comunidade de Sao Pacômio`,
        text: `por que monges cenobitas cristao tinham uma biblioteca gnostica?`,
      },
    ],
  },
  {
    id: '5.3',
    group: 'A',
    title: `Os Mandeus: A Unica Comunidade Gnostica Viva`,
    prereq: `Prompt 5`,
    meta: `Fonte primaria: o Ginza Rba e o Libro de Joao Batista`,
    intro: `Os Mandeus sao a resposta para a pergunta 'o Gnosticismo morreu?' — a resposta e nao. Mas quase ninguem sabe disso. As frentes:`,
    fronts: [
      {
        label: `F1 — Historia`,
        text: `origens no seculo I ou II d.C. na regiao do Jordao (Palestina/Mesopotemia); migracao para o sul do Iraque e sudoeste do Ira; a relacao ambigua com Joao Batista (que e profeta no sistema mandeu mas nao o fundador)`,
      },
      {
        label: `F2 — Teologia`,
        text: `o sistema mandeu — Hayyi Rba (o 'Grande Ser Vivo' como Deus supremo), os Utria (os anjos mandeus), Ptahil como o Demiurgo que criou o mundo material, a alma de luz aprisionada no corpo, o retorno ao 'Mundo da Luz'`,
      },
      {
        label: `F3 — Pratica`,
        text: `o Masbuta (batismo ritual em agua corrente — pode ser realizado multiplas vezes, ao contrario do batismo cristao); os rituais funerarios (Masiqta) para guiar a alma ao Mundo da Luz; o sacerdocio mandeu e sua formacao; a proibicao de converter novos membros`,
      },
      {
        label: `F4 — Os Textos`,
        text: `o Ginza Rba (o 'Grande Tesouro' — a Biblia mandeia); o Libro de Joao Batista (Drazan d-Yahia); o Codex Nasaraeus; os primeiros estudos de Lady Drower (Mandaeans of Iraq and Iran, 1937)`,
      },
      {
        label: `F5 — A Crise Contemporanea`,
        text: `a invasao americana do Iraque em 2003 dispersou a maioria da comunidade; estimativas atuais: 60.000-100.000 membros em diaspora (Australia, EUA, Europa) e restantes no Ira e Iraque; os desafios de manter o sacerdocio e os rituais em diaspora`,
      },
    ],
  },
  {
    id: '5.4',
    group: 'B',
    title: `O Sethianismo: o Sistema Gnostico Mais Complexo`,
    prereq: `Prompts 5, 5.2`,
    intro: `O Sethianismo e o sistema gnostico mais sistematicamente desenvolvido — e o mais diretamente conectado ao Judaismo Mistico do Segundo Templo. E tambem o sistema com o Apocrife de Joao, o texto gnostico mais influente de Nag Hammadi. As frentes:`,
    fronts: [
      {
        label: `F1 — O Sistema Setiano`,
        text: `a Trindade Superior (Pai Invisivel, Barbelo, Cristo Autogeno); os quatro Luminares (Armozel, Oriel, Daveithai, Eleleth); os cinco selos dos ritos de iniciacao`,
      },
      {
        label: `F2 — O Apocrife de Joao em Detalhe`,
        text: `a estrutura da revelacao; a cosmogonia completa de Yaldabaoth e os 12 Archons; a criacao de Adao como prisao para a Fagulha; Eva como instrumento de liberacao (nao de queda); o plano de salvacao de Barbelo`,
      },
      {
        label: `F3 — Set como Portador da Semente Divina`,
        text: `Set, o terceiro filho de Adao e Eva, como o pai da linhagem dos Pneumaticos; a reinterpretacao do Set egipcio (deus do caos) como principio de transmissao da Fagulha divina`,
      },
      {
        label: `F4 — Os Outros Textos Setianos`,
        text: `Zostrian, Allogenes, Marsanes, Tres Tablets de Set, Apocrife de Adao`,
      },
      {
        label: `F5 — Sethianismo e Neoplatonismo`,
        text: `o debate entre Plotino (que escreveu Contra os Gnosticos, Eneadas II.9) e os Gnosticos Setianos que frequentavam seu circulo em Roma — uma controversia historicamente documentada`,
      },
    ],
  },
  {
    id: '5.5',
    group: 'B',
    title: `Valentinismo: o Gnosticismo Filosofico`,
    prereq: `Prompt 5`,
    intro: `O Valentinismo e a escola gnostica mais filosoficamente sofisticada — e a que chegou mais perto de se tornar uma forma aceita do Cristianismo. Valentino concorreu ao papado no sec. II e perdeu 'por um pequeno margem', segundo Tertuliano. As frentes:`,
    fronts: [
      {
        label: `F1 — Valentino (c. 100-175 d.C.)`,
        text: `formacao; o periodo romano (136-165 d.C.); os discipulos que elaboraram e dividiram o sistema (Ptolemeu, Heracleon, Marcos o Mago, Teodoto)`,
      },
      {
        label: `F2 — O Pleroma Valentiniano em Detalhe`,
        text: `os 30 Éons em 4 tetrads; o par Bythos/Sige como Pai Invisivel e Silencio; a Sizigia Anthropos/Ekklesia; o lugar de Sophia no Pleroma e a natureza de sua 'transgressao'`,
      },
      {
        label: `F3 — A Soteriologia`,
        text: `como o Cristo Valentiniano 'entra' no cosmos para resgatar as Fagulhas; os sacramentos valentinianos (o 'leito nupcial' como reuniao da Fagulha com seu anjo); a escatologia — o que acontece no fim dos tempos`,
      },
      {
        label: `F4 — O Evangelho da Verdade`,
        text: `o unico texto confirmado como de Valentino (Codex I de Nag Hammadi); analise detalhada como o texto gnostico estilisticamente mais belo`,
      },
      {
        label: `F5 — O Evangelho de Filipe`,
        text: `os sacramentos valentinianos dos 'cinco misterios' (batismo, crismo, eucaristia, redencao, camara nupcial); a relacao entre Jesus e Maria Madalena; o fragmento 'amava mais a Maria do que a todos os discipulos'`,
      },
    ],
  },
  {
    id: '5.6',
    group: 'B',
    title: `Sophia: O Feminino Divino do Gnosticismo ao Feminismo Contemporaneo`,
    prereq: `Prompts 5, 5.5`,
    meta: `O tema mais subterrâneo de toda a serie`,
    intro: `Sophia (Sabedoria em grego) e a figura mais presente e menos estudada da tradicao esoterica ocidental. Ela atravessa 5.000 anos e virtualmente todas as tradicoes desta serie. As frentes:`,
    fronts: [
      {
        label: `F1 — As Precursoras`,
        text: `Maat (Egito), Hokhma (Proverbios 8 — a Sabedoria que estava com Deus antes da criacao), Shekinah (o aspecto feminino de Deus na Kabbalah)`,
      },
      {
        label: `F2 — Sophia no Gnosticismo`,
        text: `as tres formas de Sophia — Sophia Achamoth (a que cai), Sophia como Mae do Demiurgo, e a Sophia Superior que permanece no Pleroma; a estrutura narrativa da Queda como mito do feminino aprisionado`,
      },
      {
        label: `F3 — Sophia na Tradicao Crista`,
        text: `a identificacao de Cristo com a Sophia biblica (Sofia como pre-encarnacao do Logos); Santa Sofia de Constantinopla como templo dedicado a Sophia; a discussao na teologia ortodoxa russa (Vladimir Solovyov, Pavel Florensky, Sergei Bulgakov)`,
      },
      {
        label: `F4 — Sophia no Ocultismo`,
        text: `Dion Fortune e a 'Mae do Universo'; a Missa Gnostica de Crowley e o papel de Nuit como Sophia cosmica; a Teosofia de Blavatsky e a 'Sabedoria Universal'`,
      },
      {
        label: `F5 — Sophia e o Feminismo Contemporaneo`,
        text: `a teologia feminista de Elizabeth Schussler Fiorenza; o movimento da Espiritualidade da Deusa; a conexao Sophia-Gaia no pensamento ecologico; Anne Baring e Jules Cashford, 'The Myth of the Goddess' (1991)`,
      },
    ],
  },
  {
    id: '5.7',
    group: 'C',
    title: `O Gnosticismo Medieval: Cataros, Bogomilos e Paulicianos`,
    prereq: `Prompts 5, 8`,
    intro: `O Catarismo e o ponto em que o Gnosticismo se torna politicamente perigoso o suficiente para justificar uma Cruzada dentro da Europa. A historia e extraordinaria. As frentes:`,
    fronts: [
      {
        label: `F1 — A Cadeia de Transmissao`,
        text: `Maniqueismo (sec. III d.C.) → Paulicianos (Armenia, sec. VII) → Bogomilos (Bulgaria, sec. X) → Patarenios (Lombardia) → Cataros (Languedoc, sec. XII). Como um sistema gnostico sobreviveu 900 anos de perseguicao atraves de toda a Europa do Leste`,
      },
      {
        label: `F2 — O Sistema Cataro`,
        text: `o dualismo absoluto vs. mitigado (os dois ramos); os dois Deuses; o Consolamentum; a estrutura de Perfeitos (perfecti) e Crentes (credentes)`,
      },
      {
        label: `F3 — A Cruzada Albigense (1209-1229)`,
        text: `'Matar a todos — Deus reconhecera os Seus' (frase atribuida a Arnaud-Amaury em Beziers, 1209); o Tribunal da Inquisicao criado especificamente contra os Cataros; o sitio de Montsegur (1243-1244) e os 225 Perfeitos queimados vivos`,
      },
      {
        label: `F4 — O Que Sobrou`,
        text: `os registros inquisitoriais como fonte primaria sobre a crenca catara; a controversia sobre o 'tesouro de Montsegur'; o Languedoc como territorio de tolerancia religiosa antes da Cruzada`,
      },
      {
        label: `F5 — O Catarismo no Seculo XX`,
        text: `os estudiosos Deodat Roche e Rene Nelli; o romance 'A Perfection of the Morning' de Otto Rahn (que buscou o 'Graal' cataro para os Nazis); a lenda catara nos movimentos neoesotericos contemporaneos`,
      },
    ],
  },
  {
    id: '5.8',
    group: 'C',
    title: `Philip K. Dick como Gnostico Contemporaneo: VALIS e a Exegese`,
    prereq: `Prompt 5`,
    meta: `Pre-req recomendado: Prompt 10 (Jung)`,
    intro: `Philip K. Dick e o mais importante pensador gnostico do seculo XX que nunca se identificou como tal — ele se identificou como um romancista de ficcao cientifica. O que aconteceu com ele em fevereiro/marco de 1974 (o '2-3-74') e um dos eventos mais extraordinarios da historia do pensamento religioso moderno. As frentes:`,
    fronts: [
      {
        label: `F1 — O '2-3-74'`,
        text: `a experiencia de Dick em fevereiro-marco de 1974 — um 'beam of pink light' que transmitiu informacao diretamente em sua mente; o diagnostico de um cisto ureterocele no filho que o raio 'revelou'; a interpretacao do evento como 'memoria de ser cristao no seculo I d.C.'`,
      },
      {
        label: `F2 — A Exegese`,
        text: `os 8.000 manuscritos que Dick escreveu ate sua morte em 1982 tentando explicar o '2-3-74'; as hipoteses que elaborou (o Imperio Romano ainda existe; o tempo parou em 70 d.C.; VALIS — Vast Active Living Intelligence System — esta transmitindo informacao atraves da realidade mundana)`,
      },
      {
        label: `F3 — VALIS como Texto Gnostico`,
        text: `analise do romance VALIS (1981) como autobiografia gnostica disfarçada de ficcao; o personagem Horselover Fat como o alter-ego de Dick; a comparacao com as Sete Pregacoes de Jung`,
      },
      {
        label: `F4 — O Deus Plasmate`,
        text: `o conceito de Dick de uma 'memoria viva' ou 'DNA de informacao sagrada' transmitida entre os iniciados como a alternativa gnostica ao DNA biologico ordinario — e como isso antecipa algumas ideias contemporaneas de biologia de sistemas`,
      },
      {
        label: `F5 — Dick e os Textos Gnosticos`,
        text: `Dick leu os textos de Nag Hammadi? A relacao de seu sistema com o Apocrife de Joao, com os Valentinianos e com o Setianismo`,
      },
    ],
  },
  {
    id: '5.9',
    group: 'C',
    title: `Gnosticismo e Budismo Vajrayana: A Convergencia Esquecida`,
    prereq: `Prompt 5`,
    meta: `Area de pesquisa academica ativa`,
    intro: `Esta e uma das conexoes mais mal conhecidas e mais ricas da historia das religioes. Ela foi mencionada como 'questao aberta' no Prompt 5 — e merece uma pesquisa propria. As frentes:`,
    fronts: [
      {
        label: `F1 — As Convergencias Estruturais`,
        text: `a critica ao cosmos ordinario como samsara (Budismo) vs. Kenoma (Gnosticismo); a liberacao como satori/nirvana vs. Gnose; a 'natureza de Buda' como equivalente da Fagulha Divina; o Buda Primordial (Adi-Buddha no Vajrayana) como equivalente do Pai Invisivel`,
      },
      {
        label: `F2 — O Eixo Historico Possivel`,
        text: `Alexandria como ponto de contato entre budistas e gnosticos (embaixadores de Asoka chegaram ao Egito no sec. III a.C.); os 'Gymnosofistas' que Plotino tentou encontrar na expedicao de Gordiano III; as Sirias como rota de transmissao`,
      },
      {
        label: `F3 — O Mahayana e o Proto-Gnosticismo`,
        text: `o Sutra do Coracao e a doutrina da Shunyata (vacuidade) como possivel influencia mutua com o Gnosticismo alexandrino`,
      },
      {
        label: `F4 — Academicos do Debate`,
        text: `el trabalho de Geddes MacGregor, 'Gnosis: A Renaissance in Christian Thought' (1979); o debate na Society for Buddhist-Christian Studies; a posicao de Elaine Pagels`,
      },
      {
        label: `F5 — O Vajrayana Especificamente`,
        text: `as divindades iratas (Mahakala, Yamantaka) como equivalentes dos Archons que devem ser confrontados e integrados; os mandalas como Pleromas visuais; a pratica do Chod como catabasis vajrayana`,
      },
    ],
  },
  {
    id: '5.10',
    group: 'C',
    title: `O Evangelho de Judas e os Textos Gnosticos Recentes`,
    prereq: `Prompt 5`,
    meta: `O texto foi publicado em 2006 — o mais recente da serie`,
    intro: `O Evangelho de Judas foi publicado em 2006 — 61 anos apos Nag Hammadi — e representa o ultimo grande texto gnostico a entrar no dominio publico. A historia de sua descoberta, commercializacao e publicacao e um thriller academico. As frentes:`,
    fronts: [
      {
        label: `F1 — O Codex Tchacos`,
        text: `descoberto no Egito no final dos anos 1970; vendido e revendido no mercado negro por quase 30 anos; danificado por armazenamento inadequado em sacos de plastico nos EUA; comprado pela National Geographic Society em 2000 e restaurado por Rodolphe Kasser em Genebra`,
      },
      {
        label: `F2 — O Conteudo`,
        text: `Jesus revela a Judas que ele e o unico dos 12 apostolos que compreende realmente quem Jesus e; Judas e escolhido para trair Jesus porque isso libertara a 'estrela' (a Fagulha) do corpo material; os outros apostolos adoram o Deus errado (o Demiurgo); os '13 Eons'`,
      },
      {
        label: `F3 — O Sistema Teologico do Evangelho de Judas`,
        text: `identificado como Setiano por Birger Pearson e Marvin Meyer; as correspondencias com o Apocrife de Joao; a critica interna ao sacrificio eucaristico como rito do Demiurgo`,
      },
      {
        label: `F4 — A Controversia Academica`,
        text: `a traducao original de Meyer (2006) vs. a retraducao de April DeConick (2007) — DeConick argumentou que o Judas do texto era MALEFICO, nao heroico; a expressao 'daimon' como 'demonio', nao 'espirito guia'; o debate continua`,
      },
      {
        label: `F5 — Outros Textos Recentes`,
        text: `o Codex Tchacos contem mais 3 textos (Epistola de Pedro a Filipe, Primeiro Apocalipse de Tiago, Alceste) — menos conhecidos que o Evangelho de Judas mas igualmente importantes para completar o corpus; textos gnosticos ainda nao publicados em edicao critica completa`,
      },
    ],
  },
  {
    id: '5.11',
    group: 'C',
    title: `O Gnosticismo no Divá: Psicanalise como Heresia Crista`,
    prereq: `Prompts 5 e 10`,
    meta: `Baseia-se na tese de Harold Bloom`,
    intro: `Um prompt que fecha o loop entre o inicio e o fim da serie: Harold Bloom arguiu que a Psicanalise, o Gnosticismo e a Literatura Americana compartilham uma estrutura comum — o self autorelativo que nao precisa de mediacao para encontrar o sagrado. As frentes:`,
    fronts: [
      {
        label: `F1 — A Tese de Bloom ('The American Religion', 1992)`,
        text: `a religiao americana autentica e gnostica — o americano medio acredita que a alma existia antes do corpo e que ela se conhece a si mesma em intimidade com Deus sem necesidade de Igreja ou mediacao`,
      },
      {
        label: `F2 — Freud como Heresiarca`,
        text: `a psicanise como sistema que suspeita das instituicoes como instrumentos de repressao (= Demiurgo); que promete liberacao atraves do auto-conhecimento radical (= Gnose); que opera atraves de um relacionamento inicitico (= analista como mystagogo)`,
      },
      {
        label: `F3 — Harold Bloom e a Kabbalah`,
        text: `a teoria literaria de Bloom baseada na 'ansiedade de influencia' tem estrutura kabbalistica — o poeta-filho luta com o poeta-pai como Jacob com o anjo; a criatividade poetica como ato de zimzum (auto-retracao) e de tikun (reparacao)`,
      },
      {
        label: `F4 — O Gnosticismo nas Grandes Narrativas Americanas`,
        text: `Moby Dick como busca gnostica (a baleia branca como o Demiurgo impenetravel); Huckleberry Finn como o Pneumatico que escapa do Mississippi-Kenoma para o territorio livre; a poesia de Emily Dickinson como teologia gnostica em verso`,
      },
      {
        label: `F5 — O Que Permanece`,
        text: `o paradoxo final — se o Gnosticismo e a estrutura profunda da psicologia moderna, da literatura americana e do misticismo leigo contemporaneo, entao o Gnosticismo nao e uma heresia morta mas o sistema de fundo nao-nomeado de grande parte da cultura ocidental atual`,
      },
    ],
  },
];
