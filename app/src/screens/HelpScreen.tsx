import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../components/ScreenHeader';
import { useBackButton } from '../hooks/useBackButton';
import { ScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: ScreenNavigationProp<'Help'>;
};

type FaqKey =
  | 'howToCreate'
  | 'petDies'
  | 'statsDecrease'
  | 'howToFeed'
  | 'howToBathe'
  | 'vetVisit'
  | 'earnCoins'
  | 'miniGames'
  | 'bestScore'
  | 'doubleReward'
  | 'language'
  | 'dataLoss';

const FAQ_KEYS: FaqKey[] = [
  'howToCreate',
  'petDies',
  'statsDecrease',
  'howToFeed',
  'howToBathe',
  'vetVisit',
  'earnCoins',
  'miniGames',
  'bestScore',
  'doubleReward',
  'language',
  'dataLoss',
];

const TIPS_KEYS = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5'] as const;

const GITHUB_URL = 'https://github.com/cpxlabs/lillys-box/issues';

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      accessibilityLabel={question}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Text style={styles.faqChevron}>{isOpen ? '▲' : '▼'}</Text>
      </View>
      {isOpen && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

export const HelpScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const BackButtonIcon = useBackButton();
  const [openFaq, setOpenFaq] = useState<FaqKey | null>(null);

  const handleToggleFaq = (key: FaqKey) => {
    setOpenFaq((prev) => (prev === key ? null : key));
  };

  const handleOpenGithub = () => {
    Linking.openURL(GITHUB_URL).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('help.title')}
        onBackPress={() => navigation.goBack()}
        BackButtonIcon={BackButtonIcon}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>{t('help.sections.gettingStarted')}</Text>
        {FAQ_KEYS.slice(0, 3).map((key) => (
          <FaqItem
            key={key}
            question={t(`help.faq.${key}.question`)}
            answer={t(`help.faq.${key}.answer`)}
            isOpen={openFaq === key}
            onToggle={() => handleToggleFaq(key)}
          />
        ))}

        <Text style={styles.sectionTitle}>{t('help.sections.petCare')}</Text>
        {FAQ_KEYS.slice(3, 6).map((key) => (
          <FaqItem
            key={key}
            question={t(`help.faq.${key}.question`)}
            answer={t(`help.faq.${key}.answer`)}
            isOpen={openFaq === key}
            onToggle={() => handleToggleFaq(key)}
          />
        ))}

        <Text style={styles.sectionTitle}>{t('help.sections.games')}</Text>
        {FAQ_KEYS.slice(6, 9).map((key) => (
          <FaqItem
            key={key}
            question={t(`help.faq.${key}.question`)}
            answer={t(`help.faq.${key}.answer`)}
            isOpen={openFaq === key}
            onToggle={() => handleToggleFaq(key)}
          />
        ))}

        <Text style={styles.sectionTitle}>{t('help.sections.coins')}</Text>
        {FAQ_KEYS.slice(9, 10).map((key) => (
          <FaqItem
            key={key}
            question={t(`help.faq.${key}.question`)}
            answer={t(`help.faq.${key}.answer`)}
            isOpen={openFaq === key}
            onToggle={() => handleToggleFaq(key)}
          />
        ))}

        <Text style={styles.sectionTitle}>{t('help.sections.tips')}</Text>
        {FAQ_KEYS.slice(10).map((key) => (
          <FaqItem
            key={key}
            question={t(`help.faq.${key}.question`)}
            answer={t(`help.faq.${key}.answer`)}
            isOpen={openFaq === key}
            onToggle={() => handleToggleFaq(key)}
          />
        ))}

        {/* Tips Section */}
        <Text style={styles.sectionTitle}>{t('help.tips.title')}</Text>
        <View style={styles.tipsContainer}>
          {TIPS_KEYS.map((tipKey, index) => (
            <View key={tipKey} style={styles.tipRow}>
              <Text style={styles.tipBullet}>{index + 1}.</Text>
              <Text style={styles.tipText}>{t(`help.tips.${tipKey}`)}</Text>
            </View>
          ))}
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>{t('help.support.title')}</Text>
        <View style={styles.supportCard}>
          <Text style={styles.supportMessage}>{t('help.support.message')}</Text>
          <TouchableOpacity
            style={styles.githubButton}
            onPress={handleOpenGithub}
            accessibilityRole="link"
            accessibilityLabel={t('help.support.github')}
          >
            <Text style={styles.githubButtonText}>{t('help.support.github')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9b59b6',
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 8,
  },
  faqChevron: {
    fontSize: 12,
    color: '#9b59b6',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipBullet: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9b59b6',
    width: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },
  supportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supportMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  githubButton: {
    backgroundColor: '#9b59b6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  githubButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 24,
  },
});
