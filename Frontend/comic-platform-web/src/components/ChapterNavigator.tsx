"use client";

import { useRouter } from 'next/navigation';

export default function ChapterNavigator({ comicId, chapters, currentChapterId }: { comicId: string, chapters: any[], currentChapterId: number }) {
  const router = useRouter();

  if (!chapters || chapters.length === 0) return null;

  // Lấy danh sách chapter và sắp xếp theo số tập (đảm bảo lúc nào cũng đúng thứ tự)
  const sortedChapters = [...chapters].sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  
  const currentIndex = sortedChapters.findIndex(c => c.chapterId === currentChapterId);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '1rem 0' }}>
      <button 
        className="btn" 
        disabled={!prevChapter}
        onClick={() => prevChapter && router.push(`/reader/${comicId}?chapterId=${prevChapter.chapterId}`)}
        style={{ opacity: prevChapter ? 1 : 0.5, cursor: prevChapter ? 'pointer' : 'not-allowed' }}
      >
        &uarr; Ch. Trước
      </button>

      <select 
        value={currentChapterId || ''} 
        onChange={(e) => router.push(`/reader/${comicId}?chapterId=${e.target.value}`)}
        style={{ padding: '0.6rem', borderRadius: '4px', background: 'var(--surface-color)', color: '#fff', border: '1px solid #444', flex: 1, outline: 'none' }}
      >
        {sortedChapters.map((chap) => (
          <option key={chap.chapterId} value={chap.chapterId}>
            {chap.chapterNumber !== undefined && chap.chapterNumber !== null ? `Chương ${chap.chapterNumber}: ` : ''} 
            {chap.title || 'Không có tiêu đề'}
          </option>
        ))}
      </select>

      <button 
        className="btn" 
        disabled={!nextChapter}
        onClick={() => nextChapter && router.push(`/reader/${comicId}?chapterId=${nextChapter.chapterId}`)}
        style={{ opacity: nextChapter ? 1 : 0.5, cursor: nextChapter ? 'pointer' : 'not-allowed' }}
      >
        Ch. Theo &darr;
      </button>
    </div>
  );
}
