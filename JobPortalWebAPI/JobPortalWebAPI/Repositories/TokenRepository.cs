using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobPortalWebAPI.Models.Domain;
using Microsoft.IdentityModel.Tokens;

namespace JobPortalWebAPI.Repositories
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration configuration;

        public TokenRepository(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string CreateJWTToken(ApplicationUser user, string role)
        {
            // creating claims
            var claims = new List<Claim>();

            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id)); //  here ClaimTypes is static class which has constants like Email, NameIdentifier, Name, Role etc
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim(ClaimTypes.Role, role));

            // Signing the token with secret key for authenticity
            // This creates a security key from your secret string(Jwt: Key in your config).
            // The key is a byte array(converted from your secret string with UTF-8 encoding).
            // This key will be used to sign and verify your JWT tokens to ensure they are authentic and not tampered with.
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

            // Creating Signing credentials
            // with above created secret key and alogorithm to sign the token - here HMAC SHA-256 (a string hash-based signing alogorithm)
            // These credentials tell the token generator how to sign the JWT so it can be validated later.
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the token
            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                //expires: DateTime.UtcNow.AddMinutes(3),
                signingCredentials: credentials);

            //var tokenHandler = new JwtSecurityTokenHandler();
            //string tokenString = tokenHandler.WriteToken(token);
            //Console.WriteLine(tokenString);
            //Console.WriteLine("token valid date: "+ token.ValidTo);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
