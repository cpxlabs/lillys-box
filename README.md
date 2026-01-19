# 🐾 Pet Care Game

Um jogo 2D infantil para Android usando React Native, onde crianças podem cuidar de animais domésticos (gatos ou cachorros).

## ✨ Funcionalidades
- 🐱🐶 Criar pets (gato ou cachorro)
- 📝 Escolher nome e gênero do pet
- 🎂 Sistema de idade (1 ano inicial, +1 por semana, máximo 19 anos)
- 🍖 Alimentar o pet
- 🛁 Dar banho no pet
- 🎾 Brincar com o pet
- 😴 Colocar o pet para dormir
- 🏥 Levar o pet ao veterinário
- 👕 Trocar roupas e acessórios (cabeça, olhos, torso, patas)
- 💾 Persistência local dos dados
- ⚠️ Confirmação ao sair para o menu (funciona em web, iOS e Android)
- 🗑️ Botão para apagar pet no menu com confirmação
- 💰 Sistema de moedas com anúncios opcionais para bônus
- 🌐 **Suporte a múltiplos idiomas (Inglês e Português do Brasil)**

## 🛠️ Stack Tecnológica
- React Native (Expo)
- React Navigation
- AsyncStorage
- react-native-reanimated
- react-native-gesture-handler
- react-native-svg
- react-native-google-mobile-ads
- i18next & react-i18next (internacionalização)

## 📂 Estrutura do Projeto

A estrutura de pastas e arquivos está documentada detalhadamente em [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md).

## 🚀 Como executar
1) Instale dependências:
```bash
npm install --legacy-peer-deps
```

**Nota sobre dependências**: O projeto usa `expo-dev-client` que é necessário para módulos nativos como `react-native-google-mobile-ads`. Este pacote permite construir uma versão de desenvolvimento personalizada do Expo que inclui módulos nativos.

2) Rode:
```bash
npx expo start
```

**Nota**: Para testar anúncios, você precisará usar um dispositivo físico ou emulador Android/iOS, pois os anúncios não funcionam em navegadores web.

## 🎨 Assets necessários
Coloque os PNGs em `assets/sprites/`:
- `cats/cat_base.png`
- `dogs/dog_base.png`
- `clothes/hat_red.png`
- `clothes/eyes_big.png`
- `clothes/shirt_blue.png`
- `clothes/paws_boots.png`
- (e demais roupas opcionais)

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

## Checklist
- [x] Criar pet
- [x] Renderizar pet com camadas
- [x] Alimentar (animação + lógica)
- [x] Dar banho (gesto ou botão)
- [x] Armário de roupas
- [x] Persistência local
- [x] Sistema de monetização com AdMob
- [x] Suporte a múltiplos idiomas (i18n)
- [ ] Sons e efeitos visuais
- [ ] Otimizações de performance

## Documentação Adicional
Consulte a pasta `docs/` para mais detalhes:
- `docs/ROADMAP.md`: Planos futuros e melhorias
- `docs/RESPONSIVE.md`: Guia de responsividade
- `docs/IMPLEMENTATION_PLAN.md`: Plano de implementação detalhado
