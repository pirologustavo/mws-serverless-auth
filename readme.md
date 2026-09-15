# MWS - Autenticação Serverless
### MVP - Tech Challenge (Gestão de Oficina Mecânica)

Este repositório contém o código-fonte da função **Serverless (AWS Lambda)** responsável pela autenticação de clientes no sistema MWS. O objetivo deste componente é atuar na borda da nuvem, protegendo o cluster Kubernetes de requisições não autorizadas e aliviando a carga de processamento dos microsserviços.

---

## Organização do Ecossistema (4 Repositórios)
Para atender aos requisitos de desacoplamento, segurança e responsabilidade única, o projeto está estruturado em 4 repositórios distintos:

| Componente | Repositório | Descrição do Componente |
| :--- | :--- | :--- |
| **MWS-App** | `mws-app` | Código-fonte dos microsserviços (PHP/Laravel). |
| **MWS-Serverless (Este)** | `mws-serverless-auth` | Função AWS Lambda para validação de CPF e geração de Token JWT. |
| **MWS-Infra-K8s** | `mws-infra-k8s` | Código Terraform para provisionamento do cluster Amazon EKS. |
| **MWS-Infra-DB** | `mws-infra-db` | Código Terraform para provisionamento do banco de dados Amazon RDS. |

---

## Arquitetura e Fluxo de Autenticação (Offloading)
Em conformidade com a decisão arquitetural documentada na **ADR 001**, adotamos o padrão de *Offloading de Autenticação*:

1. O cliente realiza uma requisição `POST /auth/cliente` enviando seu CPF.
2. O **API Gateway** intercepta a requisição e a roteia para esta função **AWS Lambda**.
3. A Lambda consulta o banco de dados (Amazon RDS) para validar a existência e o status do cliente.
4. Caso o acesso seja autorizado, a Lambda assina e gera um **Token JWT** utilizando uma chave secreta (`secret_key`) compartilhada simetricamente com os microsserviços.
5. O token é retornado ao cliente, que deverá enviá-lo no cabeçalho `Authorization: Bearer` para consumir as APIs de negócio no cluster EKS.

### Tecnologias Utilizadas
* **Cloud Provider:** AWS Lambda & Amazon API Gateway
* **Segurança:** Criptografia JWT (JSON Web Token)
* **Linguagem:** Node.js / JavaScript *(Nota: Ajuste caso tenha feito a Lambda em Python ou outra linguagem)*

---

## Pipeline de CI/CD e Governança
Este repositório utiliza automação completa via **GitHub Actions**.

Fluxo da Pipeline:
1. Pull Request / Push na branch main.
2. Execução de validações estáticas de código (Linting e Qualidade).
3. Empacotamento das dependências e do código-fonte (Artefato ZIP).
4. Deploy automatizado na AWS utilizando AWS CLI ou Serverless Framework.

**Proteção de Branches:** A branch `main` é protegida contra commits diretos. Qualquer alteração deve obrigatoriamente ser submetida via **Pull Request (PR)**.

---

## Instruções de Execução e Deploy

> **Nota de Contingência Arquitetural:** Devido à limitação/expiração dos créditos da conta de laboratório da AWS Academy durante o ciclo final de desenvolvimento, este repositório atesta a arquitetura corporativa desenhada. O fluxo pode ser emulado localmente para fins de desenvolvimento.

### Pré-requisitos
* Node.js instalado localmente.
* Credenciais da AWS configuradas (via `aws configure`) para deploy em nuvem.

### Como executar/testar localmente
1. Clone este repositório:
   ```bash
   git clone [https://github.com/pirologustavo/mws-serverless-auth.git](https://github.com/pirologustavo/mws-serverless-auth.git)
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o script de emulação local:
   ```bash
   npm run start
   ```
   
---

## Documentação e ADRs
[ADR 001 - Implementação de API Gateway e Offloading de Autenticação](https://app.notion.com/p/ADR-001-Implementa-o-de-API-Gateway-e-Offloading-de-Autentica-o-3d5b36cb511a8013a4b7f6f0048dced4?source=copy_link) <br>
[Acesse a Documentação no Notion](https://www.notion.so/TECH-CHALLENGE-338b36cb511a80cb9c12d5c70c5682c7?source=copy_link) <br>
[Endpoints (Postman)](https://gustavo-5520387.postman.co/workspace/Gustavo's-Workspace~e01e23b1-b0c9-4148-8bea-f931ea6d3628/collection/45952571-cfa04a96-15fd-4662-b65d-0e6b27d75d80?action=share&creator=45952571)

---

---

## Autor
- Gustavo Pirolo - Cientista da Computação & Junior Development Analyst
- Apelido do Servidor: Gustavo Pirolo - RM371637
