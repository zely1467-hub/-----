'use client';

import React from 'react';
import { HistoryItem } from '@/types';
import { X, Trash2 } from 'lucide-react';

interface HistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
}

export const HistorySheet: React.FC<HistorySheetProps> = ({
  isOpen,
  onClose,
  history,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end sm:items-center transition-opacity"
    >
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[80vh] flex flex-col transform transition-transform duration-300">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            学習履歴
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={onClear}
              className="p-1.5 rounded-full text-zinc-400 hover:text-red-500 transition-colors"
              title="履歴を削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto py-4 space-y-2 flex-1">
          {history.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">履歴がありません</p>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl"
              >
                <span className="font-medium text-sm tracking-tight text-zinc-800 dark:text-zinc-200">
                  {item.word}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};