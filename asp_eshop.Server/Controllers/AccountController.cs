using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace asp_eshop.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginModel model, [FromServices] AppDbContext dbContext)
    {
        var user = dbContext.Users.SingleOrDefault(u => u.Username == model.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid credentials.");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY")!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("JWT_ISSUER"),
            audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterModel model, [FromServices] AppDbContext dbContext)
    {
        if (dbContext.Users.Any(u => u.Username == model.Username))
        {
            return BadRequest("User already exists.");
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);
        var user = new User
        {
            Username = model.Username,
            PasswordHash = hashedPassword,
            Role = "User"
        };

        dbContext.Users.Add(user);
        dbContext.SaveChanges();

        return Ok("User registered successfully.");
    }


}

public class LoginModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class RegisterModel
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Role { get; set; }
}
