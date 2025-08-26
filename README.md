# 🚀 OrderFlow - Meu  Primeiro Aplicativo Móvel!

Bem-vindo ao **OrderFlow**! Este é o resultado do meu primeiro mergulho no mundo do desenvolvimento mobile com Expo e React Native. Um aplicativo simples, mas robusto, feito para gerenciar ordens de serviço.

## ✨ Visão Geral do Projeto

O **OrderFlow** é um aplicativo mobile focado na gestão de ordens de serviço. Ele permite que o usuário faça login, visualize o status das ordens (em andamento, pendentes, concluídas), e navegue por detalhes.

### Principais Funcionalidades:

- **Autenticação Segura:** Login de usuários com Supabase.
- **Dashboard Intuitivo:** Visão geral do status das ordens.
- **Gestão de Ordens:** Visualização de uma lista de ordens.
- **Interface Moderna:** Design limpo e responsivo.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

- **React Native:** Framework para construção de interfaces mobile.
- **Expo:** Ferramenta para desenvolvimento rápido e fácil de apps React Native.
- **Expo Router:** Sistema de roteamento baseado em arquivos para navegação.
- **Supabase:** Backend-as-a-Service (BaaS) para autenticação e banco de dados.
- **TypeScript:** Linguagem para tipagem estática e maior robustez do código.
- **React Native Charts Kit:** Para a visualização de gráficos no dashboard.
- **Expo Camera:** Para funcionalidades de câmera dentro do app.

## ⚙️ Configuração e Execução do Projeto

Para rodar o **OrderFlow** em sua máquina local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (versão LTS recomendada)
- **npm** ou **Yarn**
- **Expo CLI**:
  ```bash
  npm install -g expo-cli
  # ou
  yarn global add expo-cli
  ```

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Xwiuu/OrderFlow.git
    cd OrderFlow
    ```

        (Substitua `<URL_DO_SEU_REPOSITORIO>` e `<NOME_DA_PASTA_DO_SEU_PROJETO>` pelos valores corretos).

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

### Configuração do Supabase

1.  Crie um projeto no [Supabase](https://supabase.com/).
2.  Obtenha sua `URL` e sua `anon key`.
3.  Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```
    EXPO_PUBLIC_SUPABASE_URL=SUA_URL_DO_SUPABASE
    EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_DO_SUPABASE
    ```
4.  No Supabase, configure as tabelas necessárias (por exemplo, `orders` e `profiles`) e as políticas de segurança (RLS).

### Execução

Para iniciar o servidor de desenvolvimento do Expo:

```bash
npm start
# ou
expo start
```
