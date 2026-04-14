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
    public class GenresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GenresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/genres
        [HttpGet]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _context.Genres
                .Select(g => new { g.GenreId, g.Name, g.Slug })
                .ToListAsync();

            return Ok(genres);
        }

        // POST: api/genres
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostGenre(Genre genre)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return Ok(genre);
        }
    }
}
