using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ComicPlatform.API.Data;
using ComicPlatform.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace ComicPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComicsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComicsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Comics  (home - sorted by viewcount)
        [HttpGet]
        public async Task<IActionResult> GetComics([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var total = await _context.Comics.CountAsync();
            var comics = await _context.Comics
                .OrderByDescending(c => c.ViewCount)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { total, data = comics });
        }

        // GET: api/Comics/latest  (newest by CreatedAt)
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var total = await _context.Comics.CountAsync();
            var comics = await _context.Comics
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { total, data = comics });
        }

        // GET: api/Comics/by-genre/{genreId}
        [HttpGet("by-genre/{genreId}")]
        public async Task<IActionResult> GetByGenre(int genreId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var total = await _context.ComicGenres.Where(cg => cg.GenreId == genreId).CountAsync();
            var comics = await _context.ComicGenres
                .Where(cg => cg.GenreId == genreId)
                .Include(cg => cg.Comic)
                .OrderByDescending(cg => cg.Comic.ViewCount)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(cg => cg.Comic)
                .ToListAsync();

            return Ok(new { total, data = comics });
        }

        // GET: api/Comics/5
        [HttpGet("{id}")]
        [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Client)]
        public async Task<IActionResult> GetComic(int id)
        {
            var comic = await _context.Comics
                .Include(c => c.Chapters)
                .Include(c => c.ComicGenres)
                .ThenInclude(cg => cg.Genre)
                .FirstOrDefaultAsync(c => c.ComicId == id);

            if (comic == null)
                return NotFound();

            return Ok(comic);
        }
        // POST: api/Comics
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostComic(Comic comic)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Comics.Add(comic);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComic), new { id = comic.ComicId }, comic);
        }

        // PUT: api/Comics/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutComic(int id, Comic comic)
        {
            if (id != comic.ComicId) return BadRequest();

            _context.Entry(comic).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ComicExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Comics/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteComic(int id)
        {
            var comic = await _context.Comics.FindAsync(id);
            if (comic == null) return NotFound();

            _context.Comics.Remove(comic);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ComicExists(int id)
        {
            return _context.Comics.Any(e => e.ComicId == id);
        }
    }
}
