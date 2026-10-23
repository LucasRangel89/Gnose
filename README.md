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
- **Expansão 5.x** — Os 11 próximos prompts (5.1–5.11) com frentes F1–F5, agrupados em
  Textos/Fontes, Sistemas Específicos e Legados Contemporâneos.
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
├── content/                  # os 11 documentos .docx originais da série (fonte)
│   ├── gnosticismo_MESTRE_indice_glossario_proximos_prompts.docx
│   └── gnosticismo_prompt1..10_*.docx
├── prisma/schema.prisma      # StudyProgress + Note
├── public/                   # logo, hero e robots
├── src/
│   ├── app/                  # layout, providers, API routes (progresso/notas)
│   ├── components/study/     # componentes do dashboard (abas, cards, dialogs)
│   ├── components/ui/        # shadcn/ui
│   ├── data/                 # ★ TODO O CONTEÚDO ACADÊMICO VIVE AQUI
│   ├── hooks/                # use-progress, use-notes
│   └── lib/                  # cliente Prisma, utils
├── .env.example              # modelo de variáveis de ambiente
└── README.md
```

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
| `src/data/types.ts` | Tipos compartilhados | — |

Basta editar os arrays e commitar — a UI se adapta sozinha (contadores, filtros e rotas
derivam dos dados).

### Adicionando os 11 documentos da Seção 5 (Prompts 5.1–5.11)

O índice do documento-mestre já registra os 11 prompts de expansão (5.1–5.11), com
pré-requisitos, metas e frentes de pesquisa — eles aparecem na aba **Expansão 5.x**.
Quando os documentos completos chegarem, o fluxo recomendado é:

1. Guarde o `.docx` em `content/` (ex.: `gnostismo_prompt5.1_*.docx`).
2. Transcreva o conteúdo estruturado para `src/data/nextPrompts.ts` (os campos `fronts`,
   `meta` e `intro` de cada item já existem — é só preencher/ampliar).
3. Se um novo tipo de dado for necessário (ex.: transcrições completas, cronologias),
   crie `src/data/<tema>.ts` + um tipo em `src/data/types.ts` e uma nova aba em
   `src/components/study/` — o padrão das abas existentes serve de guia.
4. Commit + push. Nada de banco é necessário para conteúdo: só para progresso/notas.

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
