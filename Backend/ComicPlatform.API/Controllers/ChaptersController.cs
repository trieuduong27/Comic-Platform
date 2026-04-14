using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ComicPlatform.API.Data;
using Microsoft.AspNetCore.Authorization;
using ComicPlatform.API.Models;

namespace ComicPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChaptersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChaptersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Chapters/5
        [HttpGet("{id}")]
        [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Client)]
        public async Task<IActionResult> GetChapter(int id)
        {
            var chapter = await _context.Chapters
                .Include(c => c.ChapterImages.OrderBy(img => img.PageOrder))
                .FirstOrDefaultAsync(c => c.ChapterId == id);

            if (chapter == null)
            {
                return NotFound();
            }

            return Ok(chapter);
        }
        // POST: api/Chapters
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostChapter(Chapter chapter)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Chapters.Add(chapter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetChapter), new { id = chapter.ChapterId }, chapter);
        }

        // DELETE: api/Chapters/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteChapter(int id)
        {
            var chapter = await _context.Chapters.FindAsync(id);
            if (chapter == null) return NotFound();

            _context.Chapters.Remove(chapter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Chapters/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutChapter(int id, Chapter chapter)
        {
            if (id != chapter.ChapterId) return BadRequest();

            var existingChapter = await _context.Chapters
                .Include(c => c.ChapterImages)
                .FirstOrDefaultAsync(c => c.ChapterId == id);
            
            if (existingChapter == null) return NotFound();

            existingChapter.Title = chapter.Title;
            existingChapter.ChapterNumber = chapter.ChapterNumber;
            
            _context.ChapterImages.RemoveRange(existingChapter.ChapterImages);
            
            if (chapter.ChapterImages != null && chapter.ChapterImages.Any())
            {
                foreach(var img in chapter.ChapterImages) 
                {
                    img.ImageId = 0; // Ensure EF inserts new
                    img.ChapterId = id;
                    _context.ChapterImages.Add(img);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Chapters.Any(e => e.ChapterId == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }
    }
}
