# 🐾 Pet Care Game - Documentation

Um jogo 2D infantil para Android usando React Native, onde crianças podem cuidar de animais domésticos (gatos ou cachorros).

## ✨ Funcionalidades
- 🐱🐶 Criar pets (gato ou cachorro)
- 📝 Escolher nome e gênero do pet
- 🎂 Sistema de idade (1 ano inicial, +1 por semana, máximo 19 anos)
- 🍖 Alimentar o pet
- 🛁 Dar banho no pet (Minigame interativo com bolhas!)
- 🎾 Brincar com o pet
- 😴 Colocar o pet para dormir
- 🏥 Levar o pet ao veterinário
- 👕 Trocar roupas e acessórios (cabeça, olhos, torso, patas)
- 💾 Persistência local dos dados
- ⚠️ Confirmação ao sair para o menu (funciona em web, iOS e Android)
- 🗑️ Botão para apagar pet no menu com confirmação
- 💰 Sistema de moedas com anúncios opcionais para bônus
- 🌐 **Suporte a múltiplos idiomas (Inglês e Português do Brasil)**
- 🎮 **30+ mini-games** (Color Tap, Memory Match, Simon Says, Pet Runner, Whack-A-Mole, Sliding Puzzle, e muito mais)
- 🔐 **Autenticação Google OAuth + modo convidado** com isolamento de dados por usuário
- 🌍 **Deploy web via Vercel** (Expo web export)

## 🛠️ Stack Tecnológica
- React Native 0.73.2 (Expo 50)
- TypeScript 5.1.3
- Expo Router 3.4.10 (file-based navigation)
- AsyncStorage (persistência local)
- react-native-reanimated 3.6.1 (animações e efeitos visuais)
- react-native-gesture-handler
- react-native-svg / @shopify/react-native-skia (gráficos)
- @react-native-google-signin/google-signin (autenticação)
- react-native-google-mobile-ads (AdMob)
- socket.io-client 4.8.0 (multiplayer)
- i18next & react-i18next (internacionalização EN + PT-BR)
- Jest 30 & React Native Testing Library (testes)
- ESLint & Prettier (qualidade de código)
- Vercel (deploy web)

## 📂 Estrutura do Projeto

A estrutura de pastas e arquivos está documentada detalhadamente em [FOLDER_STRUCTURE.md](../FOLDER_STRUCTURE.md).

## 🚀 Como executar
1) Instale dependências:
```bash
npm install --legacy-peer-deps
```

> O projeto usa `packageManager: pnpm@10.30.2` localmente, mas o Vercel e ambientes CI usam `npm install --legacy-peer-deps` para evitar incompatibilidades de versão do pnpm com Node 20+.

> **Nota sobre dependências**: O projeto usa `expo-dev-client` que é necessário para módulos nativos como `react-native-google-mobile-ads`. Este pacote permite construir uma versão de desenvolvimento personalizada do Expo que inclui módulos nativos.

2) Rode:
```bash
npx expo start
```

3) Para o build web (deploy Vercel):
```bash
EXPO_PUBLIC_BUILD_PLATFORM=web npx expo export --platform web
```

**Nota**: Para testar anúncios, você precisará usar um dispositivo físico ou emulador Android/iOS.

## 🎨 Assets necessários
Coloque os PNGs/SVGs em `assets/sprites/`:
- `cats/cat_base.png`
- `dogs/dog_base.png`
- `clothes/`
- `food/`
- `toys/`

## 💰 Monetização

Este aplicativo usa Google AdMob para monetização com as seguintes funcionalidades:

### Tipos de Anúncios
- **Anúncios em Banner**: Exibidos na parte inferior da tela inicial
- **Anúncios de Vídeo com Recompensa**: Anúncios opcionais que dão moedas de bônus
- **Anúncios Intersticiais**: Anúncios de tela cheia mostrados entre atividades (frequência limitada)

### Segurança Infantil (Conformidade COPPA)
- Todos os anúncios são marcados como direcionados a crianças
- Apenas conteúdo classificado como G (Geral) é exibido
- Sem anúncios personalizados ou coleta de dados
- Os anúncios são opcionais e claramente marcados

### Configuração
As configurações de anúncios podem ser definidas em `src/config/ads.config.ts`:
- Ativar/desativar anúncios
- Alternar modo de teste
- IDs de unidades de anúncios
- Controles de frequência
- Valores de recompensa

### Configuração do AdMob
1. Crie uma conta no AdMob em https://admob.google.com
2. Crie unidades de anúncios para seu aplicativo
3. Substitua os IDs de unidades de anúncios de teste em `src/config/ads.config.ts` pelos seus IDs de produção
4. Defina `testMode: false` em produção
5. Certifique-se de que as configurações de conformidade COPPA estejam ativadas

