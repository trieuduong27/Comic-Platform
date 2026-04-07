using Microsoft.EntityFrameworkCore;
using ComicPlatform.API.Models;

namespace ComicPlatform.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Comic> Comics { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<ComicGenre> ComicGenres { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<ChapterImage> ChapterImages { get; set; }
        public DbSet<Bookmark> Bookmarks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ComicGenre N-N relationship
            modelBuilder.Entity<ComicGenre>()
                .HasKey(cg => new { cg.ComicId, cg.GenreId });
            
            modelBuilder.Entity<ComicGenre>()
                .HasOne(cg => cg.Comic)
                .WithMany(c => c.ComicGenres)
                .HasForeignKey(cg => cg.ComicId);
                
            modelBuilder.Entity<ComicGenre>()
                .HasOne(cg => cg.Genre)
                .WithMany(g => g.ComicGenres)
                .HasForeignKey(cg => cg.GenreId);

            // Bookmark N-N relationship
            modelBuilder.Entity<Bookmark>()
                .HasKey(b => new { b.UserId, b.ComicId });

            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Bookmark>()
                .HasOne(b => b.Comic)
                .WithMany(c => c.Bookmarks)
                .HasForeignKey(b => b.ComicId);
                
            // Indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
                
            modelBuilder.Entity<Comic>()
                .HasIndex(c => c.Slug)
                .IsUnique();
                
            modelBuilder.Entity<Genre>()
                .HasIndex(g => g.Slug)
                .IsUnique();
                
            modelBuilder.Entity<ChapterImage>()
                .HasIndex(ci => new { ci.ChapterId, ci.PageOrder });
        }
    }
}
