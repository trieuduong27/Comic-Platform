import Reader from "@/components/Reader";
import Link from "next/link";

export default async function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let images: string[] = [];
  let comicTitle = "Loading...";

  try {
    const apiUrl = process.env.API_URL || "http://localhost:8080";
    const resComic = await fetch(`${apiUrl}/api/comics/${id}`, { cache: 'no-store' });
    if (resComic.ok) {
      const comic = await resComic.json();
      comicTitle = comic.title;
      // Get first chapter
      if (comic.chapters && comic.chapters.length > 0) {
        const firstChapterId = comic.chapters[0].chapterId;
        const apiUrl = process.env.API_URL || "http://localhost:8080";
        const resChapter = await fetch(`${apiUrl}/api/chapters/${firstChapterId}`, { cache: 'no-store' });
        if (resChapter.ok) {
          const chapter = await resChapter.json();
          if (chapter.chapterImages) {
            images = chapter.chapterImages.map((img: any) => img.imageUrl);
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: "1rem" }}>
         <Link href="/" className="btn" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
            ← Về Trang Chủ
         </Link>
         <h1 style={{ marginTop: "1rem", fontSize: "1.5rem" }}>{comicTitle}</h1>
      </div>
      
      {images.length > 0 ? (
        <Reader images={images} />
      ) : (
        <div style={{ textAlign: "center", marginTop: "4rem", color: "var(--text-secondary)" }}>
            <p>Hiện chưa có chương hoặc ảnh nào.</p>
        </div>
      )}
    </div>
  );
}
