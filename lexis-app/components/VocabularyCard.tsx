'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Word, MeaningMode } from '@/types';
import { Eye, EyeOff, Sparkles, Bot } from 'lucide-react';

interface VocabularyCardProps {
  currentWord: Word;
  currentIndex: number;
  totalWords: number;
  isMasked: boolean;
  toggleMask: () => void;
  meaningMode: MeaningMode;
  cycleMeaningMode: () => void;
  isGlassMode: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  currentWord,
  currentIndex,
  totalWords,
  isMasked,
  toggleMask,
  meaningMode,
  cycleMeaningMode,
  isGlassMode,
  onNext,
  onPrev,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Card local state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [wheelCooldown, setWheelCooldown] = useState(false);

  // AI Example State
  const [aiExample, setAiExample] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiLoaded, setIsAiLoaded] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Speech synthesis & Reset animation on word change
  useEffect(() => {
    setOpacity(0);
    setScale(0.98);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    const timer = setTimeout(() => {
      setOpacity(1);
      setScale(1);
      setDragOffset(0);
      setAiExample(null);
      setIsAiLoaded(false);
      setIsAiLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentIndex, currentWord]);

  // Bounce animation
  const bounceCard = (direction: 'left' | 'right') => {
    const offset = direction === 'left' ? -20 : 20;
    setDragOffset(offset);
    setTimeout(() => {
      setDragOffset(0);
    }, 100);
  };

  // Touch & Mouse Swipe Handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    currentXRef.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    currentXRef.current = clientX;
    const diffX = currentXRef.current - startXRef.current;
    setDragOffset(Math.max(-50, Math.min(50, diffX)));
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 50;
    const diffX = currentXRef.current - startXRef.current;

    if (Math.abs(diffX) < 5) {
      setDragOffset(0);
      return;
    }

    if (diffX < -swipeThreshold) {
      if (currentIndex < totalWords - 1) {
        onNext();
      } else {
        bounceCard('left');
      }
    } else if (diffX > swipeThreshold) {
      if (currentIndex > 0) {
        onPrev();
      } else {
        bounceCard('right');
      }
    } else {
      setDragOffset(0);
    }
  };

  // Wheel Handler
  const handleWheel = (e: React.WheelEvent) => {
    if (isDragging) return;
    if (Math.abs(e.deltaX) < 10 && Math.abs(e.deltaY) < 10) return;
    if (wheelCooldown) return;

    const isNext = e.deltaX > 0 || e.deltaY > 0;
    const isPrev = e.deltaX < 0 || e.deltaY < 0;

    if (isNext) {
      if (currentIndex < totalWords - 1) {
        onNext();
        triggerWheelCooldown();
      } else {
        bounceCard('left');
      }
    } else if (isPrev) {
      if (currentIndex > 0) {
        onPrev();
        triggerWheelCooldown();
      } else {
        bounceCard('right');
      }
    }
  };

  const triggerWheelCooldown = () => {
    setWheelCooldown(true);
    setTimeout(() => setWheelCooldown(false), 400);
  };

  // AI Example Generator
  const handleGenerateAi = () => {
    if (isAiLoaded || isAiLoading) return;

    setIsAiLoading(true);
    setTimeout(() => {
      const randomExample =
        currentWord.aiPool[Math.floor(Math.random() * currentWord.aiPool.length)];
      setAiExample(randomExample);
      setIsAiLoading(false);
      setIsAiLoaded(true);
    }, 800);
  };

  // Mask logic formatting
  const renderMaskedExample = () => {
    if (!isMasked) return `"${currentWord.example}"`;

    let base = currentWord.word;
    let pattern: string;

    if (base.endsWith('y') && base.length > 2) {
      const root = base.slice(0, -1);
      pattern = `${root}(y|ies|ied|ying)?`;
    } else {
      pattern = `${base}(s|es|ed|ing)?`;
    }

    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    return `"${currentWord.example.replace(regex, '（   ）')}"`;
  };

  return (
    <div
      ref={cardRef}
      onWheel={handleWheel}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => e.button === 0 && handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      style={{
        transform: `translateX(${dragOffset}px) scale(${scale})`,
        opacity,
        transition: isDragging
          ? 'none'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={`w-full max-w-sm rounded-3xl p-6 select-none transition-colors duration-300 relative ${
        isGlassMode
          ? 'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-700/30 shadow-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]'
          : 'bg-white dark:bg-zinc-900 shadow-xl'
      }`}
    >
      {/* Top Bar inside Card */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-mono text-zinc-400">
          {currentIndex + 1} / {totalWords}
        </span>
        <button
          onClick={toggleMask}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          title="伏字モード切替"
        >
          {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Word & Phonetic */}
      <div className="mb-6 text-center">
        <h2
          className={`text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 transition-all ${
            isMasked ? 'blur-sm select-none' : ''
          }`}
        >
          {isMasked ? '••••••••' : currentWord.word}
        </h2>
        <p
          className={`text-sm text-zinc-400 font-mono transition-all ${
            isMasked ? 'blur-sm select-none' : ''
          }`}
        >
          {currentWord.phonetic}
        </p>
      </div>

      {/* Meaning Toggle Section */}
      <div
        onClick={cycleMeaningMode}
        className="cursor-pointer mb-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-center"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] tracking-wider text-zinc-400 uppercase font-semibold">
            MEANING
          </span>
          <span
            className={
              meaningMode === 'ja'
                ? 'text-[10px] uppercase tracking-widest bg-zinc-200/60 dark:bg-zinc-700/60 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-300 font-medium'
                : meaningMode === 'en'
                ? 'text-[10px] uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full text-blue-500 font-semibold'
                : 'text-[10px] uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full text-zinc-400'
            }
          >
            {meaningMode === 'ja' ? '日本語' : meaningMode === 'en' ? 'ENGLISH' : '非表示'}
          </span>
        </div>
        <div className="min-h-[40px] flex items-center justify-center">
          {meaningMode === 'ja' && (
            <p className="text-base text-zinc-700 dark:text-zinc-200 font-medium">
              {currentWord.meaning}
            </p>
          )}
          {meaningMode === 'en' && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal italic leading-relaxed">
              {currentWord.definition}
            </p>
          )}
          {meaningMode === 'hide' && (
            <p className="text-sm text-zinc-300 dark:text-zinc-600 font-medium tracking-wide">
              タップして表示
            </p>
          )}
        </div>
      </div>

      {/* Standard Example Sentence */}
      <div className="mb-6">
        <p className="text-xs tracking-wider text-zinc-400 uppercase font-semibold mb-2">
          EXAMPLE
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
          {renderMaskedExample()}
        </p>
      </div>

      {/* AI Generated Example Section */}
      {aiExample && (
        <div className="mb-6 p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-1.5 mb-1.5 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              AI Example
            </span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
            "{aiExample}"
          </p>
        </div>
      )}

      {/* AI Request Button */}
      <button
        onClick={handleGenerateAi}
        disabled={isAiLoaded || isAiLoading}
        style={{ opacity: isAiLoaded || isAiLoading ? 0.6 : 1 }}
        className="w-full py-3 px-4 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-xs flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Bot className="w-4 h-4" />
        <span>
          {isAiLoading
            ? 'AIが思考中...'
            : isAiLoaded
            ? '新しい例文を生成しました'
            : 'AIに新しい例文を頼む'}
        </span>
      </button>
    </div>
  );
};