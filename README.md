# 🐾 Pet Care Game

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
- 🔐 **Autenticação com Google OAuth** (novo!)
- 👤 Modo convidado para jogar sem criar conta
- 📱 Dados isolados por usuário (múltiplos usuários no mesmo dispositivo)
- ⚠️ Confirmação ao sair para o menu (funciona em web, iOS e Android)
- 🗑️ Botão para apagar pet no menu com confirmação
- 💰 Sistema de moedas com anúncios opcionais para bônus
- 🌐 **Suporte a múltiplos idiomas (Inglês e Português do Brasil)**
- 🎮 **Plataforma multi-jogo** com Game Registry e tela de seleção de jogos
- 🔢 **Muito** — jogo de contagem para crianças (segundo jogo da plataforma)

## 🚀 Quick Start (Início Rápido)

```bash
# Instalar dependências
pnpm install

# Executar
npx expo start
```

## 📚 Documentação Completa

Para informações detalhadas sobre o projeto, veja **[docs/README.md](./docs/README.md)**:

- **Setup e Configuração** - Como rodar, monetização, i18n
- **Documentação de Features** - Feed, Play, Vet systems
- **System Docs** - Responsive design, Roadmap
- **Plans** - Implementation plans e planos futuros

## 🛠️ Stack Tecnológica
- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage
- @react-native-google-signin/google-signin (autenticação OAuth)
- react-native-reanimated (animações e efeitos visuais)
- react-native-gesture-handler
- react-native-svg
- react-native-google-mobile-ads
- i18next & react-i18next (internacionalização)
- Jest & React Native Testing Library (testes)
- ESLint & Prettier (qualidade de código)

## 📂 Projeto
```
src/
├── components/    # Componentes reutilizáveis
├── screens/       # Telas do app
├── context/       # Context API
├── hooks/         # Hooks customizados
├── config/        # Configurações
└── types/         # TypeScript types
```

**⚠️ IMPORTANTE**: Estes são IDs de teste. Para produção, você DEVE substituí-los pelos seus próprios IDs de unidades de anúncios do AdMob.

### Funcionalidades dos Anúncios
- Assista anúncios de vídeo na tela inicial para ganhar +50 moedas
- Após completar atividades (alimentar, banho, brincar), opção de assistir anúncio para dobrar as moedas ganhas
- Anúncios intersticiais aparecem a cada 4 transições de tela (com mínimo de 5 minutos entre eles)
- Todos os anúncios são opcionais - nunca bloqueiam funcionalidades do jogo

## 🔐 Autenticação com Google OAuth

Este aplicativo integra autenticação com Google, permitindo que os usuários façam login seguro com suas contas do Google ou joguem como convidado.

### Funcionalidades de Autenticação
- **Login com Google**: Usuários podem fazer login com suas contas do Google
- **Modo Convidado**: Jogar sem criar conta, dados armazenados localmente
- **Multi-usuário**: Múltiplos usuários podem jogar no mesmo dispositivo com dados isolados
- **Persistência**: O estado de autenticação é mantido entre sessões do aplicativo
- **Sincronização de Dados**: Cada usuário tem seus próprios dados de pet isolados

### Configuração do Google OAuth
Para usar a autenticação com Google, você precisa:

1. Configurar um projeto no Google Cloud Console
2. Criar credenciais OAuth 2.0 para Android e iOS
3. Fazer download dos arquivos de configuração (`google-services.json` e `GoogleService-Info.plist`)
4. Colocar os arquivos na raiz do projeto (mesmo nível que `app.config.js`)

**Para instruções detalhadas, veja [GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md)**

### Fluxo de Autenticação
1. **Tela de Login**: Usuários veem duas opções na inicialização:
   - Entrar com Google (requer conta do Google)
   - Jogar como Convidado (sem conta necessária)

2. **Após Login**:
   - Usuários são levados à tela de Menu
   - Dados de usuário são exibidos no topo da tela
   - Opção de "Sign Out" disponível para usuários autenticados

