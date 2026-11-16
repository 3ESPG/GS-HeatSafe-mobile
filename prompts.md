# Uso de IA nesta entrega (Mobile Development & IoT)

Regra da GS: *"IA como copiloto: registrar os prompts usados em prompts.md e saber explicar cada linha."*

| # | Ferramenta | Prompt (resumo) | O que aproveitamos | O que revisamos/decidimos nós |
|---|---|---|---|---|
| 1 | Claude (Claude Code) | Pedimos para analisar o PDF da GS e sugerir os melhores temas; depois, para detalhar a solução escolhida (calor extremo dentro de casa, para idosos). | Comparação dos temas com as exigências de cada disciplina e a proposta do HeatSafe. | Escolhemos o tema e o nome HeatSafe. Trocamos a primeira ideia (totem de rua) porque relógios de rua com temperatura já existem. |
| 2 | Claude (Claude Code) | Pedimos para criar o app em Expo + TypeScript seguindo o PDF da disciplina (mín. 3 telas, Expo Router, API ou mock com loading/erro/vazio, banco, tema centralizado, acessibilidade). | Estrutura do projeto, telas, componentes, camada de serviços (Open-Meteo + mock), camada de banco (SQLite) e tema. | Conferimos cada critério da rubrica, os textos em linguagem simples e o contraste das cores. Usamos dados fictícios em todo o app. |
| 3 | Claude (Claude Code) | Pedimos para rodar `tsc`, `expo lint` e `expo-doctor` e corrigir o que aparecesse. | Correções das regras novas do React (sem `setState` dentro de `useEffect` e sem ler `ref` durante a renderização) e instalação do `expo-font`. | Testamos o app no Expo Go, nos três modos e nos três cenários da simulação. |
| 4 | Claude (Claude Code) | Pedimos o README com a Ficha da CitizenTech e as instruções. | Texto do README, tabela de telas e explicação do banco. | Preenchemos os integrantes, os prints e o link do vídeo. |

## Como explicar as partes principais

- **Navegação (Expo Router):** cada arquivo em `src/app/` é uma tela. `(tabs)/_layout.tsx` monta as abas; `alerta/[id].tsx` é o detalhe, que recebe o `id` pela rota. A aba Visitas usa `href: null` para ficar escondida fora do modo agente.
- **Consumo de dados:** `services/climaService.ts` chama a API pública Open-Meteo com `fetch` e tempo limite (`services/http.ts`). `services/heatsafeApi.ts` simula o backend com atraso de 700 ms e falha opcional, para mostrar os estados de erro.
- **Estados de carregando, erro e vazio:** o hook `useRequisicao` guarda o resultado com a "chave" da busca. Enquanto a chave atual não tem resultado, está carregando. O componente `EstadoView` desenha os três estados.
- **Banco (SQLite):** `database/migrations.ts` cria as tabelas e usa `PRAGMA user_version` para saber a versão. Os repositórios (`perfilRepository`, `registrosRepository`) são os únicos que escrevem SQL, sempre com parâmetros `?` (nunca concatenando texto).
- **Perfil global:** `PerfilContext` lê o perfil do banco uma vez e o entrega a todas as telas. Ao salvar, também reconfigura o mock (cenário e falha simulada).
- **Índice de calor:** `services/indiceCalor.ts` usa a fórmula da NOAA (Rothfusz), a mesma do ESP32 e do script do INMET.
- **Tema e acessibilidade:** cores, fontes e espaçamentos ficam só em `src/theme`. Todas as cores passam no contraste WCAG AA. O nível de risco aparece por cor, ícone e texto, e os componentes têm `accessibilityLabel`, `accessibilityRole` e `accessibilityState`.
