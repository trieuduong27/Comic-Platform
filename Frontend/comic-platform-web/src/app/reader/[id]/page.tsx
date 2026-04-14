import Reader from "@/components/Reader";
import ChapterNavigator from "@/components/ChapterNavigator";
import Link from "next/link";

export default async function ReaderPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ chapterId?: string }> }) {
  const { id } = await params;
  const { chapterId } = await searchParams;

  let images: string[] = [];
  let comicTitle = "Loading...";
  let chapters: any[] = [];
  let activeChapterId = chapterId ? parseInt(chapterId) : 0;

  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const resComic = await fetch(`${apiUrl}/api/comics/${id}`, { cache: 'no-store' });
    if (resComic.ok) {
      const comic = await resComic.json();
      comicTitle = comic.title;
      chapters = comic.chapters || [];

      if (chapters.length > 0) {
        // Nếu không có chapterId được truyền lên URL hoặc chapterId không hợp lệ, auto chọn chapter đầu tiên
        if (activeChapterId === 0 || !chapters.find((c: any) => c.chapterId === activeChapterId)) {
           // Sắp xếp tăng dần theo chapterNumber để luôn lấy chương nhỏ nhất làm chương 1
           const sortedList = [...chapters].sort((a: any, b: any) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
           activeChapterId = sortedList[0].chapterId;
        }

        const resChapter = await fetch(`${apiUrl}/api/chapters/${activeChapterId}`, { cache: 'no-store' });
        if (resChapter.ok) {
          const chapter = await resChapter.json();
          if (chapter.chapterImages) {
            // Sắp xếp ảnh theo PageOrder tăng dần
            const sortedImages = [...chapter.chapterImages].sort((a: any, b: any) => a.pageOrder - b.pageOrder);
            images = sortedImages.map((img: any) => img.imageUrl);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div style={{ padding: "1rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: "1rem" }}>
         <Link href="/" className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
            ← Về Trang Chủ
         </Link>
         <h1 style={{ marginTop: "1rem", fontSize: "1.5rem" }}>{comicTitle}</h1>
         
         {/* Thanh điều hướng chapter ở phía trên băng đọc */}
         {chapters.length > 0 && (
           <ChapterNavigator comicId={id} chapters={chapters} currentChapterId={activeChapterId} />
         )}
      </div>
      
      {images.length > 0 ? (
        <Reader images={images} />
      ) : (
        <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "4rem", color: "var(--text-secondary)" }}>
            {chapters.length === 0 ? "Bộ truyện này chưa có tập nào." : "Tập hiện tại đang trống hoặc đang cập nhật trang."}
        </div>
      )}

      {/* Thanh điều hướng chapter ở phía dưới băng đọc giúp chuyển chương nhanh chóng */}
      <div style={{ maxWidth: 900, margin: "2rem auto" }}>
         {chapters.length > 0 && images.length > 0 && (
           <ChapterNavigator comicId={id} chapters={chapters} currentChapterId={activeChapterId} />
         )}
      </div>
    </div>
  );
}