**IDs de Teste do AdMob (atualmente em uso)**:
```typescript
// Anúncios com recompensa
android: 'ca-app-pub-3940256099942544/5224354917'
ios: 'ca-app-pub-3940256099942544/1712485313'

// Anúncios intersticiais
android: 'ca-app-pub-3940256099942544/1033173712'
ios: 'ca-app-pub-3940256099942544/4411468910'

// Anúncios em banner
android: 'ca-app-pub-3940256099942544/6300978111'
ios: 'ca-app-pub-3940256099942544/2934735716'
```

**⚠️ IMPORTANTE**: Estes são IDs de teste. Para produção, você DEVE substituí-los pelos seus próprios IDs de unidades de anúncios do AdMob.

### Funcionalidades dos Anúncios
- Assista anúncios de vídeo na tela inicial para ganhar +50 moedas
- Após completar atividades (alimentar, banho, brincar), opção de assistir anúncio para dobrar as moedas ganhas
- Anúncios intersticiais aparecem a cada 4 transições de tela (com mínimo de 5 minutos entre eles)
- Todos os anúncios são opcionais - nunca bloqueiam funcionalidades do jogo

## 🌐 Internacionalização (i18n)

Este aplicativo suporta múltiplos idiomas usando i18next e react-i18next.

### Idiomas Suportados
- 🇺🇸 **Inglês (English)** - `en`
- 🇧🇷 **Português do Brasil (Portuguese Brazil)** - `pt-BR`

### Funcionalidades de i18n
- **Detecção Automática**: O aplicativo detecta automaticamente o idioma do dispositivo ao iniciar
- **Seletor de Idioma**: Os usuários podem alternar entre idiomas na tela do menu principal
- **Persistência**: A preferência de idioma é salva localmente e mantida entre sessões
- **Fallback**: Se uma tradução não estiver disponível, o aplicativo usa inglês como fallback
- **Interpolação**: Suporte para strings dinâmicas (nomes de pets, números, etc.)

### Arquivos de Tradução
As traduções estão localizadas em:
- `src/locales/en.json` - Traduções em inglês
- `src/locales/pt-BR.json` - Traduções em português

### Como Adicionar um Novo Idioma
1. Crie um novo arquivo JSON em `src/locales/` (ex: `src/locales/es.json`)
2. Copie a estrutura de `en.json` e traduza todas as strings
3. Adicione o novo idioma em `src/i18n.ts`:
```typescript
resources: {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
  'es': { translation: es }, // Novo idioma
}
```
4. Atualize o `LanguageSelector.tsx` para incluir o botão do novo idioma
5. Adicione lógica de normalização no `getDeviceLanguage()` se necessário

### Estrutura das Traduções
```json
{
  "common": { /* Strings comuns como "back", "confirm", "cancel" */ },
  "menu": { /* Strings da tela do menu */ },
  "createPet": { /* Strings da criação de pet */ },
  "home": { /* Strings da tela principal */ },
  "feed": { /* Strings da alimentação */ },
  "bath": { /* Strings do banho */ },
  "play": { /* Strings da brincadeira */ },
  "sleep": { /* Strings do sono */ },
  "vet": { /* Strings do veterinário */ },
  "wardrobe": { /* Strings do armário */ },
  "background": { /* Strings do cenário */ },
  "rewards": { /* Strings de recompensas */ },
  "ads": { /* Strings de anúncios */ }
}
```

