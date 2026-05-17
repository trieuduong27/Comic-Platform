using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ComicPlatform.API.Data;
using ComicPlatform.API.Models;
using BCrypt.Net;

namespace ComicPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                return StatusCode(409, new { 
                    status = "error", 
                    message = "Tên tài khoản này đã tồn tại. Vui lòng chọn một tên khác.",
                    code = "USERNAME_ALREADY_EXISTS"
                });

            var newUser = new User
            {
                Username = user.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash),
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };
            
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                status = "success",
                message = "Đăng ký tài khoản thành công.",
                data = new
                {
                    user = new 
                    {
                        id = newUser.UserId.ToString(),
                        username = newUser.Username,
                        createdAt = newUser.CreatedAt
                    }
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginUser.Username);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.PasswordHash, user.PasswordHash))
                return Unauthorized(new { 
                    status = "error", 
                    message = "Tên tài khoản hoặc mật khẩu không chính xác.",
                    code = "INVALID_CREDENTIALS"
                });

            var token = GenerateJwtToken(user);

            return Ok(new 
            { 
                status = "success",
                message = "Đăng nhập thành công.",
                data = new 
                {
                    user = new 
                    {
                        id = user.UserId.ToString(), 
                        username = user.Username, 
                        role = user.Role 
                    },
                    tokens = new
                    {
                        accessToken = token,
                        expiresIn = 7 * 24 * 60 * 60 // 7 days in seconds
                    }
                }
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var keyStr = jwtSettings["Key"];
            if (string.IsNullOrEmpty(keyStr))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
