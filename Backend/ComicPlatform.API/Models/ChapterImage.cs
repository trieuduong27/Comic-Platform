using System.ComponentModel.DataAnnotations;

namespace ComicPlatform.API.Models
{
    public class ChapterImage
    {
        [Key]
        public int ImageId { get; set; }
        
        public int ChapterId { get; set; }
        public Chapter Chapter { get; set; }

        [Required]
        [MaxLength(2000)]
        public string ImageUrl { get; set; }
        
        public int PageOrder { get; set; }
    }
}
