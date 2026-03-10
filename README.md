# 🐾 Lilly's Box

Uma plataforma de experiências interativas para famílias e crianças! Cuide de seus animais de estimação virtuais e desfrute de 30+ mini-games educativos e divertidos, tudo em um aplicativo multiplataforma com React Native.

## ✨ Core Experiences

### 🎮 **30+ Mini-Games** - O Coração da Plataforma
Desfrute de uma variedade diversa de experiências interativas, desde jogos educativos até desafios emocionantes:
- Jogos de reflexo (Whack-a-Mole, Color Tap, Catch the Ball)
- Jogos de memória e raciocínio (Memory Match, Sliding Puzzle, Simon Says)
- Jogos criativos (Color Mixer, Dress-Up Relay)
- E muito mais, tudo com sistema de pontuação e recompensas!

### 🐱🐶 **Cuidado do Pet Virtual** - Base da Personalização
- Criar e customizar pets (gato ou cachorro)
- Escolher nome e gênero do pet
- Sistema de idade dinâmico (1 ano inicial, +1 por semana, máximo 19 anos)
- Alimentar, dar banho, brincar e colocar para dormir
- Levar ao veterinário para manutenção da saúde
- Trocar roupas e acessórios (cabeça, olhos, torso, patas)

## ⭐ Funcionalidades Principais
- 💾 Persistência local dos dados
- 🔐 **Autenticação com Google OAuth**
- 👤 Modo convidado para jogar sem criar conta
- 📱 Dados isolados por usuário (múltiplos usuários no mesmo dispositivo)
- ⚠️ Confirmação ao sair para o menu (funciona em web, iOS e Android)
- 🗑️ Botão para apagar pet no menu com confirmação
- 💰 Sistema de moedas com anúncios opcionais para bônus
- 🌐 **Suporte a múltiplos idiomas (Inglês e Português do Brasil)**
- 🔊 **Sistema de áudio** — música de fundo, efeitos sonoros por atividade, modo silencioso
- ⭐ **Sistema de reviews** — avaliações de mini-games com estrelas, comentários, imagens e GIFs
- 🛡️ **Relatórios de erros** com Sentry (bordas de erro + source maps)
- ❓ **Tela de Ajuda/FAQ** com dicas e suporte

## �🚀 Quick Start (Início Rápido)

```bash
# Instalar dependências
pnpm install

# Executar
npx expo start
```

## 📚 Documentação Completa

Para informações detalhadas sobre o projeto, veja **[docs/README.md](./docs/README.md)**:

- **[BUILD.md](./docs/guides/BUILD.md)** - Building para web, Android, iOS
- **[AUTHENTICATION.md](./docs/technical/AUTHENTICATION.md)** - OAuth setup e sistema de autenticação
- **[ACTIONS.md](./docs/technical/ACTIONS.md)** - Sistema de ações do pet (feed, play, bathe)
- **[RESPONSIVE.md](./docs/guides/RESPONSIVE.md)** - Design responsivo
- **[FOLDER_STRUCTURE.md](./docs/guides/FOLDER_STRUCTURE.md)** - Estrutura do projeto
- **[API_REFERENCE.md](./docs/technical/API_REFERENCE.md)** - Documentação completa da API
- **[EMULATOR.md](./docs/technical/EMULATOR.md)** - Plano técnico para uma experiência de emulador GBA-like
- **[TESTING.md](./docs/testing/TESTING.md)** - E2E tests, game tests, unit tests

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

## � Autenticação com Google OAuth

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

**Para instruções detalhadas, veja [AUTHENTICATION.md](docs/technical/AUTHENTICATION.md)**

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