### Uso no Código
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  // String simples
  return <Text>{t('common.back')}</Text>;
  
  // String com interpolação
  return <Text>{t('home.money', { amount: 100 })}</Text>;
  // Resultado: "💰 100 moedas" (pt-BR) ou "💰 100 coins" (en)
};
```

## 🧪 Testes

O projeto possui uma suíte de testes automatizados usando **Jest** e **React Native Testing Library**.

### Executando Testes
```bash
npm test                 # Executa todos os testes
npm run test:watch       # Executa em modo watch
npm run test:coverage    # Gera relatório de cobertura
npm run test:ci          # Executa testes em modo CI
```

### Cobertura de Testes
✅ **Status**: 508+ testes, 502+ passando (99%+)

Áreas cobertas:
- **Hooks**: `usePetActions` (29/30 testes - ações do pet e animações)
- **Utils**: `petStats`, `validation`, `storage`
- **Context**: `PetContext`, todos os 29 contextos de mini-games
- **Componentes**: `IconButton`, `StatusBar`, `ErrorBoundary`
- **Telas**: `GameSelectionScreen` (7 testes - persistência de uiIndex)

## Checklist
- [x] Criar pet
- [x] Renderizar pet com camadas
- [x] Alimentar (animação + lógica)
- [x] Dar banho (gesto ou botão)
- [x] Armário de roupas
- [x] Persistência local
- [x] Sistema de monetização com AdMob
- [x] Suporte a múltiplos idiomas (i18n)
- [x] **Suíte de testes automatizados (CI-Ready)**
- [x] **30+ mini-games implementados**
- [x] **Autenticação Google OAuth + modo convidado**
- [x] **Deploy web via Vercel**
- [x] **Sistema de reviews de jogos** (modal com comentários, estrelas, mídia e reactions)
- [x] **Otimizações de performance** (lazy loading de reviews, FlatList virtualizado)
- [ ] Sons e efeitos visuais

## 📐 Arquitetura e Código

### usePetActions Hook
O projeto utiliza um hook centralizado (`usePetActions`) que unifica a lógica de ações do pet:
- Gerenciamento de estados de animação
- Validação de ações
- Notificações via toast
- Sistema de recompensas
- Limpeza automática de timeouts

Este hook reduziu em ~90% a duplicação de código nas cenas de ação.

### Qualidade de Código
- ✅ TypeScript strict mode
- ✅ ESLint configurado
- ✅ Prettier para formatação
- ✅ Testes automatizados (99% passing)
- ✅ Hooks customizados reutilizáveis
- ✅ Configuração centralizada (gameBalance, constants, actionConfig)

---

# 📚 Documentation Index

This directory contains all project documentation organized by purpose.

## 📚 Feature Documentation

**Permanent reference documentation** for understanding how systems work and architectural decisions.

- **[FEED_ACTIONS_DOCUMENTATION.md](./FEED_ACTIONS_DOCUMENTATION.md)** - Feed system documentation including migration to usePetActions hook
- **[PLAY_ACTIONS_DOCUMENTATION.md](./PLAY_ACTIONS_DOCUMENTATION.md)** - Play system documentation including migration to usePetActions hook
- **[VET_ACTIONS_DOCUMENTATION.md](./VET_ACTIONS_DOCUMENTATION.md)** - Vet system documentation and why it wasn't migrated to usePetActions

## 🔧 System Documentation

- **[RESPONSIVE.md](./RESPONSIVE.md)** - Responsive design system guide and usage patterns
- **[ROADMAP.md](./ROADMAP.md)** - Project roadmap with future features and milestones
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Authentication and storage API documentation
- **[AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)** - Google OAuth setup, user types, navigation flow
- **[CODE_REVIEW_2026_02_28.md](./CODE_REVIEW_2026_02_28.md)** - Code review with 39 issues and resolution status

---

## 📋 Plans (docs/plans/)

**Implementation plans and temporary planning documents** for features being developed or considered.

### Active Plans
- **[IMPLEMENTATION_PLAN.md](./plans/IMPLEMENTATION_PLAN.md)** - Comprehensive implementation plan covering testing infrastructure, game features, and code quality (Status: Mostly completed)
- **[SKIA_BATH_REIMPLEMENTATION_PLAN.md](./plans/SKIA_BATH_REIMPLEMENTATION_PLAN.md)** - Plan to reintegrate Skia 2.4.14 for bath screen bubbles, includes historical context from v0.1.221 (Status: Planning complete)

### Completed/Archived Plans
- **[OAUTH_PLAN.md](./plans/OAUTH_PLAN.md)** - Google OAuth implementation plan (Status: ✅ COMPLETED Jan 2026)
- **[REVIEW_SYSTEM_PLAN.md](./plans/REVIEW_SYSTEM_PLAN.md)** - Game review system plan (Status: ✅ COMPLETED Feb 2026)
- **[CODE_REVIEW_REFACTORING.md](./plans/CODE_REVIEW_REFACTORING.md)** - Code review and refactoring summary (Status: Phase 1 complete, Phase 2 partially complete)

### Asset Plans
- **[SPRITES_NEEDED.md](./plans/SPRITES_NEEDED.md)** - List of sprites needed for clothing, food, and play items

---

## 🗂️ Organization Guide

### When to add a document to `docs/`:
- ✅ Feature documentation explaining how something works
- ✅ Architectural decision records (why we built it this way)
- ✅ User guides and API references
- ✅ Permanent system documentation

### When to add a document to `docs/plans/`:
- ✅ Implementation plans for upcoming features
- ✅ Refactoring plans with checklists
- ✅ Technical specifications for planned work
- ✅ Temporary planning documents

### When to delete a plan:
- ✅ When the work is 100% complete and documented elsewhere
- ✅ When the plan is abandoned or superseded
- ⚠️ Keep deprecated plans with status markers for historical reference

---

## 📝 Document Status Legend

- ✅ **Complete** - Implementation finished
- 🔄 **In Progress** - Currently being worked on
- 📋 **Planning** - Plan created, implementation not started
- ⏸️ **Deferred** - Intentionally postponed or not pursued
- ⚠️ **Deprecated** - No longer relevant, kept for historical reference

---

**Versão**: 1.2.2
**Última Atualização**: 2026-03-02
**Status**: ✅ Funcional e testado — deploy web ativo no Vercel, review system implementado, Sprint 1-2 code review fixes aplicados, sistema de áudio com background music
