'use client';

import React from 'react';
import { Search, History, Shuffle, Sparkles, Moon, Sun, X } from 'lucide-react';

interface HeaderProps {
  isSearchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  onOpenHistory: () => void;
  onShuffle: () => void;
  isGlassMode: boolean;
  toggleGlassMode: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSearchOpen,
  searchQuery,
  setSearchQuery,
  openSearch,
  closeSearch,
  onOpenHistory,
  onShuffle,
  isGlassMode,
  toggleGlassMode,
  isDark,
  toggleTheme,
}) => {
  return (
    <header className="relative flex items-center justify-between w-full h-16 px-4 mb-4">
      {/* App Title */}
      <div
        className={`transition-all duration-300 transform ${
          isSearchOpen
            ? 'opacity-0 -translate-x-4 pointer-events-none'
            : 'opacity-100 translate-x-0'
        }`}
      >
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Lexis
        </h1>
      </div>

      {/* Header Action Buttons */}
      <div
        className={`flex items-center gap-2 transition-all duration-300 transform ${
          isSearchOpen
            ? 'opacity-0 translate-x-4 pointer-events-none'
            : 'opacity-100 translate-x-0'
        }`}
      >
        <button
          onClick={openSearch}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="検索"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={onShuffle}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="シャッフル (S)"
        >
          <Shuffle className="w-5 h-5" />
        </button>
        <button
          onClick={toggleGlassMode}
          className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
            isGlassMode ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-600 dark:text-zinc-300'
          }`}
          title="グラスモード切り替え"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenHistory}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="学習履歴"
        >
          <History className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="テーマ切り替え"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Search Bar Input Container */}
      <div
        className={`absolute inset-x-4 flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/90 rounded-2xl px-3 py-2 transition-all duration-300 transform ${
          isSearchOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          id="searchInput"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="単語を検索..."
          className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
        />
        <button
          onClick={closeSearch}
          className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};