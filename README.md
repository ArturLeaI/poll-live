# Poll Live Server
## Funcionalidades Principais

O projeto `poll-live-server` é uma aplicação backend robusta, desenvolvida com o propósito de gerenciar enquetes interativas, apresentando uma arquitetura que sugere fortemente capacidades de atualização em tempo real. Uma análise aprofundada da estrutura do código, particularmente no diretório `src/polls`, que abriga controladores, serviços, resolvers e esquemas de dados relacionados a enquetes e opções de voto, revela um conjunto coeso de funcionalidades essenciais. Entre elas, destacam-se a capacidade de **criar novas enquetes**, permitindo a definição clara da pergunta e das opções de voto correspondentes. A aplicação também oferece a funcionalidade de **listar todas as enquetes** cadastradas na plataforma, proporcionando uma visão geral do conteúdo disponível. Adicionalmente, é possível **consultar os detalhes de uma enquete específica**, o que inclui não apenas a pergunta e as opções, mas também a contagem atualizada de votos para cada alternativa. Uma funcionalidade central é o **registro de votos**, que permite aos usuários participarem ativamente das enquetes, selecionando a opção desejada. Por fim, o próprio nome do projeto ("live-server") e a adoção de tecnologias como GraphQL, com seus resolvers, apontam para uma provável implementação de **atualizações em tempo real** dos resultados. Isso sugere que os clientes conectados à aplicação podem ser notificados instantaneamente sobre novos votos, possivelmente através de mecanismos como WebSockets ou GraphQL Subscriptions, enriquecendo a experiência interativa.



## Tecnologias Utilizadas

O desenvolvimento do `poll-live-server` emprega um conjunto moderno de tecnologias focadas em performance, escalabilidade e boas práticas de desenvolvimento. A base da aplicação é construída sobre o **NestJS**, um framework Node.js progressivo para a construção de aplicações server-side eficientes e escaláveis. O NestJS utiliza **TypeScript** como linguagem principal, o que adiciona tipagem estática ao JavaScript, melhorando a manutenibilidade e a detecção de erros em tempo de desenvolvimento.

Para a comunicação com o cliente, o projeto adota **GraphQL**, uma linguagem de consulta para APIs que permite aos clientes requisitarem exatamente os dados de que precisam. A implementação do GraphQL é facilitada pelo módulo `@nestjs/graphql` e `@nestjs/apollo`, integrando o servidor Apollo ao ecossistema NestJS. A persistência de dados é gerenciada através do **Mongoose**, um ODM (Object Data Modeling) para MongoDB, indicado pelo uso do módulo `@nestjs/mongoose`. Isso confirma que o banco de dados utilizado é o **MongoDB**, um banco de dados NoSQL orientado a documentos, configurado para rodar em um container Docker.

A qualidade do código e a robustez da aplicação são garantidas através de testes automatizados, utilizando o **Jest**, um framework de testes JavaScript popular, configurado tanto para testes unitários (`*.spec.ts`) quanto para testes end-to-end (`test/app.e2e-spec.ts`), com configurações específicas em `test/jest-e2e.json`. A padronização do código é mantida com o uso de ferramentas como **Prettier** e **ESLint**, garantindo um estilo de código consistente em todo o projeto.

Finalmente, a aplicação é totalmente containerizada utilizando **Docker**. O `Dockerfile` define a imagem da aplicação, enquanto o `docker-compose.yml` orquestra a execução da aplicação (`app`) junto com sua dependência principal, o banco de dados MongoDB (`db`). Isso simplifica enormemente a configuração do ambiente de desenvolvimento e o processo de deploy, garantindo consistência entre diferentes ambientes.



## Instruções de Execução Local

Para executar o projeto `poll-live-server` em seu ambiente local, é necessário ter o Docker e o Docker Compose instalados. A configuração do projeto foi pensada para simplificar ao máximo o processo de setup, utilizando containers para a aplicação e suas dependências. Siga os passos abaixo:

1.  **Clone o Repositório:** Primeiramente, obtenha uma cópia local do código-fonte. Abra seu terminal e execute o comando de clonagem do Git:
    ```bash
    git clone https://github.com/ArturLeaI/poll-live-server.git
    ```
2.  **Navegue até o Diretório:** Após a clonagem ser concluída, acesse o diretório raiz do projeto que foi criado:
    ```bash
    cd poll-live-server
    ```
3.  **Execute com Docker Compose:** Dentro do diretório raiz, utilize o Docker Compose para construir as imagens (se ainda não existirem) e iniciar os containers da aplicação e do banco de dados MongoDB em modo detached (background). Execute o seguinte comando:
    ```bash
    docker-compose up -d
    ```
    Este comando irá baixar a imagem do MongoDB, construir a imagem da aplicação NestJS conforme definido no `Dockerfile`, e iniciar ambos os serviços. O serviço da aplicação (`app`) depende do serviço de banco de dados (`db`), garantindo que o banco de dados esteja pronto antes que a aplicação tente se conectar.

Após a execução bem-sucedida do `docker-compose up -d`, a aplicação estará rodando e acessível. Por padrão, conforme definido no `docker-compose.yml`, a API estará disponível na porta `3000` do seu localhost. Você poderá interagir com a API GraphQL através de ferramentas como o Apollo Studio ou o GraphQL Playground, geralmente acessível em `http://localhost:3000/graphql` (verifique a configuração exata no código ou na documentação do NestJS/GraphQL se necessário).

Para parar os containers, execute `docker-compose down` no mesmo diretório.
