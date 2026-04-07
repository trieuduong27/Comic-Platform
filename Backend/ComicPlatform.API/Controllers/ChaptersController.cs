using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ComicPlatform.API.Data;

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
    }
}
