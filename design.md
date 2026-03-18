# WellGymApp — Design Plan

## Color Palette

| Token | Light | Dark |
|-------|-------|------|
| background | #0D0D0D | #0D0D0D |
| surface | #1A1A1A | #1A1A1A |
| surface2 | #222222 | #222222 |
| primary (green) | #22C55E | #22C55E |
| foreground | #FFFFFF | #FFFFFF |
| muted | #9CA3AF | #9CA3AF |
| border | #2A2A2A | #2A2A2A |
| accent-blue | #3B82F6 | #3B82F6 |
| accent-purple | #A855F7 | #A855F7 |

## Screen List

1. **Home** — Tela principal com card do treino do dia, estatísticas circulares e motivação
2. **WorkoutDetail** — Detalhe do treino com lista de exercícios separados por seção (Aquecimento / Principal)
3. **Treino (Tab)** — Gerenciamento de treinos da semana
4. **Dieta (Tab)** — Plano alimentar com refeições do dia
5. **Progresso (Tab)** — Gráficos de evolução (peso, treinos, calorias)
6. **Meta (Tab)** — Ficha de metas pessoais (peso, treinos por semana, calorias)

## Tab Bar

Ícones: Treino (+), Dieta (garfo), Progresso (câmera), Meta (alvo)
Fundo: #1A1A1A com borda superior sutil
Ativo: verde (#22C55E)

## Key User Flows

- Home → "Começar Treino" → WorkoutDetail → "Iniciar Treino"
- Tab Treino → ver treinos da semana → editar exercícios
- Tab Dieta → ver refeições → marcar como consumido
- Tab Progresso → ver gráficos de evolução
- Tab Meta → definir metas pessoais

## Home Screen Layout

- Card hero: "TREINO DE HOJE" com imagem de fundo (academia), nome do treino, duração, calorias, botão "COMEÇAR TREINO"
- 3 círculos de progresso: Calorias (verde), Tempo (azul), Treinos (roxo)
- Card de motivação: "Você está melhor que 82%" com percentual semanal
- Bottom tab bar com 4 itens

## WorkoutDetail Layout

- Header com botão voltar, nome do treino, duração e calorias
- Seção "AQUECIMENTO" com exercícios (imagem, nome, duração/séries)
- Seção "EXERCÍCIOS PRINCIPAIS" com exercícios (imagem, nome, séries x reps)
- Botão fixo no fundo "INICIAR TREINO"
