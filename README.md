# Gnose — Atlas de Estudos

Dashboard para navegar pelo acervo **Gnosticismo e Esoterismo**: dez estudos principais, onze expansões integrais, mapa de influências, glossário, rotas temáticas e ferramentas de estudo pessoal.

## Funcionalidades

- **Cadernos de estudo** — os 21 textos integrais em Markdown, navegação anterior/próximo, pré-requisitos e progresso.
- **Mapa de influências** — grafo interativo P1–P10 com as relações transcritas do documento-mestre; os nós abrem os estudos.
- **Busca aprofundada** — índice local de texto completo, expansão por conceitos relacionados e atalhos diretos para a seção correspondente.
- **Minha biblioteca** — notas, favoritos, trechos destacados com comentário e histórico; busca em notas/destaques, exportação JSON e restauração explícita de backup.
- **Revisão espaçada** — flashcards do glossário, com agendamento inspirado no SM-2 e dados sincronizados por perfil.
- **Glossário, rotas e expansão 5.x** — termos, percursos e referências cruzadas.
- **Autenticação opcional por GitHub** — modo local de usuário único continua disponível; em produção, as APIs podem exigir sessão autenticada.
- **SQLite local e PostgreSQL em produção** — schemas Prisma separados para cada provedor.
- **Testes automatizados e CI** — validação de dados, payloads de API, busca, conversão e algoritmo de revisão.

## Conteúdo e proveniência editorial

Os dez estudos principais e as onze expansões (5.1–5.11) têm Markdown em `public/conteudo/`. Os seis DOCX antes pendentes — 5.5–5.9 e 5.11 — foram convertidos e publicados. Tabelas HTML geradas pelo conversor são tratadas com `rehype-raw` e **sanitizadas** antes da renderização.

Os documentos originais estão preservados em `content/` e, para a expansão 5.11, na raiz. O leitor mostra a procedência do DOCX e o estado editorial. As citações encontradas foram mantidas como aparecem na fonte; **não foi acrescentada bibliografia nem alegada verificação externa**. A data de 23/10/2026 nos seis arquivos convertidos é a data da transcrição, não uma revisão acadêmica. Para estudos cuja data não consta, isso é indicado como não registrado.

> Esta distinção é intencional: uma citação transcrita da fonte não equivale a uma referência bibliográfica verificada. Revisão crítica, uniformização das referências e correção factual continuam sendo trabalho editorial futuro.

## Stack

- Next.js 16 (App Router), React e TypeScript
- Tailwind CSS 4 e componentes Radix/shadcn
- Prisma 6; SQLite local e schema PostgreSQL
- NextAuth 4 com GitHub OAuth opcional e sessões JWT
- TanStack Query e Vitest

## Rodando localmente

Requer Node.js 20.9+ e Bun (recomendado; o `bun.lock` é o lockfile versionado). Também é possível usar npm.

```bash
cp .env.example .env
bun install
bun run db:generate
bun run db:push
bun run dev
```

Abra `http://localhost:3000`. O banco SQLite local fica em `prisma/dev.db` e é ignorado pelo Git. Em modo local, o usuário `local` possui um único espaço pessoal no banco da instância.

## Autenticação e privacidade

A autenticação é opcional em desenvolvimento. Para habilitar login GitHub:

