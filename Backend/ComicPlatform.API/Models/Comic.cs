using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ComicPlatform.API.Models
{
    public class Comic
    {
        [Key]
        public int ComicId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }
        
        [Required]
        [MaxLength(250)]
        public string Slug { get; set; }
        
        public string Description { get; set; }
        
        [MaxLength(2000)]
        public string CoverImage { get; set; }
        
        [MaxLength(20)]
        public string Status { get; set; } = "Ongoing";
        
        public int ViewCount { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<ComicGenre> ComicGenres { get; set; }
        public ICollection<Chapter> Chapters { get; set; }
        public ICollection<Bookmark> Bookmarks { get; set; }
    }
}
