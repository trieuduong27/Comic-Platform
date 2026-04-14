using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ComicPlatform.API.Services;
using ComicPlatform.API.Data;
using ComicPlatform.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ComicPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class MangaDexController : ControllerBase
    {
        private readonly MangaDexService _mangaDexService;
        private readonly AppDbContext _context;

        public MangaDexController(MangaDexService mangaDexService, AppDbContext context)
        {
            _mangaDexService = mangaDexService;
            _context = context;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string title)
        {
            if (string.IsNullOrEmpty(title))
                return BadRequest("Title is required");

            try
            {
                var results = await _mangaDexService.SearchMangaAsync(title);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error searching MangaDex: {ex.Message}");
            }
        }

        [HttpGet("manga/{mangaId}/chapters")]
        public async Task<IActionResult> GetChapters(string mangaId)
        {
            try
            {
                var results = await _mangaDexService.GetMangaChaptersAsync(mangaId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching chapters: {ex.Message}");
            }
        }

        public class ImportComicDto
        {
            public string MangaId { get; set; } = string.Empty;
        }

        private string GenerateSlug(string text)
        {
            if (string.IsNullOrEmpty(text)) return "";
            var slug = text.ToLowerInvariant().Replace(" ", "-");
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
            return slug;
        }

        [HttpPost("import-comic")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportComic([FromBody] ImportComicDto dto)
        {
            if (string.IsNullOrEmpty(dto.MangaId)) return BadRequest("MangaId is required");

            try
            {
                var manga = await _mangaDexService.GetMangaDetailsAsync(dto.MangaId);
                if (manga == null) return NotFound("Manga not found on MangaDex");

                var originalSlug = GenerateSlug(manga.Title);
                var finalSlug = originalSlug;
                int count = 1;

                while (await _context.Comics.AnyAsync(c => c.Slug == finalSlug))
                {
                    finalSlug = $"{originalSlug}-{count}";
                    count++;
                }

                var newComic = new Comic
                {
                    Title = manga.Title,
                    Slug = finalSlug,
                    Description = string.IsNullOrEmpty(manga.Description) ? "No description provided." : manga.Description,
                    CoverImage = string.IsNullOrEmpty(manga.CoverUrl) ? "/uploads/default_cover.jpg" : manga.CoverUrl,
                    CreatedAt = DateTime.UtcNow,
                    ViewCount = 0
                };

                _context.Comics.Add(newComic);
                await _context.SaveChangesAsync();

                return Ok(new { comicId = newComic.ComicId, message = "Imported successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error importing comic: {ex.Message}");
            }
        }

        public class ImportChapterDto
        {
            public string MangaDexChapterId { get; set; } = string.Empty;
            public int ComicId { get; set; }
            public string ChapterTitle { get; set; } = string.Empty;
            public string ChapterNumberStr { get; set; } = string.Empty;
        }

        [HttpPost("import-chapter")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportChapter([FromBody] ImportChapterDto dto)
        {
            if (string.IsNullOrEmpty(dto.MangaDexChapterId) || dto.ComicId <= 0)
                return BadRequest("Invalid request");

            var comicExists = await _context.Comics.AnyAsync(c => c.ComicId == dto.ComicId);
            if (!comicExists) return NotFound("Internal Comic not found");

            try
            {
                // Parse double chapter number from string (e.g. "12.5") to maintain order.
                // Assuming chapter can be parsed as float, we might just store it as float or int.
                // Given the DB model, ChapterNumber is decimal. Let's see models.
                double chapterNumber = 0;
                if (double.TryParse(dto.ChapterNumberStr, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double parsed))
                {
                    chapterNumber = parsed;
                }

                // Check if chapter already exists to prevent duplicate (basic check by chapterNumber)
                var existingChapter = await _context.Chapters.FirstOrDefaultAsync(c => c.ComicId == dto.ComicId && c.ChapterNumber == chapterNumber);
                if (existingChapter != null)
                {
                    return BadRequest($"Chapter {chapterNumber} already exists in this comic.");
                }

                var imageList = await _mangaDexService.GetChapterImagesAsync(dto.MangaDexChapterId);
                
                if (imageList == null || !imageList.Any())
                {
                    return BadRequest("Bản dịch này là bản quyền hoặc link ngoài (External/Official), không chứa ảnh trên máy chủ MangaDex. Vui lòng chọn nhóm dịch khác!");
                }

                var newChapter = new Chapter
                {
                    ComicId = dto.ComicId,
                    Title = dto.ChapterTitle,
                    ChapterNumber = chapterNumber,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Chapters.Add(newChapter);
                await _context.SaveChangesAsync();

                // Add images
                int order = 1;
                foreach(var url in imageList)
                {
                    var img = new ChapterImage
                    {
                        ChapterId = newChapter.ChapterId,
                        ImageUrl = url,
                        PageOrder = order++
                    };
                    _context.ChapterImages.Add(img);
                }

                await _context.SaveChangesAsync();

                return Ok(new { chapterId = newChapter.ChapterId, message = "Imported successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error importing chapter: {ex.Message}");
            }
        }
    }
}
