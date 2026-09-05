import React, { useState, useEffect, useCallback } from 'react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🐶', '🐱', '🦊', '🐼', '🦁', '🐯', '🐸', '🐵'];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);

  // Initialize & Shuffle Board
  const initBoard = useCallback(() => {
    const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setIsGameActive(false);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Stopwatch interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !isWon) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, isWon]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    if (!isGameActive) {
      setIsGameActive(true);
    }

    // Flip selected card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // If 2 cards flipped, compare
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;

      if (updatedCards[firstIndex].emoji === updatedCards[secondIndex].emoji) {
        // Match found
        setTimeout(() => {
          setCards((prevCards) => {
            const matchCards = [...prevCards];
            matchCards[firstIndex].isMatched = true;
            matchCards[secondIndex].isMatched = true;

            // Check if all pairs matched
            if (matchCards.every((card) => card.isMatched)) {
              setIsWon(true);
              setIsGameActive(false);
            }
            return matchCards;
          });
          setFlippedCards([]);
        }, 300);
      } else {
        // Mismatch - Flip back after delay
        setTimeout(() => {
          setCards((prevCards) => {
            const resetCards = [...prevCards];
            resetCards[firstIndex].isFlipped = false;
            resetCards[secondIndex].isFlipped = false;
            return resetCards;
          });
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🎴</span>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Memory Game</h1>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Moves</div>
            <div className="text-3xl font-black text-amber-700 mt-1">{moves}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">Time</div>
            <div className="text-3xl font-black text-orange-700 mt-1">{formatTime(timer)}</div>
          </div>
        </div>

        {/* 4x4 Card Grid */}
        <div className="grid grid-cols-4 gap-3 w-full aspect-square mb-6">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || card.isFlipped}
              className={`rounded-2xl flex items-center justify-center text-4xl shadow-md transition-all duration-300 transform active:scale-95 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white border-2 border-amber-400 rotate-0'
                  : 'bg-gradient-to-br from-amber-500 to-orange-600 text-transparent hover:scale-105'
              } ${card.isMatched ? 'opacity-60 bg-emerald-50 border-emerald-400' : ''}`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </button>
          ))}
        </div>

        {/* Victory Card Modal */}
        {isWon && (
          <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 mb-6 text-center shadow-lg animate-bounce">
            <h2 className="text-2xl font-black mb-1">🎉 You Won!</h2>
            <p className="text-emerald-100 text-sm mb-3">
              Matched all pairs in <strong>{moves} moves</strong> and <strong>{formatTime(timer)}</strong>!
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={initBoard}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-amber-200 transition-all active:scale-95 flex justify-center items-center gap-2 text-base"
        >
          🔄 Restart Game
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;