3. **Isolamento de Dados**:
   - Cada usuário tem seu próprio armazenamento de dados
   - Trocar de usuário mostra dados diferentes
   - Dados de convidado são preservados como "guest"

### Estrutura de Autenticação
- **AuthContext** (`src/context/AuthContext.tsx`): Gerencia estado de autenticação global
- **LoginScreen** (`src/screens/LoginScreen.tsx`): Interface de login
- **Auth Storage** (`src/utils/authStorage.ts`): Persistência de estado de autenticação
- **Multi-user Storage**: Storage de pet é namespaced por userId

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
  "ads": { /* Strings de anúncios */ },
  "selectGame": { /* Strings da tela de seleção de jogos */ },
  "muito": { /* Strings do jogo Muito (contagem) */ }
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
✅ **Status**: 99% dos testes passando (71/72 testes)

Áreas cobertas:
- **Hooks**: `usePetActions` (29/30 testes - ações do pet e animações)
- **Utils**: `petStats`, `validation`, `storage`
- **Context**: `PetContext`
- **Componentes**: `IconButton`, `StatusBar`

Para detalhes sobre a implementação e correção dos testes, consulte [docs/TEST_IMPLEMENTATION_PLAN.md](docs/TEST_IMPLEMENTATION_PLAN.md).

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
- [x] **Plataforma multi-jogo** (Game Registry, seletor, GameContainer)
- [x] **Muito** — segundo jogo (contagem de objetos com níveis progressivos)
- [ ] Sons e efeitos visuais
- [ ] Otimizações de performance

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

### 🚀 BMAD Method (Metodologia de Desenvolvimento)
Este projeto está preparado para usar o **BMAD Method** (Breakthrough Method for Agile AI Driven Development) - uma metodologia orientada por IA que melhora planejamento, implementação e garantia de qualidade.

**Benefícios principais:**
- 📋 Planejamento estruturado com agentes especializados (PM, Arquiteto, DEV, TEA)
- 🧪 Desenvolvimento orientado a testes (TDD) com estratégia definida antes da codificação
- 📐 Revisão de arquitetura para features complexas
- 📊 Rastreamento de épicos e histórias com estimativas
- 📚 Documentação gerada automaticamente como parte do fluxo

**Como começar:**
```bash
# Instalar BMAD CLI
npm install -g @bmad/cli

# Inicializar no projeto
bmad init --type brownfield

# Começar uma feature simples (Quick Flow)
bmad dev-story --quick-flow --title "Minha primeira feature BMAD"
```

**Documentação completa:**
- Para guia de início rápido: [docs/BMAD_QUICKSTART.md](docs/BMAD_QUICKSTART.md)
- Para plano completo de implementação: [docs/BMAD_IMPLEMENTATION_PLAN.md](docs/BMAD_IMPLEMENTATION_PLAN.md)

## Documentação Adicional
Consulte a pasta `docs/` para mais detalhes:
- `docs/ROADMAP.md`: Planos futuros e melhorias
- `docs/RESPONSIVE.md`: Guia de responsividade
- `docs/IMPLEMENTATION_PLAN.md`: Plano de implementação detalhado
- `docs/TEST_IMPLEMENTATION_PLAN.md`: Detalhes técnicos e correção da suíte de testes
- `docs/SKIA_BATH_REIMPLEMENTATION_PLAN.md`: Plano de reimplementação Skia para tela de banho
- `docs/BMAD_IMPLEMENTATION_PLAN.md`: Plano completo de implementação do BMAD Method
- `docs/BMAD_QUICKSTART.md`: Guia rápido para começar com BMAD
- `docs/FEED_ACTIONS_DOCUMENTATION.md`: Sistema de alimentação
- `docs/PLAY_ACTIONS_DOCUMENTATION.md`: Sistema de brincadeiras
- `docs/VET_ACTIONS_DOCUMENTATION.md`: Sistema veterinário
- `docs/FOLDER_STRUCTURE.md`: Estrutura completa de pastas e arquivos

---

**Versão**: 1.0.0  
**Status**: ✅ Funcional e testado  
**Documentação**: [docs/README.md](./docs/README.md)
