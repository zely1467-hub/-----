'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { initialWords } from '@/data/words';
import { Word, HistoryItem, MeaningMode } from '@/types';
import { Header } from '@/components/Header';
import { VocabularyCard } from '@/components/VocabularyCard';
import { HistorySheet } from '@/components/HistorySheet';

export default function Home() {
  const [words, setWords] = useState<Word[]>(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGlassMode, setIsGlassMode] = useState(false);
  const [meaningMode, setMeaningMode] = useState<MeaningMode>('ja');
  const [isMasked, setIsMasked] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Load localStorage state
  useEffect(() => {
    const savedHistory = localStorage.getItem('vocab_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }

    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // History updater
  const addToHistory = useCallback((word: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.word !== word);
      const updated = [{ word, time }, ...filtered].slice(0, 20);
      localStorage.setItem('vocab_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Track history when word changes
  useEffect(() => {
    if (words[currentIndex]) {
      addToHistory(words[currentIndex].word);
    }
  }, [currentIndex, words, addToHistory]);

  // Card Controls
  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, words.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleShuffle = useCallback(() => {
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setWords(shuffled);
    setCurrentIndex(0);
  }, [words]);

  // Meaning mode cyclic toggle
  const cycleMeaningMode = () => {
    if (meaningMode === 'ja') setMeaningMode('en');
    else if (meaningMode === 'en') setMeaningMode('hide');
    else setMeaningMode('ja');
  };

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    const foundIndex = words.findIndex((item) =>
      item.word.toLowerCase().startsWith(query)
    );
    if (foundIndex !== -1 && foundIndex !== currentIndex) {
      setCurrentIndex(foundIndex);
    }
  }, [searchQuery, words, currentIndex]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.id === 'searchInput') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleNext();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handlePrev();
          break;
        case ' ':
          e.preventDefault();
          cycleMeaningMode();
          break;
        case 's':
        case 'S':
          handleShuffle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleShuffle, cycleMeaningMode]);

  // Theme Toggle
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen p-4 overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Dynamic Aurora Glass Background */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isGlassMode ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-1/3 w-[250px] h-[250px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[90px]" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center flex-1">
        <Header
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openSearch={() => setIsSearchOpen(true)}
          closeSearch={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
          }}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onShuffle={handleShuffle}
          isGlassMode={isGlassMode}
          toggleGlassMode={() => setIsGlassMode(!isGlassMode)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <div className="flex-1 flex items-center justify-center w-full my-auto">
          {words[currentIndex] && (
            <VocabularyCard
              currentWord={words[currentIndex]}
              currentIndex={currentIndex}
              totalWords={words.length}
              isMasked={isMasked}
              toggleMask={() => setIsMasked(!isMasked)}
              meaningMode={meaningMode}
              cycleMeaningMode={cycleMeaningMode}
              isGlassMode={isGlassMode}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
        </div>

        {/* Progress Indicator Dots */}
        <div className="flex items-center gap-1.5 my-6">
          {words.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 bg-zinc-800 dark:bg-white'
                  : 'w-1.5 bg-zinc-300 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>

      <HistorySheet
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem('vocab_history');
        }}
      />
    </main>
  );
}