1. Crie um OAuth App do GitHub com callback `${NEXTAUTH_URL}/api/auth/callback/github`.
2. Configure os valores **somente** no `.env` local ou no gerenciador de secrets do deploy — nunca no código ou no Git:
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `NEXTAUTH_SECRET` (gere um segredo aleatório forte)
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_AUTH_ENABLED="true"`
3. Configure `AUTH_REQUIRED="true"` para exigir login para progresso, notas, favoritos, destaques, histórico, revisões, backup e restauração. Em `NODE_ENV=production`, a autenticação é exigida por padrão se essa variável não estiver definida; só use `AUTH_REQUIRED="false"` para uma instância privada de usuário único.

Em desenvolvimento, o fallback local documentado permanece disponível. Com autenticação, o identificador vem da sessão OAuth — o cliente não pode escolher o `userId`. Consultas e alterações pessoais são sempre filtradas por esse identificador; o cache cliente é limpo quando a conta muda. O perfil armazena apenas os dados básicos devolvidos pelo GitHub. Conteúdo público e busca do acervo não exigem login.

## Banco e implantação

O schema padrão `prisma/schema.prisma` usa SQLite para desenvolvimento local. `prisma/schema.postgres.prisma` é destinado à produção. Não use SQLite como banco compartilhado em uma implantação multiusuário.

Para gerar e sincronizar o schema PostgreSQL, defina `DATABASE_URL` como uma URL PostgreSQL **via ambiente/secrets** e rode:

```bash
bun run db:generate:postgres
bun run db:push:postgres
```

A URL nunca deve ser adicionada ao repositório. O schema a validar no fluxo local também pode ser passado pelo argumento `--schema` ou pela variável `PRISMA_SCHEMA`. Os comandos de produção devem ser executados pelo processo de deploy, após configurar a URL e habilitar OAuth.

> `db push` sincroniza o schema Prisma com o banco. Para equipes que precisem de histórico de migrações revisável, use migrations Prisma no pipeline de implantação em vez de sincronização manual.

## API

| Rota | Método | Uso |
| --- | --- | --- |
| `/api/progress` | `GET`, `POST` | Progresso por usuário e estudo |
| `/api/notes` | `GET`, `POST`, `DELETE` | Notas filtradas pelo usuário; listagem geral ou por estudo |
| `/api/bookmarks` | `GET`, `POST`, `DELETE` | Favoritos pessoais |
| `/api/highlights` | `GET`, `POST`, `DELETE` | Trechos destacados e anotações |
| `/api/history` | `GET`, `POST` | Histórico pessoal de leitura |
| `/api/reviews` | `GET`, `POST` | Agenda de flashcards do glossário |
| `/api/export` | `GET` | Backup JSON dos dados pessoais |
| `/api/import` | `POST` | Restaura um backup válido, substituindo somente os dados pessoais da conta atual |
| `/api/search?q=` | `GET` | Busca de conteúdo público com âncora de seção |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Sessão e OAuth GitHub |
| `/api` | `GET` | Health check |

As APIs de dados pessoais validam os itens contra o catálogo publicado e aplicam escopo no servidor. A exportação é privada e responde sem cache. A restauração valida o formato/tamanho, ignora ids de usuário do arquivo e, após confirmação explícita na interface, substitui os dados pessoais da conta atual em uma transação.

## Verificações e CI

```bash
bun run lint
bun run typecheck
bun run test
bun run db:validate:sqlite
bun run db:validate:postgres
bun run build
```

O workflow em `.github/workflows/ci.yml` roda lint, typecheck, testes, validação do schema PostgreSQL e build em push e pull request. Configure as variáveis locais conforme `.env.example`; os valores de CI são descartáveis.

## Organização do projeto

```text
gnose-dashboard/
├── content/                    # DOCX de referência
├── prisma/                     # schemas SQLite e PostgreSQL
├── public/conteudo/            # textos Markdown do leitor
├── scripts/prisma.mjs          # seleção de schema Prisma
├── src/app/api/                # APIs pessoais, autenticação e busca
├── src/components/study/       # dashboard, grafo, leitor e estudo pessoal
├── src/data/                   # catálogo e proveniência das fontes
├── src/hooks/                  # queries isoladas por identidade
└── src/lib/                    # validação, busca e revisão espaçada
```

Para publicar outro estudo, adicione o Markdown em `public/conteudo/`, registre o caminho em `src/data/content-index.ts` e a fonte/estado editorial em `src/data/study-sources.ts`. Para conteúdo convertido de DOCX, preserve a proveniência e não eleve referências da fonte à condição de verificadas sem revisão.
