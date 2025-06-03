# Checklist de Desenvolvimento: Plataforma de Votação em Tempo Real

Esta lista de tarefas detalha os passos para desenvolver a aplicação de votação em tempo real usando Node.js (NestJS), GraphQL, WebSockets e Docker.

## Fase 1: Configuração Inicial e Ambiente

- [x] **Configurar Ambiente de Desenvolvimento:**
    - [x] Instalar Node.js e NPM/Yarn
    - [x] Instalar Docker e Docker Compose
    - [x] Instalar NestJS CLI (`npm install -g @nestjs/cli`)
    - [x] Instalar Git
- [x] **Estrutura do Projeto Backend (NestJS):**
    - [x] Criar novo projeto NestJS (`nest new backend`)
    - [x] Inicializar repositório Git (`git init`)
    - [x] Configurar linters e formatters (ESLint, Prettier)
- [x] **Configuração do Docker:**
    - [x] Criar `Dockerfile` para a aplicação Node.js/NestJS
    - [x] Criar `docker-compose.yml` definindo serviços:
        - [x] Serviço da aplicação backend (Node.js/NestJS)
        - [x] Serviço do banco de dados (ex: PostgreSQL ou MongoDB)
        - [x] (Opcional) Serviço de cache (ex: Redis)
    - [x] Criar arquivo `.dockerignore`
    - [x] Testar build e execução local com Docker Compose (`docker-compose up --build`)
- [ ] **Estrutura do Projeto Frontend (Escolha seu framework: React, Vue, Angular, etc.):**
    - [ ] Criar novo projeto frontend (ex: `create-react-app`, `vue create`, `ng new`)
    - [ ] Inicializar repositório Git (se for separado do backend)
    - [ ] Configurar linters e formatters

## Fase 2: Desenvolvimento do Backend (NestJS)

- [ ] **Módulo de Enquetes (Polls):**
    - [x] Gerar módulo, controller, service (`nest g module polls`, `nest g controller polls`, `nest g service polls`)
    - [x] Definir entidade/modelo para Enquete (ex: com TypeORM ou Mongoose)
    - [x] Definir entidade/modelo para Opção de Voto
- [x] **Configuração do Banco de Dados:**
    - [x] Instalar dependências do ORM/ODM (TypeORM/Mongoose)
    - [x] Configurar conexão com o banco de dados (usando variáveis de ambiente gerenciadas pelo Docker Compose)
    - [x] Implementar lógica no `PollsService` para interagir com o banco (criar enquete, buscar enquetes, buscar enquete por ID, adicionar voto)
- [ ] **Implementação GraphQL:**
    - [ ] Instalar dependências do GraphQL (`@nestjs/graphql`, `@nestjs/apollo`, `apollo-server-express`, `graphql`)
    - [ ] Configurar `GraphQLModule` no `app.module.ts` (habilitar playground, autoSchemaFile)
    - [ ] Definir tipos GraphQL (Object Types, Input Types) para Enquete e Opção usando decorators (`@ObjectType`, `@Field`, `@InputType`)
    - [ ] Criar `PollsResolver` (`nest g resolver polls`)
    - [ ] Implementar Queries no Resolver (ex: `getPolls`, `getPollById`)
    - [ ] Implementar Mutations no Resolver (ex: `createPoll`, `addVote`)
    - [ ] Testar queries e mutations via GraphQL Playground
- [ ] **Implementação WebSockets (GraphQL Subscriptions):**
    - [ ] Instalar dependências para Subscriptions (já inclusas geralmente com `@nestjs/apollo`)
    - [ ] Habilitar subscriptions na configuração do `GraphQLModule`
    - [ ] Implementar Subscription no `PollsResolver` (ex: `pollUpdated`)
    - [ ] Usar `PubSub` (publish/subscribe) para emitir eventos de atualização:
        - [ ] Injetar `PubSub` no `PollsService` ou `PollsResolver`.
        - [ ] Publicar evento (`pubSub.publish('pollUpdated', { pollUpdated: updatedPoll })`) após um voto ser adicionado com sucesso na mutation `addVote`.
    - [ ] Testar subscriptions via GraphQL Playground

## Fase 3: Desenvolvimento do Frontend

- [ ] **Configuração do Cliente GraphQL:**
    - [ ] Instalar cliente GraphQL (ex: Apollo Client, urql)
    - [ ] Configurar o cliente para conectar ao endpoint GraphQL do backend (considerar URL do Docker)
    - [ ] Configurar o cliente para suportar WebSockets/Subscriptions
- [ ] **Componentes da UI:**
    - [ ] Componente para listar enquetes
    - [ ] Componente para exibir detalhes de uma enquete (pergunta, opções, resultados)
    - [ ] Componente para criar nova enquete (formulário)
    - [ ] Componente para exibir resultados (ex: gráfico de barras)
- [ ] **Integração com GraphQL:**
    - [ ] Implementar query para buscar lista de enquetes
    - [ ] Implementar query para buscar detalhes de uma enquete
    - [ ] Implementar mutation para criar enquete
    - [ ] Implementar mutation para adicionar voto
- [ ] **Integração com WebSockets/Subscriptions:**
    - [ ] Implementar a inscrição (subscription) para receber atualizações da enquete ativa.
    - [ ] Atualizar o estado do componente de resultados quando uma nova mensagem da subscription for recebida.
    - [ ] Lidar com conexão/desconexão do WebSocket.

## Fase 4: Testes

- [ ] **Testes Unitários (Backend):**
    - [ ] Testar `PollsService` (mockando dependências como repositório/modelo)
    - [ ] Testar `PollsResolver` (mockando `PollsService`)
    - [ ] Usar Jest (padrão no NestJS)
- [ ] **Testes de Integração (Backend):**
    - [ ] Testar endpoints GraphQL (queries, mutations) interagindo com um banco de dados de teste (pode rodar em Docker)
    - [ ] Testar funcionalidade das Subscriptions
    - [ ] Usar Supertest ou similar
- [ ] **Testes Unitários/Componentes (Frontend):**
    - [ ] Testar componentes da UI isoladamente (ex: com Jest e React Testing Library/Vue Test Utils)
    - [ ] Mockar chamadas GraphQL/WebSocket
- [ ] **Testes End-to-End (Opcional):**
    - [ ] Simular fluxo completo do usuário (criar enquete, votar, ver atualização) usando ferramentas como Cypress ou Playwright.

## Fase 5: Deploy

- [ ] **Configurar CI/CD:**
    - [ ] Criar pipeline (ex: GitHub Actions) para:
        - [ ] Rodar linters
        - [ ] Rodar testes
        - [ ] Construir imagem Docker do backend
        - [ ] Construir aplicação frontend (arquivos estáticos)
        - [ ] Publicar imagem Docker (ex: Docker Hub, AWS ECR, Google GCR)
        - [ ] Implantar backend (ex: Cloud Run, ECS, Kubernetes)
        - [ ] Implantar frontend (ex: Netlify, Vercel, S3 + CloudFront)
- [ ] **Configurar Variáveis de Ambiente em Produção:**
    - [ ] Definir segredos (senhas de banco, chaves de API) de forma segura.
- [ ] **Monitoramento e Logging:**
    - [ ] Configurar serviço de monitoramento/logging (ex: Datadog, Sentry, New Relic) se necessário.

Lembre-se de que esta é uma lista abrangente. Você pode adaptar a ordem e priorizar tarefas conforme necessário. Boa codificação!
