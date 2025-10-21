# Bulir Frontend

Interface do sistema **Bulir**, desenvolvida com **Next.js 15**, **React 19** e **TailwindCSS 4**, que se conecta à API do backend em Express + Knex.

---

## 🚀 Tecnologias

- **Next.js 15 (App Router)**
- **React 19**
- **TailwindCSS 4**
- **Axios**
- **React Hook Form + Yup/Zod**
- **Radix UI Components**
- **Lucide Icons**
- **Sonner (notificações)**

---

## ⚙️ Pré-requisitos

Certifique-se de ter instalado:

- [Node.js 20+](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- Backend do Bulir rodando (porta **3333** por padrão)

---

## 🧩 Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com o conteúdo:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333/api/
```

---

## 🛠️ Instalação

```bash
# Instalar dependências
yarn install
# ou
npm install
```

---

## 🧑‍💻 Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
yarn dev
# ou
npm run dev
```

O app estará disponível em **http://localhost:3000**

---

## 🏗️ Build de produção

```bash
# Gerar build otimizada
yarn build

# Iniciar servidor de produção
yarn start
```

---

## 🔍 Lint

```bash
yarn lint
```

---

## 🧠 Estrutura de pastas

```
src/
 ├─ app/              # Rotas (Next.js App Router)
 ├─ components/       # Componentes reutilizáveis
 ├─ hooks/            # Hooks customizados
 ├─ lib/              # Configurações e utilitários
 ├─ services/         # Conexão com API (axios)
 ├─ styles/           # Estilos globais
 └─ types/            # Tipos e interfaces
```

---

## 🤝 Conectando com o Backend

Certifique-se de que o **Bulir API** está rodando em `http://localhost:3333`.  
O frontend usa a variável `NEXT_PUBLIC_API_URL` para consumir os endpoints (ex: `/api/users`, `/api/bookings`, etc).

