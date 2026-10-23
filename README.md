# Gnose — Dashboard de Estudos

Dashboard de estudos autodidata sobre **Gnosticismo e Esoterismo**, construído a partir
do *Documento-Mestre* da série (índice cruzado, glossário técnico e próximos prompts).
Acompanhe seu progresso, anote insights e navegue pelo arquivo completo em um só lugar.

![Hero](public/images/hero-gnose.png)

## Funcionalidades

- **Visão Geral** — Mapa dos 10 prompts (pré-requisitos, conceito central, pergunta
  fundamental), progresso geral, guia de uso e as Linhas de Influência Direta entre prompts.
- **Índice Cruzado** — 20 conceitos em 4 categorias (Cosmologia, Figuras e Entidades,
  Práticas, Conceitos Filosóficos), com busca e filtro por prompt (P1–P10).
- **Glossário** — 57 termos com tradição de origem, prompts onde aparecem e definição
  (o sinal `||` separa usos divergentes entre tradições). Busca + navegação por letra.
- **Rotas de Leitura** — A ordem numérica (genealogia histórica) e as 4 rotas temáticas
  (Problema do Mal, Feminino Sagrado, Conhecimento Proibido, Correspondências), com os
  passos coloridos conforme o status de cada prompt.
- **Expansão 5.x** — Os 11 prompts de expansão (5.1–5.11) com frentes F1–F5, agrupados em
  Textos/Fontes, Sistemas Específicos e Legados Contemporâneos.
- **Leitor de estudos completo** — O texto integral de cada estudo (Prompts 1–10 e
  5.1–5.10) renderizado em Markdown com tabelas, citações e tipografia de leitura;
  navegação Anterior/Próximo dentro da coleção e status editável no próprio leitor.
  O 5.11 (Harold Bloom) aparece como *Conteúdo pendente* até ser adicionado.
- **Progresso e notas** — Status por item (Não iniciado / Em progresso / Concluído) e
  notas de estudo, persistidos em banco SQLite via API (atualização otimista na UI).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://www.prisma.io) + SQLite (progresso e notas)
