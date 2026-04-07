using System;
using System.ComponentModel.DataAnnotations;

namespace ComicPlatform.API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Username { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }
        
        [MaxLength(20)]
        public string Role { get; set; } = "User";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
