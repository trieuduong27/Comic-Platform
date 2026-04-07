namespace ComicPlatform.API.Models
{
    public class ComicGenre
    {
        public int ComicId { get; set; }
        public Comic Comic { get; set; }

        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }
}
