using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ComicPlatform.API.Models
{
    public class Chapter
    {
        [Key]
        public int ChapterId { get; set; }
        
        public int ComicId { get; set; }
        public Comic Comic { get; set; }

        public double ChapterNumber { get; set; }
        
        [MaxLength(200)]
        public string Title { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ChapterImage> ChapterImages { get; set; }
    }
}
