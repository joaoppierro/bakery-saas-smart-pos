# 🥐 Bakery SaaS: Smart POS, Inventory & Pricing Engine

🇧🇷 **Sistema de Ponto de Venda (PDV) e Gestão de Produção** focado no setor de panificação, construído com arquitetura multi-tenant. Além do controle de estoque em tempo real, a plataforma conta com um motor de precificação inteligente e um algoritmo para cálculo preditivo de demanda.

🇺🇸 **Point of Sale (POS) and Production Management System** focused on the bakery sector, built with a multi-tenant architecture. In addition to real-time inventory control, the platform features a smart pricing engine and a predictive demand calculation algorithm.

---

### 💻 Stack Tecnológica / Tech Stack

**Front-end:**
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Back-end & Dados:**
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

---

### 📸 Demonstração / Screenshots

#### 1. Interface do PDV (Caixa) / POS Interface
> 🇧🇷 Tela principal de vendas com busca rápida e fechamento de fluxo de caixa.
> 🇺🇸 Main sales screen with quick search and cash flow checkout.
![Arraste a imagem do PDV aqui...]

#### 2. Motor de Precificação Inteligente / Smart Pricing Engine
> 🇧🇷 Dashboard de definição de preços baseada no custo de insumos e metas de lucro.
> 🇺🇸 Pricing dashboard based on raw material costs and profit margin goals.
![Arraste a imagem da Precificação aqui...]

#### 3. Previsão de Demanda e Estoque / Demand & Inventory Forecast
> 🇧🇷 Gestão de estoque com indicadores baseados no volume de produção diária.
> 🇺🇸 Inventory management with indicators based on daily production volume.
![Arraste a imagem do Estoque/Demanda aqui...]

---

### 🚀 Principais Funcionalidades / Key Features

🇧🇷
* **Precificação Inteligente:** Motor de cálculo automático de preços de venda considerando custos de ingredientes, despesas de produção e margens de lucro desejadas.
* **Cálculo de Demanda Preditiva:** Lógica para estimar a quantidade necessária de produção diária com base no histórico de saídas, reduzindo o desperdício de insumos.
* **Arquitetura Multi-tenant:** Isolamento de dados por inquilino (padaria/franquia), permitindo o uso da mesma infraestrutura de forma segura.
* **PDV e Estoque Integrado:** Baixa automática de insumos e produtos acabados em tempo real a cada transação no caixa.

🇺🇸
* **Smart Pricing Engine:** Automatic calculation of retail prices considering ingredient costs, production overhead, and target profit margins.
* **Predictive Demand Calculation:** Logic to estimate required daily production volume based on historical sales data, minimizing food waste.
* **Multi-tenant Architecture:** Data isolation per tenant (bakery/franchise), ensuring secure use of the shared infrastructure.
* **Integrated POS & Inventory:** Real-time deduction of raw materials and finished goods with every checkout transaction.

---

### ⚙️ Desafios Técnicos Superados / Technical Challenges Solved

🇧🇷 O principal desafio deste projeto foi construir o algoritmo de **Precificação e Demanda** sem comprometer a performance do Front-end. Foi necessário criar lógicas matemáticas robustas para calcular variáveis dinâmicas e refleti-las no preço final em tempo real. Além disso, a arquitetura **multi-tenant** exigiu um controle rigoroso no banco de dados para garantir que as receitas e métricas financeiras de cada cliente ficassem estritamente isoladas.

🇺🇸 The main challenge of this project was building the **Pricing and Demand** algorithm without compromising Front-end performance. Robust mathematical logic was required to calculate dynamic variables and reflect them in the final retail price in real-time. Additionally, the **multi-tenant** architecture demanded strict database control to ensure that each client's recipes and financial metrics were securely isolated.

---

📫 **Vamos conversar / Let's connect:** [LinkedIn](SEU_LINK_DO_LINKEDIN_AQUI) | joaoppierro@gmail.com