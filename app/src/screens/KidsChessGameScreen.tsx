import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ArtifactGameAdapter } from '../components/ArtifactGameAdapter';
import { useKidsChess } from '../context/KidsChessContext';
import { useGameBack } from '../hooks/useGameBack';
import { useGameAdTrigger } from '../components/GameAdWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'KidsChessGame'>;

/**
 * Returns the chess game HTML artifact for a given difficulty.
 * The difficulty is injected as a constant so the AI uses the right depth.
 *
 * The artifact communicates with React Native via window.RNBridge:
 *   window.RNBridge.sendScore(score)   - report score updates
 *   window.RNBridge.gameOver(score)    - signal game over
 *   window.RNBridge.navigate('back')   - request navigation back
 */
function getArtifactHTML(difficulty: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Kids Chess</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
    window.DIFFICULTY = '${difficulty}';
    window.RNBridge = {
      send: function(msg) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(msg));
        } else if (window.parent !== window) {
          window.parent.postMessage(JSON.stringify(msg), '*');
        }
      },
      sendScore: function(score) { this.send({ type: 'scoreUpdate', payload: { score: score } }); },
      gameOver: function(finalScore) { this.send({ type: 'gameOver', payload: { finalScore: finalScore } }); },
      navigate: function(target) { this.send({ type: 'navigate', payload: { target: target || 'back' } }); }
    };
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; touch-action: manipulation; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #f0f4ff; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useCallback, useRef, useMemo } = React;

    // ─── Types ───────────────────────────────────────────────────────────────
    type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
    type Color = 'white' | 'black';
    interface Piece { type: PieceType; color: Color; hasMoved: boolean; }
    type Board = (Piece | null)[][];
    interface CastlingRights {
      wK: boolean; wQ: boolean; bK: boolean; bQ: boolean;
    }
    interface GameState {
      board: Board;
      turn: Color;
      enPassant: [number, number] | null;
      castling: CastlingRights;
    }
    interface HistoryEntry { state: GameState; capturedPiece: Piece | null; }

    // ─── Constants ───────────────────────────────────────────────────────────
    const PIECE_EMOJI: Record<PieceType, [string, string]> = {
      king:   ['👑', '🎩'],
      queen:  ['👸', '🧙'],
      rook:   ['🏰', '🗼'],
      bishop: ['⛪', '🕌'],
      knight: ['🐴', '🦄'],
      pawn:   ['🌾', '🌿'],
    };
    const PIECE_NAMES: Record<PieceType, string> = {
      king: 'King', queen: 'Queen', rook: 'Rook',
      bishop: 'Bishop', knight: 'Knight', pawn: 'Pawn',
    };
    const PIECE_VALUES: Record<PieceType, number> = {
      pawn: 100, knight: 320, bishop: 330, rook: 500, queen: 900, king: 20000,
    };
    const DIFF_CONFIG: Record<string, { depth: number; blunder: number; thinkMs: number; pet: string; petName: string; petLines: string[] }> = {
      puppy:  { depth: 1, blunder: 0.65, thinkMs: 600,  pet: '🐶', petName: 'Biscuit', petLines: ['Woof! Your turn!', 'Oops, I goofed! 🙈', 'Woof woof!', 'This is fun!'] },
      kitten: { depth: 1, blunder: 0.30, thinkMs: 900,  pet: '🐱', petName: 'Mochi',   petLines: ['Purrr...', 'Interesting move 😏', 'I see you!', 'Mrrrow...'] },
      bunny:  { depth: 2, blunder: 0.15, thinkMs: 1200, pet: '🐰', petName: 'Clover',  petLines: ['Great move! 🥕', 'Hmm, let me think...', "You're getting good!", 'Oh wow!'] },
      fox:    { depth: 3, blunder: 0.05, thinkMs: 1500, pet: '🦊', petName: 'Finn',    petLines: ['Ha! Try to catch me!', 'Oooh, clever! 🦊', 'Nice one!', 'Watch out!'] },
      owl:    { depth: 3, blunder: 0.00, thinkMs: 1800, pet: '🦉', petName: 'Luna',    petLines: ['Think carefully...🌙', 'Every move teaches.', 'Wise choice!', 'Hmm...'] },
    };
    const PAWN_TABLE_WHITE = [
      [ 0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [ 5,  5, 10, 25, 25, 10,  5,  5],
      [ 0,  0,  0, 20, 20,  0,  0,  0],
      [ 5, -5,-10,  0,  0,-10, -5,  5],
      [ 5, 10, 10,-20,-20, 10, 10,  5],
      [ 0,  0,  0,  0,  0,  0,  0,  0],
    ];
    const KNIGHT_TABLE = [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50],
    ];

    // ─── Chess Engine ─────────────────────────────────────────────────────────
    function inBounds(r: number, c: number): boolean { return r >= 0 && r < 8 && c >= 0 && c < 8; }

    function isAttacked(board: Board, r: number, c: number, byColor: Color): boolean {
      const opp = byColor;
      // Pawns
      const pr = opp === 'white' ? r + 1 : r - 1;
      for (const dc of [-1, 1]) {
        const pc = c + dc;
        if (inBounds(pr, pc) && board[pr][pc]?.color === opp && board[pr][pc]?.type === 'pawn') return true;
      }
      // Knights
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]] as [number,number][]) {
        const nr = r+dr, nc = c+dc;
        if (inBounds(nr, nc) && board[nr][nc]?.color === opp && board[nr][nc]?.type === 'knight') return true;
      }
      // Straight (rook/queen)
      for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]] as [number,number][]) {
        let nr = r+dr, nc = c+dc;
        while (inBounds(nr, nc)) {
          const p = board[nr][nc];
          if (p) { if (p.color === opp && (p.type === 'rook' || p.type === 'queen')) return true; break; }
          nr += dr; nc += dc;
        }
      }
      // Diagonal (bishop/queen)
      for (const [dr, dc] of [[1,1],[1,-1],[-1,1],[-1,-1]] as [number,number][]) {
        let nr = r+dr, nc = c+dc;
        while (inBounds(nr, nc)) {
          const p = board[nr][nc];
          if (p) { if (p.color === opp && (p.type === 'bishop' || p.type === 'queen')) return true; break; }
          nr += dr; nc += dc;
        }
      }
      // King
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as [number,number][]) {
        const nr = r+dr, nc = c+dc;
        if (inBounds(nr, nc) && board[nr][nc]?.color === opp && board[nr][nc]?.type === 'king') return true;
      }
      return false;
    }

    function findKing(board: Board, color: Color): [number, number] {
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
          if (board[r][c]?.type === 'king' && board[r][c]?.color === color) return [r, c];
      return [-1, -1];
    }

    function inCheck(board: Board, color: Color): boolean {
      const [kr, kc] = findKing(board, color);
      if (kr < 0) return false;
      const opp: Color = color === 'white' ? 'black' : 'white';
      return isAttacked(board, kr, kc, opp);
    }

    function pseudoMoves(board: Board, r: number, c: number, ep: [number,number] | null): [number,number][] {
      const piece = board[r][c];
      if (!piece) return [];
      const { type, color } = piece;
      const opp: Color = color === 'white' ? 'black' : 'white';
      const res: [number,number][] = [];

      if (type === 'pawn') {
        const dir = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        const r1 = r + dir;
        if (inBounds(r1, c) && !board[r1][c]) {
          res.push([r1, c]);
          const r2 = r + dir * 2;
          if (r === startRow && inBounds(r2, c) && !board[r2][c]) res.push([r2, c]);
        }
        for (const dc of [-1, 1]) {
          const nr = r + dir, nc = c + dc;
          if (inBounds(nr, nc)) {
            if (board[nr][nc]?.color === opp) res.push([nr, nc]);
            if (ep && ep[0] === nr && ep[1] === nc) res.push([nr, nc]);
          }
        }
      } else if (type === 'knight') {
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]] as [number,number][]) {
          const nr = r+dr, nc = c+dc;
          if (inBounds(nr, nc) && board[nr][nc]?.color !== color) res.push([nr, nc]);
        }
      } else if (type === 'king') {
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as [number,number][]) {
          const nr = r+dr, nc = c+dc;
          if (inBounds(nr, nc) && board[nr][nc]?.color !== color) res.push([nr, nc]);
        }
      } else {
        const dirs: [number,number][] =
          type === 'bishop' ? [[1,1],[1,-1],[-1,1],[-1,-1]] :
          type === 'rook'   ? [[0,1],[0,-1],[1,0],[-1,0]] :
                              [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
        for (const [dr, dc] of dirs) {
          let nr = r+dr, nc = c+dc;
          while (inBounds(nr, nc)) {
            if (board[nr][nc]) { if (board[nr][nc]!.color === opp) res.push([nr, nc]); break; }
            res.push([nr, nc]);
            nr += dr; nc += dc;
          }
        }
      }
      return res;
    }

    function applyMoveToBoard(board: Board, fr: number, fc: number, tr: number, tc: number, ep: [number,number] | null, promoteType?: PieceType): { board: Board; newEp: [number,number] | null } {
      const nb: Board = board.map(row => row.map(p => p ? { ...p } : null));
      const piece = nb[fr][fc]!;
      let newEp: [number,number] | null = null;

      // En passant capture
      if (piece.type === 'pawn' && ep && tr === ep[0] && tc === ep[1]) {
        nb[fr][tc] = null;
      }
      // Double pawn push sets en passant target
      if (piece.type === 'pawn' && Math.abs(tr - fr) === 2) {
        newEp = [(fr + tr) / 2, fc];
      }
      // Castling: move rook
      if (piece.type === 'king' && Math.abs(tc - fc) === 2) {
        const rookFc = tc > fc ? 7 : 0;
        const rookTc = tc > fc ? fc + 1 : fc - 1;
        nb[fr][rookTc] = { ...nb[fr][rookFc]!, hasMoved: true };
        nb[fr][rookFc] = null;
      }
      // Promotion
      const finalType = (piece.type === 'pawn' && (tr === 0 || tr === 7)) ? (promoteType || 'queen') : piece.type;
      nb[tr][tc] = { type: finalType, color: piece.color, hasMoved: true };
      nb[fr][fc] = null;
      return { board: nb, newEp };
    }

    function updateCastling(rights: CastlingRights, piece: Piece, fr: number, fc: number, tr: number, tc: number): CastlingRights {
      const r = { ...rights };
      if (piece.type === 'king') {
        if (piece.color === 'white') { r.wK = false; r.wQ = false; }
        else { r.bK = false; r.bQ = false; }
      }
      if (piece.type === 'rook') {
        if (fr === 7 && fc === 7) r.wK = false;
        if (fr === 7 && fc === 0) r.wQ = false;
        if (fr === 0 && fc === 7) r.bK = false;
        if (fr === 0 && fc === 0) r.bQ = false;
      }
      if (tr === 7 && tc === 7) r.wK = false;
      if (tr === 7 && tc === 0) r.wQ = false;
      if (tr === 0 && tc === 7) r.bK = false;
      if (tr === 0 && tc === 0) r.bQ = false;
      return r;
    }

    function legalMoves(board: Board, r: number, c: number, ep: [number,number] | null, castling: CastlingRights): [number,number][] {
      const piece = board[r][c];
      if (!piece) return [];
      const { color } = piece;
      const opp: Color = color === 'white' ? 'black' : 'white';
      const moves = pseudoMoves(board, r, c, ep);

      // Castling
      if (piece.type === 'king' && !piece.hasMoved && !inCheck(board, color)) {
        const kingRow = color === 'white' ? 7 : 0;
        if (r === kingRow && c === 4) {
          const kRight = color === 'white' ? castling.wK : castling.bK;
          const qRight = color === 'white' ? castling.wQ : castling.bQ;
          if (kRight && !board[kingRow][5] && !board[kingRow][6] &&
              board[kingRow][7]?.type === 'rook' && !board[kingRow][7]?.hasMoved &&
              !isAttacked(board, kingRow, 5, opp) && !isAttacked(board, kingRow, 6, opp)) {
            moves.push([kingRow, 6]);
          }
          if (qRight && !board[kingRow][3] && !board[kingRow][2] && !board[kingRow][1] &&
              board[kingRow][0]?.type === 'rook' && !board[kingRow][0]?.hasMoved &&
              !isAttacked(board, kingRow, 3, opp) && !isAttacked(board, kingRow, 2, opp)) {
            moves.push([kingRow, 2]);
          }
        }
      }

      return moves.filter(([tr, tc]) => {
        const { board: nb } = applyMoveToBoard(board, r, c, tr, tc, ep);
        return !inCheck(nb, color);
      });
    }

    function allLegalMoves(board: Board, color: Color, ep: [number,number] | null, castling: CastlingRights): { fr: number; fc: number; tr: number; tc: number }[] {
      const moves: { fr: number; fc: number; tr: number; tc: number }[] = [];
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++)
          if (board[r][c]?.color === color)
            for (const [tr, tc] of legalMoves(board, r, c, ep, castling))
              moves.push({ fr: r, fc: c, tr, tc });
      return moves;
    }

    // ─── AI Engine ────────────────────────────────────────────────────────────
    function evalBoard(board: Board): number {
      let score = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (!p) continue;
          const sign = p.color === 'white' ? 1 : -1;
          score += sign * PIECE_VALUES[p.type];
          if (p.type === 'pawn') {
            const row = p.color === 'white' ? r : 7 - r;
            score += sign * PAWN_TABLE_WHITE[row][c];
          }
          if (p.type === 'knight') {
            score += sign * KNIGHT_TABLE[r][c];
          }
        }
      }
      return score;
    }

    function minimax(board: Board, depth: number, alpha: number, beta: number, color: Color, ep: [number,number] | null, castling: CastlingRights): number {
      const moves = allLegalMoves(board, color, ep, castling);
      if (moves.length === 0) return inCheck(board, color) ? (color === 'white' ? -100000 : 100000) : 0;
      if (depth === 0) return evalBoard(board);

      const isMax = color === 'white';
      let best = isMax ? -Infinity : Infinity;
      for (const { fr, fc, tr, tc } of moves) {
        const { board: nb, newEp } = applyMoveToBoard(board, fr, fc, tr, tc, ep);
        const nc: Color = color === 'white' ? 'black' : 'white';
        const nCast = updateCastling(castling, board[fr][fc]!, fr, fc, tr, tc);
        const val = minimax(nb, depth - 1, alpha, beta, nc, newEp, nCast);
        if (isMax) { best = Math.max(best, val); alpha = Math.max(alpha, best); }
        else { best = Math.min(best, val); beta = Math.min(beta, best); }
        if (beta <= alpha) break;
      }
      return best;
    }

    function getBestMove(board: Board, color: Color, ep: [number,number] | null, castling: CastlingRights, depth: number, blunderRate: number) {
      const moves = allLegalMoves(board, color, ep, castling);
      if (moves.length === 0) return null;
      if (Math.random() < blunderRate) return moves[Math.floor(Math.random() * moves.length)];

      const opp: Color = color === 'white' ? 'black' : 'white';
      const isMax = color === 'white';
      let bestVal = isMax ? -Infinity : Infinity;
      let bestMove = moves[0];

      for (const mv of moves) {
        const { board: nb, newEp } = applyMoveToBoard(board, mv.fr, mv.fc, mv.tr, mv.tc, ep);
        const nCast = updateCastling(castling, board[mv.fr][mv.fc]!, mv.fr, mv.fc, mv.tr, mv.tc);
        const val = minimax(nb, depth - 1, -Infinity, Infinity, opp, newEp, nCast);
        if (isMax ? val > bestVal : val < bestVal) { bestVal = val; bestMove = mv; }
      }
      return bestMove;
    }

    // ─── Initial Board ────────────────────────────────────────────────────────
    function makeInitialBoard(): Board {
      const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
      const backRow: PieceType[] = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
      backRow.forEach((t, c) => {
        b[0][c] = { type: t, color: 'black', hasMoved: false };
        b[7][c] = { type: t, color: 'white', hasMoved: false };
      });
      for (let c = 0; c < 8; c++) {
        b[1][c] = { type: 'pawn', color: 'black', hasMoved: false };
        b[6][c] = { type: 'pawn', color: 'white', hasMoved: false };
      }
      return b;
    }

    function makeInitialState(): GameState {
      return {
        board: makeInitialBoard(),
        turn: 'white',
        enPassant: null,
        castling: { wK: true, wQ: true, bK: true, bQ: true },
      };
    }

    // ─── Hint Engine ──────────────────────────────────────────────────────────
    interface HintSquare { type: 'movable' | 'threatened' | 'capture' | 'hint-from' | 'hint-to'; r: number; c: number; }

    function getHintSquares(gs: GameState, hintLevel: number, cfg: typeof DIFF_CONFIG[string]): HintSquare[] {
      const { board, turn, enPassant, castling } = gs;
      const opp: Color = turn === 'white' ? 'black' : 'white';
      const moves = allLegalMoves(board, turn, enPassant, castling);

      if (hintLevel === 1) {
        const seen = new Set<string>();
        return moves
          .filter(m => { const k = m.fr + ',' + m.fc; if (seen.has(k)) return false; seen.add(k); return true; })
          .map(m => ({ type: 'movable' as const, r: m.fr, c: m.fc }));
      }
      if (hintLevel === 2) {
        const out: HintSquare[] = [];
        for (let r = 0; r < 8; r++)
          for (let c = 0; c < 8; c++)
            if (board[r][c]?.color === turn && isAttacked(board, r, c, opp))
              out.push({ type: 'threatened', r, c });
        return out.length ? out : [{ type: 'movable', r: -1, c: -1 }];
      }
      if (hintLevel === 3) {
        return moves
          .filter(m => board[m.tr][m.tc] !== null)
          .map(m => ({ type: 'capture' as const, r: m.tr, c: m.tc }));
      }
      if (hintLevel === 4) {
        const best = getBestMove(board, turn, enPassant, castling, Math.min(cfg.depth, 2), 0);
        if (best) return [{ type: 'hint-from', r: best.fr, c: best.fc }, { type: 'hint-to', r: best.tr, c: best.tc }];
      }
      return [];
    }

    // ─── Piece Component ──────────────────────────────────────────────────────
    const PieceEl = ({ piece }: { piece: Piece }) => {
      const idx = piece.color === 'white' ? 0 : 1;
      return (
        <span style={{ fontSize: 22, lineHeight: 1, userSelect: 'none' }}>
          {PIECE_EMOJI[piece.type][idx]}
        </span>
      );
    };

    // ─── Score Calculation ────────────────────────────────────────────────────
    const DIFF_SCORES: Record<string, number> = { puppy: 100, kitten: 200, bunny: 300, fox: 400, owl: 500 };

    // ─── Main Component ───────────────────────────────────────────────────────
    const KidsChessGame = () => {
      const difficulty = window.DIFFICULTY || 'puppy';
      const cfg = DIFF_CONFIG[difficulty] || DIFF_CONFIG.puppy;

      const [gs, setGs] = useState<GameState>(makeInitialState());
      const [history, setHistory] = useState<GameState[]>([]);
      const [selected, setSelected] = useState<[number,number] | null>(null);
      const [moves, setMoves] = useState<[number,number][]>([]);
      const [hintLevel, setHintLevel] = useState(0);
      const [hintSquares, setHintSquares] = useState<HintSquare[]>([]);
      const [aiThinking, setAiThinking] = useState(false);
      const [petSpeech, setPetSpeech] = useState('');
      const [gameResult, setGameResult] = useState<null | 'win' | 'lose' | 'draw'>(null);
      const [score, setScore] = useState(0);
      const [promotionPending, setPromotionPending] = useState<{ fr: number; fc: number; tr: number; tc: number } | null>(null);

      const say = (lines: string[]) => setPetSpeech(lines[Math.floor(Math.random() * lines.length)]);

      const checkEndGame = useCallback((newGs: GameState) => {
        const { board, turn, enPassant, castling } = newGs;
        const movesAvail = allLegalMoves(board, turn, enPassant, castling);
        if (movesAvail.length === 0) {
          const isCheck = inCheck(board, turn);
          if (isCheck) {
            const result = turn === 'white' ? 'lose' : 'win';
            setGameResult(result);
            const finalScore = result === 'win' ? DIFF_SCORES[difficulty] : 0;
            setScore(finalScore);
            if (window.RNBridge) window.RNBridge.gameOver(finalScore);
          } else {
            setGameResult('draw');
            const drawScore = Math.floor(DIFF_SCORES[difficulty] / 2);
            setScore(drawScore);
            if (window.RNBridge) window.RNBridge.gameOver(drawScore);
          }
          return true;
        }
        return false;
      }, [difficulty]);

      const commitMove = useCallback((prevGs: GameState, fr: number, fc: number, tr: number, tc: number, promoteType?: PieceType) => {
        const { board: nb, newEp } = applyMoveToBoard(prevGs.board, fr, fc, tr, tc, prevGs.enPassant, promoteType);
        const nCast = updateCastling(prevGs.castling, prevGs.board[fr][fc]!, fr, fc, tr, tc);
        const nextTurn: Color = prevGs.turn === 'white' ? 'black' : 'white';
        const newGs: GameState = { board: nb, turn: nextTurn, enPassant: newEp, castling: nCast };
        setHistory(h => [...h, prevGs]);
        setGs(newGs);
        setSelected(null);
        setMoves([]);
        setHintLevel(0);
        setHintSquares([]);
        return newGs;
      }, []);

      // AI move
      useEffect(() => {
        if (gs.turn !== 'black' || gameResult || aiThinking || promotionPending) return;
        setAiThinking(true);
        say([cfg.pet + ' is thinking...']);
        const gsSnapshot = gs;
        setTimeout(() => {
          const mv = getBestMove(gsSnapshot.board, 'black', gsSnapshot.enPassant, gsSnapshot.castling, cfg.depth, cfg.blunder);
          if (mv) {
            const newGs = commitMove(gsSnapshot, mv.fr, mv.fc, mv.tr, mv.tc);
            checkEndGame(newGs);
          }
          setAiThinking(false);
          say(cfg.petLines);
        }, cfg.thinkMs);
      }, [gs, gameResult, aiThinking, promotionPending, cfg, commitMove, checkEndGame]);

      const handleSquarePress = (r: number, c: number) => {
        if (gs.turn !== 'white' || aiThinking || gameResult || promotionPending) return;
        const piece = gs.board[r][c];

        if (selected) {
          const isLegal = moves.some(([mr, mc]) => mr === r && mc === c);
          if (isLegal) {
            // Check if promotion
            const movingPiece = gs.board[selected[0]][selected[1]];
            if (movingPiece?.type === 'pawn' && r === 0) {
              setPromotionPending({ fr: selected[0], fc: selected[1], tr: r, tc: c });
              setSelected(null);
              setMoves([]);
              return;
            }
            const newGs = commitMove(gs, selected[0], selected[1], r, c);
            checkEndGame(newGs);
            return;
          }
          // Deselect or select another piece
          if (piece?.color === 'white') {
            setSelected([r, c]);
            setMoves(legalMoves(gs.board, r, c, gs.enPassant, gs.castling));
            setHintLevel(0);
            setHintSquares([]);
            return;
          }
          setSelected(null);
          setMoves([]);
          return;
        }

        if (piece?.color === 'white') {
          setSelected([r, c]);
          setMoves(legalMoves(gs.board, r, c, gs.enPassant, gs.castling));
          setHintLevel(0);
          setHintSquares([]);
        }
      };

      const handleHint = () => {
        if (gs.turn !== 'white' || aiThinking || gameResult) return;
        const next = hintLevel >= 4 ? 1 : hintLevel + 1;
        setHintLevel(next);
        setHintSquares(getHintSquares(gs, next, cfg));
        setSelected(null);
        setMoves([]);
      };

      const handleUndo = () => {
        if (history.length < 2 || gameResult) return;
        // Undo two moves (undo both white and black)
        const prev = history[history.length - 2];
        setHistory(h => h.slice(0, -2));
        setGs(prev);
        setSelected(null);
        setMoves([]);
        setHintLevel(0);
        setHintSquares([]);
        setAiThinking(false);
        setGameResult(null);
      };

      const handleReset = () => {
        setGs(makeInitialState());
        setHistory([]);
        setSelected(null);
        setMoves([]);
        setHintLevel(0);
        setHintSquares([]);
        setAiThinking(false);
        setGameResult(null);
        setScore(0);
        setPromotionPending(null);
        setPetSpeech('');
      };

      const handlePromotion = (type: PieceType) => {
        if (!promotionPending) return;
        const { fr, fc, tr, tc } = promotionPending;
        setPromotionPending(null);
        const newGs = commitMove(gs, fr, fc, tr, tc, type);
        checkEndGame(newGs);
      };

      // Hint label
      const hintLabels = ['', 'See your movable pieces', 'Spot pieces in danger!', 'Find capture moves!', 'Best move suggestion!'];

      // Square highlight helpers
      const getSquareHighlight = (r: number, c: number) => {
        if (selected && selected[0] === r && selected[1] === c) return 'selected';
        if (moves.some(([mr, mc]) => mr === r && mc === c)) {
          return gs.board[r][c] ? 'capture' : 'move';
        }
        for (const h of hintSquares) {
          if (h.r === r && h.c === c) return 'hint-' + h.type;
        }
        return null;
      };

      const lightSq = '#F9EFD7';
      const darkSq  = '#A8C97F';
      const highlightColors: Record<string, string> = {
        selected: '#FFD700',
        move: '#4ade8055',
        capture: '#f87171aa',
        'hint-movable':   '#a78bfa99',
        'hint-threatened':'#fb923c99',
        'hint-capture':   '#34d39999',
        'hint-hint-from': '#6366f1cc',
        'hint-hint-to':   '#818cf8cc',
      };

      const isInCheckSq = (r: number, c: number) => {
        const p = gs.board[r][c];
        if (!p || p.type !== 'king') return false;
        return inCheck(gs.board, p.color);
      };

      const boardSize = Math.min(window.innerWidth, window.innerHeight - 180);
      const sqSize = Math.floor(boardSize / 8);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f0f4ff', fontFamily: 'sans-serif', overflow: 'hidden' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#3d4f9e', color: '#fff' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              {cfg.pet} {cfg.petName}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
              {gameResult ? (gameResult === 'win' ? '🎉 You Won!' : gameResult === 'lose' ? '😅 Try Again!' : '🤝 Draw!') :
               aiThinking ? (cfg.pet + ' thinking...') :
               gs.turn === 'white' ? '⭐ Your Turn!' : '💭 Waiting...'}
            </div>
            <div style={{ fontSize: 13 }}>{score > 0 && '⭐' + score}</div>
          </div>

          {/* Pet speech */}
          {petSpeech && !gameResult && (
            <div style={{ background: '#fff', margin: '4px 12px', padding: '6px 12px', borderRadius: 12, fontSize: 13, color: '#555', borderLeft: '3px solid #3d4f9e', maxWidth: 300, alignSelf: 'center' }}>
              {cfg.pet} {petSpeech}
            </div>
          )}

          {/* Board */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: \`repeat(8, \${sqSize}px)\`, gridTemplateRows: \`repeat(8, \${sqSize}px)\` }}>
              {Array.from({ length: 8 }, (_, r) =>
                Array.from({ length: 8 }, (_, c) => {
                  const isLight = (r + c) % 2 === 0;
                  const highlight = getSquareHighlight(r, c);
                  const isCheckSq = isInCheckSq(r, c);
                  const piece = gs.board[r][c];
                  return (
                    <div
                      key={r * 8 + c}
                      onClick={() => handleSquarePress(r, c)}
                      style={{
                        width: sqSize, height: sqSize,
                        background: isCheckSq ? '#fca5a5' : (highlight ? (highlightColors[highlight] || (isLight ? lightSq : darkSq)) : (isLight ? lightSq : darkSq)),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: piece?.color === 'white' && gs.turn === 'white' ? 'pointer' : (moves.some(([mr,mc]) => mr===r&&mc===c) ? 'pointer' : 'default'),
                        position: 'relative',
                        outline: highlight === 'selected' ? '3px solid #FFD700' : (highlight === 'hint-hint-from' || highlight === 'hint-hint-to' ? '3px solid #6366f1' : 'none'),
                        outlineOffset: '-2px',
                        transition: 'background 0.15s',
                      }}
                    >
                      {(highlight === 'move') && <div style={{ width: sqSize * 0.28, height: sqSize * 0.28, borderRadius: '50%', background: '#22c55e88' }} />}
                      {piece && <PieceEl piece={piece} />}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Hint label */}
          {hintLevel > 0 && !gameResult && (
            <div style={{ textAlign: 'center', fontSize: 13, color: '#6366f1', fontWeight: 600, padding: '2px 8px' }}>
              💡 {hintLabels[hintLevel]}
            </div>
          )}

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, padding: '8px 12px 12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleHint} disabled={!!gameResult || aiThinking || gs.turn !== 'white'}
              style={{ padding: '10px 18px', borderRadius: 14, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (gameResult || aiThinking || gs.turn !== 'white') ? 0.5 : 1 }}>
              🐾 Hint {hintLevel > 0 ? hintLevel : ''}
            </button>
            <button onClick={handleUndo} disabled={history.length < 2 || !!gameResult}
              style={{ padding: '10px 18px', borderRadius: 14, border: 'none', background: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (history.length < 2 || !!gameResult) ? 0.5 : 1 }}>
              ↩ Undo
            </button>
            <button onClick={handleReset}
              style={{ padding: '10px 18px', borderRadius: 14, border: 'none', background: '#6b7280', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              🔄 New
            </button>
          </div>

          {/* Promotion modal */}
          {promotionPending && (
            <div style={{ position: 'fixed', inset: 0, background: '#00000099', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, textAlign: 'center', boxShadow: '0 8px 32px #0004' }}>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#333' }}>🦋 Pawn Promoted! Choose a piece:</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {(['queen','rook','bishop','knight'] as PieceType[]).map(t => (
                    <button key={t} onClick={() => handlePromotion(t)}
                      style={{ padding: '12px 14px', borderRadius: 14, border: '2px solid #3d4f9e', background: '#eef1ff', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#3d4f9e' }}>
                      <div style={{ fontSize: 28 }}>{PIECE_EMOJI[t][0]}</div>
                      {PIECE_NAMES[t]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Game over modal */}
          {gameResult && (
            <div style={{ position: 'fixed', inset: 0, background: '#00000099', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <div style={{ background: '#fff', borderRadius: 24, padding: 32, textAlign: 'center', boxShadow: '0 8px 32px #0004', maxWidth: 280, width: '90%' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>
                  {gameResult === 'win' ? '🎉' : gameResult === 'lose' ? '😅' : '🤝'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#333', marginBottom: 4 }}>
                  {gameResult === 'win' ? 'You Won!' : gameResult === 'lose' ? 'Try Again!' : "It's a Draw!"}
                </div>
                <div style={{ fontSize: 16, color: '#888', marginBottom: 16 }}>
                  {gameResult === 'win' ? 'Amazing chess! ⭐ ' + score + ' stars!' :
                   gameResult === 'lose' ? 'Great effort! Keep practicing! 💪' :
                   'Well played — a draw is great! ⭐ ' + score + ' stars!'}
                </div>
                <button onClick={handleReset}
                  style={{ padding: '14px 32px', borderRadius: 16, border: 'none', background: '#3d4f9e', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', width: '100%', marginBottom: 10 }}>
                  🔄 Play Again
                </button>
                <button onClick={() => window.RNBridge && window.RNBridge.navigate('back')}
                  style={{ padding: '10px 24px', borderRadius: 12, border: '2px solid #ccc', background: 'transparent', color: '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  ← Back to Menu
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(KidsChessGame));
  </script>
</body>
</html>`;
}

export const KidsChessGameScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { updateBestScore } = useKidsChess();
  const { triggerAd } = useGameAdTrigger('kids-chess');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [adRewardPending, setAdRewardPending] = useState(false);

  const difficulty = route.params?.difficulty ?? 'puppy';

  // Memoize HTML so it's only generated once per screen mount
  const artifactHtml = React.useMemo(() => getArtifactHTML(difficulty), [difficulty]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleGameOver = useCallback(
    (finalScore: number) => {
      setScore(finalScore);
      setGameOver(true);
      updateBestScore(finalScore);
    },
    [updateBestScore],
  );

  const handleBack = useGameBack(navigation);

  const handleNavigate = useCallback(
    (target: string) => {
      if (target === 'back') handleBack();
    },
    [handleBack],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} accessibilityRole="button">
          <Text style={styles.backText}>{t('common.back')}</Text>
        </TouchableOpacity>
        {score > 0 && <Text style={styles.scoreText}>⭐ {score}</Text>}
      </View>

      <View style={styles.gameArea}>
        <ArtifactGameAdapter
          htmlContent={artifactHtml}
          onScoreUpdate={handleScoreUpdate}
          onGameOver={handleGameOver}
          onNavigate={handleNavigate}
        />
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            {!adRewardPending && (
              <TouchableOpacity
                style={styles.playAgainButton}
                onPress={async () => {
                  setAdRewardPending(true);
                  const _reward = await triggerAd('game_ended', score);
                  setAdRewardPending(false);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.playAgainText}>🎬 {t('kidsChess.gameOver.watchAd')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setGameOver(false);
                setScore(0);
                setAdRewardPending(false);
                navigation.replace('KidsChessGame', { difficulty });
              }}
              disabled={adRewardPending}
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>{t('kidsChess.gameOver.playAgain')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#3d4f9e',
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3d4f9e',
  },
  gameArea: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    minWidth: 260,
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#3d4f9e',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
