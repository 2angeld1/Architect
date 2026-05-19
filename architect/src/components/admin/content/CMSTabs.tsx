'use client';

import { AVAILABLE_PAGES } from '@/hooks/admin/useCMSPage';

interface CMSTabsProps {
  selectedPage: string;
  setSelectedPage: (s: string) => void;
  newContent: any;
  setNewContent: (c: any) => void;
}

export default function CMSTabs({
  selectedPage,
  setSelectedPage,
  newContent,
  setNewContent,
}: CMSTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 font-sans">
      {AVAILABLE_PAGES.map((page) => (
        <button
          key={page}
          onClick={() => {
            setSelectedPage(page);
            setNewContent({ ...newContent, page });
          }}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all capitalize whitespace-nowrap border ${selectedPage === page
              ? 'bg-zinc-800 text-white border-zinc-700'
              : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
        >
          {page.replace(/-/g, ' ')}
        </button>
      ))}
    </div>
  );
}
