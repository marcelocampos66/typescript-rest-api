<h1 align="center">TypeScript REST API</h1>

[![Generic badge](https://img.shields.io/badge/Develop-TypeScript-blue?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-NodeJs-green?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-Express-yellow?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-MongoDB-green?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-REST%20RESTful-red?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-POO-pink?style=for-the-badge&logo=appveyor)](https://shields.io/)

<br/>

## Sobre o Projeto

Este projeto é uma **API RESTful** desenvolvida em **TypeScript** com foco em boas práticas de engenharia de software, arquitetura limpa e escalabilidade.

A API fornece um serviço de gerenciamento de usuários com funcionalidades como **cadastro (sign-up)**, **criação**, **listagem paginada**, **busca por ID** e **atualização de perfil**, além de contar com **autenticação e autorização via JWT**.

## Stack Tecnológica

| Tecnologia | Finalidade |
|---|---|
| **TypeScript** | Linguagem principal, garantindo tipagem estática |
| **Express** | Framework HTTP para exposição dos endpoints REST |
| **MongoDB / Mongoose** | Banco de dados NoSQL e ODM para persistência |
| **RabbitMQ (amqplib)** | Message broker para comunicação assíncrona via consumers |
| **JWT (jsonwebtoken)** | Autenticação e geração de tokens |
| **Joi / Zod** | Validação de dados de entrada das requisições |
| **tsyringe** | Container de Inversão de Dependência (IoC/DI) |
| **Winston** | Logger estruturado da aplicação |
| **Docker** | Containerização para deploy |

## Arquitetura

O projeto segue princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizado em camadas bem definidas:

- **`src/application/`** — Ponto de entrada da aplicação (`server.ts`), adaptadores (Express), configurações (env, logger) e validators genéricos (Joi, Zod).
- **`src/core/`** — Núcleo da aplicação contendo classes base (`Controller`, `Service`), protocolos/interfaces, sistema de injeção de dependência, middlewares reutilizáveis (autenticação, autorização, validação, content-type) e tratamento padronizado de erros HTTP.
- **`src/data/`** — Camada de protocolos de dados, definindo contratos para broker servers, criptografia e banco de dados.
- **`src/domains/`** — Domínios de negócio versionados (`v1/`). O domínio de **Users** contém entidades, DTOs, controllers, services, repositories, use-cases, consumers, validators e subdomínios (autenticação).
- **`src/infra/`** — Implementações concretas de infraestrutura: conexão com MongoDB, servidor RabbitMQ e criptografia.
- **`src/routes/`** — Configuração centralizada de rotas.

## Padrões e Práticas

- **Inversão de Dependência (DI):** `tsyringe` com tokens para registrar e resolver dependências, desacoplando as camadas.
- **Repository Pattern:** Interfaces genéricas (`FindByIdRepository`, `ListRepository`, `PaginateRepository`, `CreateRepository`, `UpdateRepository`, etc.) garantem independência de implementação de banco.
- **Base Classes:** Classes genéricas `Service<T>` e `Controller` fornecem implementações reutilizáveis.
- **Middlewares encadeáveis:** Autenticação, autorização, validação e content-type como middlewares composíveis nas rotas.
- **Validação desacoplada:** Suporte a múltiplas bibliotecas (Joi e Zod) através de uma interface `Validator` genérica.
- **Event-driven:** Integração com RabbitMQ para processamento assíncrono de eventos (ex: `UserCreatedConsumer`).
- **Versionamento de API:** Rotas organizadas sob `/v1/`, permitindo evolução sem quebrar contratos.
- **Suporte a transações:** Operações críticas executáveis de forma transacional no MongoDB.
- **Docker-ready:** Dockerfiles para produção e desenvolvimento.

## Endpoints Disponíveis

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/users/sign-up` | Cadastro público de usuário | ❌ |
| `POST` | `/users` | Criação de usuário (transacional) | ✅ |
| `GET` | `/users` | Listagem paginada de usuários (com cache) | ✅ |
| `GET` | `/users/:userId` | Busca de usuário por ID | ✅ |
| `PUT` | `/users/profile` | Atualização do perfil do usuário autenticado | ✅ |

## Rodando o app via Docker

Para rodar o projeto via docker, basta executar dois comandos. Os comandos devem ser executados a partir da raiz do projeto, sendo o primeiro para buildar a imagem:

    docker build -t rest-api .

Na sequência basta executar o comando que vai levantar o container a partir da imagem criada:

    docker run -e PORT=3001 -e JWT_SECRET=secret -e MONGO_DB_HOST=127.0.0.1:27017 -e MONGO_DB=users-api -d -p 3001:3001 rest-api
