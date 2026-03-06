# GUIAP — Planejador Inteligente de Rotas Turísticas

O **GUIAP** é uma aplicação desenvolvida em **Java com Spring Boot** que permite gerar roteiros turísticos inteligentes utilizando integração com serviços de mapas e inteligência artificial.

A aplicação permite que usuários criem itinerários personalizados, organizem pontos turísticos e visualizem rotas otimizadas por meio de uma interface web.

---

# Funcionalidades

* Geração de roteiros turísticos inteligentes
* Integração com serviços de mapas
* Recomendações geradas por inteligência artificial
* Upload de arquivos
* Interface web interativa
* Persistência de dados com banco H2
* Arquitetura baseada em API REST
* Organização em camadas seguindo boas práticas de desenvolvimento

---

# Arquitetura do Projeto

O sistema segue uma arquitetura em camadas:

**Controller**
Responsável por receber as requisições HTTP e retornar respostas para o cliente.

**Service**
Contém a lógica de negócio da aplicação, como geração de rotas e processamento de dados.

**Repository**
Responsável pela comunicação com o banco de dados utilizando Spring Data JPA.

**DTO / Mapper**
Responsáveis pela transferência segura de dados entre as camadas do sistema.

**Model**
Define as entidades do sistema e estrutura do banco de dados.

---

# Tecnologias Utilizadas

## Backend

* Java 17+
* Spring Boot
* Spring Data JPA
* Hibernate

## Banco de Dados

* H2 Database

## Frontend

* Thymeleaf
* HTML
* CSS
* JavaScript

## APIs Externas

* Google Maps API
* Google Gemini AI

## Ferramentas

* Maven
* Git
* GitHub

---

# Estrutura do Projeto

```
src/main/java/com/IFSP/Prototipo

config/
controller/
dto/
mapper/
model/
repository/
service/
```

Recursos da aplicação:

```
src/main/resources

templates/
static/
application.properties
```

---

# Variáveis de Ambiente

Por segurança, **chaves de API não são armazenadas no repositório**.

Crie variáveis de ambiente:

```
GEMINI_API_KEY=sua_chave
GOOGLE_MAPS_KEY=sua_chave
```

No arquivo `application.properties`:

```
gemini.api.key=${GEMINI_API_KEY}
google.maps.key=${GOOGLE_MAPS_KEY}
```

---

# Como Executar o Projeto

Clone o repositório:

```
git clone https://github.com/seu-usuario/guiap.git
```

Entre na pasta:

```
cd guiap
```

Execute o projeto:

```
./mvnw spring-boot:run
```

ou

```
mvn spring-boot:run
```

A aplicação ficará disponível em:

```
http://localhost:8080
```

---

# Banco de Dados

Durante o desenvolvimento o sistema utiliza **H2 Database**.

Os arquivos do banco não são versionados no Git para evitar exposição de dados.

---

# Upload de Arquivos

Os arquivos enviados pelos usuários são armazenados na pasta:

```
uploads/
```

Essa pasta é ignorada pelo Git por questões de segurança.

---

# Segurança

O projeto segue algumas práticas de segurança:

* Uso de variáveis de ambiente para chaves de API
* Arquivos sensíveis ignorados no `.gitignore`
* Separação de camadas no backend
* Proteção contra exposição de dados sensíveis

---

# Melhorias Futuras

* Autenticação com JWT
* Banco de dados PostgreSQL
* Containerização com Docker
* Deploy automatizado
* Melhorias na geração de rotas com IA

---

# Licença

Este projeto foi desenvolvido para fins acadêmicos e de aprendizado.