- [TanStack Query](https://tanstack.com/query) (estado de servidor)
- [next-themes](https://github.com/pacocoursey/next-themes) (tema claro/escuro)

## Rodando localmente

```bash
# 1. instalar dependências
bun install            # ou npm install

# 2. configurar o ambiente (já existe um .env no pacote; o .env.example serve de modelo)
cp .env.example .env   # se ainda não existir

# 3. criar/sincronizar o banco (db/custom.db)
bun run db:push

# 4. iniciar
bun run dev            # http://localhost:3000
```

> **Nota:** o banco SQLite fica em `db/custom.db` e **não** é versionado no Git — ele é
> criado pelo `db:push`. Seu progresso e suas notas são locais; faça backup copiando o
> arquivo quando quiser.

## Subindo para o GitHub

O projeto foi empacotado para o upload direto no GitHub. A partir da pasta extraída do
`.zip`, basta:

```bash
cd gnose-dashboard

# iniciar o repositório
git init
git add .
git commit -m "feat: dashboard de estudos Gnose & Esoterismo (v1)"

# criar o repositório no GitHub (via gh CLI) e enviar
gh repo create gnose-dashboard --public --source=. --push

# — ou manualmente —
# 1. crie o repositório vazio em github.com/new (sem README/.gitignore)
# 2. git remote add origin git@github.com:SEU-USUARIO/gnose-dashboard.git
# 3. git branch -M main
# 4. git push -u origin main
```

A partir daí, o fluxo de evolução incremental é o comum:

```bash
git add . && git commit -m "feat: <o que mudou>" && git push
```

## Estrutura do repositório

```
gnose-dashboard/
├── content/                  # os 21 documentos .docx originais da série (fonte)
│   ├── gnosticismo_MESTRE_indice_glossario_proximos_prompts.docx
│   ├── gnosticismo_prompt1..10_*.docx      # série principal
│   └── gnosticismo_prompt51..510_*.docx    # expansão 5.1–5.10
├── prisma/schema.prisma      # StudyProgress + Note
├── public/
│   ├── conteudo/             # ★ estudos completos em Markdown (lidos pelo leitor)
│   │   ├── prompts/          # prompt-01 … prompt-10 (.md)
│   │   └── serie-5/          # prompt-5.1 … prompt-5.10 (.md)
│   └── images/               # logo, hero e robots
├── src/
│   ├── app/                  # layout, providers, API routes (progresso/notas)
│   ├── components/study/     # componentes do dashboard (abas, cards, leitor)
│   ├── components/ui/        # shadcn/ui
│   ├── data/                 # ★ conteúdo estruturado (índices, glossário, rotas)
│   ├── hooks/                # use-progress, use-notes
│   └── lib/                  # cliente Prisma, utils
├── .env.example              # modelo de variáveis de ambiente
└── README.md
```

> **Nota:** `public/gnose-dashboard.zip` é a cópia de distribuição do próprio pacote
> (usada pelo link “Baixar pacote” do rodapé). Pode removê-la do repositório se preferir.

## Onde está o conteúdo (e como editar)

Todo o conteúdo acadêmico vive em **arquivos de dados versionáveis** — é neles que você
vai incorporar novos estudos:

| Arquivo | Conteúdo | Parte do documento-mestre |
| --- | --- | --- |
| `src/data/prompts.ts` | 10 prompts + linhas de influência | Parte I |
| `src/data/concepts.ts` | Índice cruzado de conceitos | Parte II |
| `src/data/glossary.ts` | Glossário técnico unificado | Parte III |
| `src/data/routes.ts` | Rotas de leitura temáticas | Parte IV |
| `src/data/nextPrompts.ts` | Expansão 5.1–5.11 | Parte V |
| `src/data/content-index.ts` | Mapa id → arquivo Markdown do leitor | — |
| `src/data/types.ts` | Tipos compartilhados | — |

Basta editar os arrays e commitar — a UI se adapta sozinha (contadores, filtros e rotas
derivam dos dados).

### Série 5 (expansão do Gnosticismo) — situação atual

Os 20 estudos disponíveis já estão integrados com o **texto completo**: a série principal
(Prompts 1–10) em `public/conteudo/prompts/` e a expansão (5.1–5.10) em
`public/conteudo/serie-5/`, ambos em Markdown (convertidos dos `.docx` de `content/`).
Só o **Prompt 5.11** (Harold Bloom e a Gnose Americana) permanece pendente.

### Adicionando o Prompt 5.11 (ou qualquer estudo novo)

1. Guarde o `.docx` original em `content/`.
2. Salve a versão Markdown em `public/conteudo/serie-5/prompt-5.11-harold-bloom-e-a-gnose-americana.md`
   (a conversão foi feita com `pandoc -f docx -t gfm` + ajustes de título — o formato
   esperado é: `# TÍTULO`, subtítulo em blockquote, linha `**PROMPT … | PRE-REQ …**`,
   seções `## FRENTE …` / `### …`, tabelas GFM e citações em blockquote).
3. Registre o caminho no mapa `contentFiles` de `src/data/content-index.ts`
   (a linha comentada `"5.11": …` já existe como modelo).
4. Commit + push — o leitor passa a exibir o estudo automaticamente (a navegação
   Anterior/Próximo e o estado “pendente” são derivados do mapa).

## API

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/progress` | `GET` | Lista o progresso de todos os itens |
| `/api/progress` | `POST` | Cria/atualiza status (`itemType`, `itemId`, `status`) |
| `/api/notes?itemType=&itemId=` | `GET` | Notas de um item |
| `/api/notes` | `POST` | Cria nota (`itemType`, `itemId`, `content`) |
| `/api/notes?id=` | `DELETE` | Remove nota |

## Ideias para evoluir

- Página de detalhe por prompt com resumos e links para os documentos da série.
- Flashcards/quiz gerados a partir do glossário (repetição espaçada).
- Exportação do progresso (CSV/JSON) e backup do banco.
- Marcação de trechos e citações por prompt.
- Suporte a múltiplos "ciclos de estudo" (revisões).

---

Série: *Mapa de Estudos sobre Gnosticismo e Esoterismo* — Documento-Mestre de Referência.
