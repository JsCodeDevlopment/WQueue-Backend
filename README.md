# WQueue WhatsApp Microservice - Back-end Typescript + Clean Architecture

## 💬 Descrição.

Este projeto é um microsserviço desenvolvido para gerenciar o envio de mensagens em massa para números de WhatsApp utilizando RabbitMQ para gerenciamento de filas e uma API de WhatsApp para o envio das mensagens. O sistema suporta o agendamento das mensagens e a definição de atrasos entre os envios.

## 🚧 Estrutura do Projeto.
A arquitetura segue o padrão de Clean Architecture e Inversão de Dependência. As principais camadas são:
- Domain: Define as entidades, gateways e interfaces do domínio.
Contém as definições de entidades, gateways e interfaces. Essa camada representa o domínio da aplicação e define a lógica de negócios e regras.
- Factories: Define a criação de repositórios, rotas e casos de uso.
Contém a lógica para criar instâncias de repositórios, rotas e casos de uso.
- Infra: Implementa repositórios, rotas, Sequelize e serviços.
Contém implementações específicas de infraestrutura, como repositórios, rotas, e serviços.
- Main: Configura o aplicativo, middlewares, e documentação Swagger.
- Usecases: Implementa casos de uso e DTOs.

📂 **Esquema de pastas:** Este projeto segue os princípios da Clean Architecture, dividindo o código em camadas bem definidas:
```
src
├── domain
│   ├── campaign
│   │   ├── entity
│   │   ├── gateway
│   │   └── interfaces
├── factories
│   ├── repositories
│   │   ├── campaign
│   │   └── rabbit
│   ├── routes
│   │   └── campaign
│   └── useCases
│       ├── campaign
│       └── schedule
├── infra
│   ├── repositories
│   │   ├── campaign
│   │   └── rabbit
│   └── routes
│       └── campaign
│           └── create
│               └── dto
├── main
│   ├── @types
│   ├── adapters
│   │   └── http
│   │       └── interfaces
│   ├── api
│   │   ├── config
│   │   └── interfaces
│   ├── docs
│   │   └── swagger
│   │       ├── components
│   │       │   └── campaign
│   │       │       └── schema
│   │       ├── config
│   │       ├── responses
│   │       └── schemas
│   ├── helpers
│   └── middlewares
└── usecases
    ├── campaign
    │   ├── create
    │   │   └── dto
    │   └── listById
    │       └── dto
    └── message
        └── scheduleMessage
            └── dto
```
## ⚙ Resumo da Estrutura.

- **Entidade:** Define a estrutura e lógica de negócios básica da(s) Entidade(s).
- **Caso de Uso (UseCase):** Implementa a lógica de aplicação específica para criação, edição, deleção, listage ou atualização de uma entidade.
- **Configurações de Rota:** Define a abstração para as rotas HTTP.
- **Rota Específica:** Implementa a lógica da rota para executar uma ação feita no usecase.
- **Ponto de Entrada (Main):** Configura e inicializa a aplicação, incluindo a injeção de dependências.

## 🪀 Fluxo da Aplicação.

### Recepção da Requisição:
- Cliente: Envia uma requisição HTTP para o servidor para agendar o envio de mensagens.
- Infraestrutura de Roteamento: As rotas são configuradas na camada infra/routes e direcionam a requisição para os controladores apropriados.

### Tratamento da Requisição:
- Middlewares: Antes de alcançar o controlador, a requisição passa pelos middlewares definidos (por exemplo, autenticação, validação).
- Controladores: Os controladores na camada infra/routes recebem a requisição e chamam o caso de uso correspondente.

### Caso de Uso (UseCase):
- O caso de uso recebe o DTO de entrada.
- Cria uma instância da entidade Campaign usando o método Ex.: Campaign.create.
- Interage com o repositório Ex.: (CampaignGateway) para persistir o produto no banco de dados.
- Gera um DTO de saída Ex.: (CreateCampaignOutputDto) com os dados do produto criado.

### Interação com o Domínio:
- Camada de Domínio (domain): O caso de uso interage com as entidades e interfaces de domínio (por exemplo, Campaign entity) para realizar a lógica de negócios.

### Repositório (Gateway):
- Camada de Repositórios (factories/repositories e infra/repositories): O caso de uso utiliza os repositórios para acessar e manipular os dados no banco de dados. A implementação do repositório está na camada infra/repositories, mas a interface do repositório é definida na camada factories/repositories.

### Resposta da Rota:
- Casos de Uso e Controladores: Após a execução do caso de uso, o controlador formata a resposta e a envia de volta ao cliente.
- Swagger: A documentação Swagger, configurada na pasta main/docs/swagger, descreve as APIs e suas rotas. A documentação é gerada a partir das definições e schemas Swagger e está acessível para os desenvolvedores via Swagger UI.

### 📱 Exemplo de Fluxo de Criação de uma Campanha
- Requisição: O cliente envia uma requisição POST /campaigns com um corpo multipart/form-data contendo os dados da campanha ex.:
```json
"file": "CONTATOS.csv",
"delay": 5,
"schedule": "2024-07-30T10:34:00Z"
"message": "Contract the best dev web NOW!"
```
.
- Middleware: O middleware do multer pega o csv enviado e salva na pasta uploads.
- Controlador: O controlador CreateCampaignController recebe a requisição e chama CreateCampaignUseCase.
- Caso de Uso: CreateCampaignUseCase valida os dados e utiliza o repositório para persistir o produto.
- Repositório: O repositório RabbitMQRepository usa o RabbitMQ para criar e gerenciar os as queues para que os dados cheguem até o consumer.
- Resposta: O controlador formata a resposta e a envia ao cliente. A resposta é documentada no Swagger para referência.

## 🎯 Instalação.
1°→ Instalação das dependências:
```bash
npm install
# ou
yarn
```
2°→ Configure o RabbitMQ e a Queue no arquivo `.env` crie um arquivo `.env` e cole o código abaixo:
```env
WHITELIST_URLS="http://localhost:3000,http://localhost:3001,http://localhost:8000"

QUEUE_NAME="whatsapp_campaign"
RABBITMQ_URL="amqp://admin:admin@localhost:5672"
```
3°→ Subir o container no docker:
```bash
docker compose up -d
```
4°→ Execute a aplicação:
```bash
npm run dev
# ou
yarn dev

```

## 💻 Tecnologias Utilizadas.

 <div align="center">
  <image src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <image src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <image src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" />
  <image src="https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white" />
  <image src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</div>

## 👨‍💻 Desenvolvedor.

| Foto                                                                                                                           | Nome                                                 | Cargo               |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------- |
| <img src="https://avatars.githubusercontent.com/u/100796752?s=400&u=ae99bd456c6b274cd934d85a374a44340140e222&v=4" width="100"> | [Jonatas Silva](https://github.com/JsCodeDevlopment) | FullStack Developer |
