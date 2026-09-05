import React, { useState, useEffect, useCallback } from 'react';

type Player = 'X' | 'O';
type GameMode = 'pvp' | 'pve';
type Difficulty = 'easy' | 'hard';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('X');
  const [mode, setMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [moveHistory, setMoveHistory] = useState<(Player | null)[][]>([]);

  // Check for winner on current board
  const checkWinner = (currentBoard: (Player | null)[]) => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'Draw' as const, combo: null };
    }
    return null;
  };

  // Minimax logic for hard AI
  const minimax = (
    tempBoard: (Player | null)[],
    depth: number,
    isMaximizing: boolean
  ): { score: number; index?: number } => {
    const result = checkWinner(tempBoard);
    if (result) {
      if (result.winner === 'O') return { score: 10 - depth };
      if (result.winner === 'X') return { score: depth - 10 };
      if (result.winner === 'Draw') return { score: 0 };
    }

    const availableMoves = tempBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = availableMoves[0];
      for (const move of availableMoves) {
        tempBoard[move] = 'O';
        const evalResult = minimax(tempBoard, depth + 1, false);
        tempBoard[move] = null;
        if (evalResult.score > bestScore) {
          bestScore = evalResult.score;
          bestMove = move;
        }
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = availableMoves[0];
      for (const move of availableMoves) {
        tempBoard[move] = 'X';
        const evalResult = minimax(tempBoard, depth + 1, true);
        tempBoard[move] = null;
        if (evalResult.score < bestScore) {
          bestScore = evalResult.score;
          bestMove = move;
        }
      }
      return { score: bestScore, index: bestMove };
    }
  };

  const getBotMove = useCallback(
    (currentBoard: (Player | null)[]): number | null => {
      const availableMoves = currentBoard
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);

      if (availableMoves.length === 0) return null;

      if (difficulty === 'easy') {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
      } else {
        const bestMove = minimax(currentBoard, 0, true);
        return bestMove.index ?? availableMoves[0];
      }
    },
    [difficulty]
  );

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;

    setMoveHistory((prev) => [...prev, board]);
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult.winner);
      setWinningCombo(gameResult.combo);
      if (gameResult.winner === 'X') {
        setScores((prev) => ({ ...prev, X: prev.X + 1 }));
      } else if (gameResult.winner === 'O') {
        setScores((prev) => ({ ...prev, O: prev.O + 1 }));
      } else if (gameResult.winner === 'Draw') {
        setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
      }
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  // Trigger bot move when it's AI turn in PvE mode
  useEffect(() => {
    if (mode === 'pve' && turn === 'O' && !winner) {
      const timer = setTimeout(() => {
        const botMove = getBotMove(board);
        if (botMove !== null) {
          handleCellClick(botMove);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [board, turn, mode, winner, getBotMove]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setWinningCombo(null);
    setMoveHistory([]);
  };

  const resetScores = () => {
    resetGame();
    setScores({ X: 0, O: 0, ties: 0 });
  };

  const undoMove = () => {
    if (moveHistory.length === 0 || winner) return;
    const lastBoard = moveHistory[moveHistory.length - 1];
    setBoard(lastBoard);
    setMoveHistory((prev) => prev.slice(0, -1));
    if (mode === 'pve') {
      setTurn('X');
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-200">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">❌⭕</span>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Tic-Tac-Toe</h1>
        </div>

        {/* Controls Bar */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center bg-gray-100 p-1.5 rounded-xl text-sm font-semibold">
            <button
              onClick={() => {
                setMode('pvp');
                resetGame();
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'pvp'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 2 Players
            </button>
            <button
              onClick={() => {
                setMode('pve');
                resetGame();
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'pve'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🤖 vs Computer
            </button>
          </div>

          {mode === 'pve' && (
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-600">
              <span>Difficulty:</span>
              <button
                onClick={() => {
                  setDifficulty('easy');
                  resetGame();
                }}
                className={`px-3 py-1 rounded-full border ${
                  difficulty === 'easy'
                    ? 'bg-green-500 text-white border-green-500 shadow'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Easy 🟢
              </button>
              <button
                onClick={() => {
                  setDifficulty('hard');
                  resetGame();
                }}
                className={`px-3 py-1 rounded-full border ${
                  difficulty === 'hard'
                    ? 'bg-red-500 text-white border-red-500 shadow'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                Unbeatable 🔴
              </button>
            </div>
          )}
        </div>

        {/* Scoreboard */}
        <div className="w-full grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5">
            <div className="text-xs font-bold text-blue-600 uppercase">Player X</div>
            <div className="text-2xl font-black text-blue-700">{scores.X}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5">
            <div className="text-xs font-bold text-gray-500 uppercase">Ties</div>
            <div className="text-2xl font-black text-gray-700">{scores.ties}</div>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5">
            <div className="text-xs font-bold text-rose-600 uppercase">
              {mode === 'pve' ? 'Computer (O)' : 'Player O'}
            </div>
            <div className="text-2xl font-black text-rose-700">{scores.O}</div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-4 text-lg font-bold">
          {winner ? (
            winner === 'Draw' ? (
              <span className="text-amber-600">🤝 It's a Draw!</span>
            ) : (
              <span className={winner === 'X' ? 'text-blue-600' : 'text-rose-600'}>
                🎉 Player {winner} Wins!
              </span>
            )
          ) : (
            <span className="text-gray-700">
              Current Turn:{' '}
              <span className={turn === 'X' ? 'text-blue-600 font-black' : 'text-rose-600 font-black'}>
                {turn} {mode === 'pve' && turn === 'O' ? '(Thinking...)' : ''}
              </span>
            </span>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 w-full aspect-square mb-6 bg-gray-200 p-3 rounded-2xl shadow-inner">
          {board.map((value, index) => {
            const isWinningCell = winningCombo?.includes(index);
            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!!value || !!winner || (mode === 'pve' && turn === 'O')}
                className={`flex justify-center items-center text-4xl sm:text-5xl font-black rounded-xl transition-all duration-200 shadow-sm ${
                  isWinningCell
                    ? 'bg-emerald-400 text-white animate-bounce shadow-lg'
                    : value === 'X'
                    ? 'bg-white text-blue-600 shadow-md'
                    : value === 'O'
                    ? 'bg-white text-rose-600 shadow-md'
                    : 'bg-white hover:bg-gray-100 text-transparent active:scale-95'
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0 || !!winner}
            className="flex-1 py-2.5 px-4 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 text-gray-800 font-semibold rounded-xl text-sm transition-all"
          >
            ↩️ Undo
          </button>
          <button
            onClick={resetGame}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all active:scale-95"
          >
            🔄 New Round
          </button>
          <button
            onClick={resetScores}
            className="py-2.5 px-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl text-sm transition-all"
            title="Reset Scores"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
