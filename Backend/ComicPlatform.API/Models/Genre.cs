using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ComicPlatform.API.Models
{
    public class Genre
    {
        [Key]
        public int GenreId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Slug { get; set; }

        public ICollection<ComicGenre> ComicGenres { get; set; }
    }
}
