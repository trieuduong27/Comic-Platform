using System;

namespace ComicPlatform.API.Models
{
    public class Bookmark
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int ComicId { get; set; }
        public Comic Comic { get; set; }

        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    }
}
