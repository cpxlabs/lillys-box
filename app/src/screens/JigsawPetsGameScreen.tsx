import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useJigsawPets } from '../context/JigsawPetsContext';
import { ScreenNavigationProp } from '../types/navigation';
import { useGameBack } from '../hooks/useGameBack';

type Props = { navigation: ScreenNavigationProp<'JigsawPetsGame'> };

const PETS = [
  { name: 'Cat', pieces: ['🐱','😺','😸','🐾','🐈','🐈‍⬛','😻','🙀','😹','😿','😾','🐩'] },
  { name: 'Dog', pieces: ['🐶','🐕','🦮','🐕‍🦺','🐩','🐾','🦴','🐾','🐕','😀','🎾','❤️'] },
];
const GRID = 3;
const TOTAL = GRID * GRID;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const JigsawPetsGameScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useJigsawPets();

  const [petIndex] = useState(() => Math.floor(Math.random() * PETS.length));
  const pet = PETS[petIndex];
  const originalPieces = pet.pieces.slice(0, TOTAL);
  const [scrambled] = useState(() => shuffle(originalPieces));
  const [board, setBoard] = useState<(string | null)[]>(Array(TOTAL).fill(null));
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(scrambled);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const selectFromBank = useCallback((piece: string, index: number) => {
    setSelectedPiece(piece);
    setSelectedPieceIndex(index);
  }, []);

  const placePiece = useCallback((boardIndex: number) => {
    if (!selectedPiece || board[boardIndex] !== null) return;
    const correct = originalPieces[boardIndex] === selectedPiece;
    const newBoard = [...board];
    newBoard[boardIndex] = selectedPiece;
    setBoard(newBoard);
    setMoves(m => m + 1);
    const pts = correct ? 20 : 5;
    setScore(s => {
      const ns = s + pts;
      const allFilled = newBoard.every(c => c !== null);
      if (allFilled) { updateBestScore(ns); setTimeout(() => setGameOver(true), 300); }
      return ns;
    });
    setRemaining(prev => { const r = [...prev]; r.splice(selectedPieceIndex!, 1); return r; });
    setSelectedPiece(null);
    setSelectedPieceIndex(null);
  }, [selectedPiece, board, originalPieces, selectedPieceIndex, updateBestScore]);

  const restart = () => { setBoard(Array(TOTAL).fill(null)); setRemaining(shuffle(originalPieces)); setSelectedPiece(null); setSelectedPieceIndex(null); setScore(0); setMoves(0); setGameOver(false); };
  const handleBack = useGameBack(navigation);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}><Text style={styles.backText}>← {t('common.back')}</Text></TouchableOpacity>
        <Text style={styles.title}>{t('jigsawPets.game.title')}: {pet.name}</Text>
        <Text style={styles.moves}>{moves} {t('jigsawPets.game.moves')}</Text>
      </View>

      <View style={styles.board}>
        {board.map((piece, i) => (
          <TouchableOpacity
            key={`cell-${i}-${piece ?? 'empty'}`}
            style={[styles.cell, piece ? styles.filledCell : null, piece === originalPieces[i] ? styles.correctCell : null]}
            onPress={() => placePiece(i)}
          >
            {piece ? <Text style={styles.piece}>{piece}</Text> : <Text style={styles.emptyCell}>{i + 1}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {selectedPiece && (
        <Text style={styles.selectedText}>{t('jigsawPets.game.placing')}: {selectedPiece} — {t('jigsawPets.game.tapCell')}</Text>
      )}

      <View style={styles.bank}>
        <Text style={styles.bankLabel}>{t('jigsawPets.game.pieces')} ({remaining.length}):</Text>
        <View style={styles.bankPieces}>
          {remaining.map((piece, i) => (
            <TouchableOpacity
              key={`piece-${piece}-${i}`}
              style={[styles.bankPiece, selectedPiece === piece && selectedPieceIndex === i && styles.selectedBankPiece]}
              onPress={() => selectFromBank(piece, i)}
            >
              <Text style={styles.bankPieceText}>{piece}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal visible={gameOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🖼️</Text>
            <Text style={styles.modalTitle}>{t('jigsawPets.game.complete')}</Text>
            <Text style={styles.modalScore}>{score} pts | {moves} {t('jigsawPets.game.moves')}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={restart}><Text style={styles.modalButtonText}>{t('jigsawPets.game.playAgain')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleBack}><Text style={styles.modalSecondaryText}>{t('common.back')}</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbe9e7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffab91' },
  backText: { fontSize: 16, color: '#bf360c', fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', color: '#bf360c' },
  moves: { fontSize: 14, color: '#5d4037' },
  board: { flexDirection: 'row', flexWrap: 'wrap', margin: 16, gap: 6, justifyContent: 'center' },
  cell: { width: '30%', aspectRatio: 1, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ff8a65', borderStyle: 'dashed' },
  filledCell: { backgroundColor: '#fff3e0', borderStyle: 'solid' },
  correctCell: { backgroundColor: '#e8f5e9', borderColor: '#4caf50' },
  piece: { fontSize: 36 },
  emptyCell: { fontSize: 18, color: '#ffccbc', fontWeight: '700' },
  selectedText: { textAlign: 'center', fontSize: 14, color: '#ff5722', paddingHorizontal: 16, marginBottom: 8 },
  bank: { padding: 16 },
  bankLabel: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 8 },
  bankPieces: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bankPiece: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ff8a65' },
  selectedBankPiece: { backgroundColor: '#ff8a65', borderColor: '#bf360c' },
  bankPieceText: { fontSize: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 64, marginBottom: 12 },
  modalTitle: { fontSize: 28, fontWeight: '800', color: '#333', marginBottom: 8 },
  modalScore: { fontSize: 18, color: '#ff5722', fontWeight: '700', marginBottom: 24 },
  modalButton: { backgroundColor: '#ff5722', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 24, marginBottom: 12, width: '100%', alignItems: 'center' },
  modalButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  modalSecondaryButton: { paddingVertical: 10 },
  modalSecondaryText: { fontSize: 16, color: '#888' },
});
