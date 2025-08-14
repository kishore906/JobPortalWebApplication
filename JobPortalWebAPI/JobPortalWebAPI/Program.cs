using System.Text;
using JobPortalWebAPI.CustomActionFilter;
using JobPortalWebAPI.Data;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

// Register the Swagger generator
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Optional: Configure Swagger documentation info
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Job Portal Web Application",
        Version = "v1",
        Description = "Full Stack Job Portal Web Application using C# .NET Web API and React.js"
    });
});

// This code configures Entity Framework Core to use a SQL Server database by registering the ApplicationDbContext in DI container with the connection string JobPortalConnectionString from the application's configuration.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("JobPortalConnectionString"));
});

// Adding Repository Services
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<ICompanyUserRepository, CompanyUserRespository>();
builder.Services.AddScoped<IJobRepository, JobRespository>();
builder.Services.AddScoped<IUserJobRepository, UserJobRespository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();

// Adding ApplicationUser (IdentityUser) to DI Container
builder.Services.AddIdentityCore<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddTokenProvider<DataProtectorTokenProvider<ApplicationUser>>("JobPortal")
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configuring Identity options (optional, for password policy etc.)
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
});

// Configuring JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
            ClockSkew = TimeSpan.Zero,  // No buffer time
        };

        // JWT Event handling - token expiry or Invalid or missing token
        options.Events = new JwtBearerEvents
        {
            // Read token from the cookie
            OnMessageReceived = context =>    // 'context' is JwtBearerMessageReceivedContext
            {
                var token = context.Request.Cookies["jwt_token"];

                if (!string.IsNullOrEmpty(token))
                {
                    // Attach token to context so JWT middleware can validate it
                    context.Token = token;

                    // OR  Add the token to the Authorization header as Bearer token
                    //context.Request.Headers.Authorization = $"Bearer {token}";

                    // Log for dev
                    if (builder.Environment.IsDevelopment())
                    {
                        Console.WriteLine($"JWT from cookie: {token}");
                    }
                }
                return Task.CompletedTask;
            },

            // gets triggered when token validation fails
            OnAuthenticationFailed = context =>     // 'context' is JwtBearerAuthenticationFailedContext
            {
                Console.WriteLine("Authentication failed. Exception: " + context.Exception.GetType());
                Console.WriteLine(DateTime.UtcNow);
                if (context.Exception is SecurityTokenExpiredException)
                    {
                    Console.WriteLine("Token expired detected.");
                    context.Response.Headers.Append("Token-Expired", "true"); // modifying response headers
                    }
                   return Task.CompletedTask;
            },

            // called when authentication fails and a 401 Unauthorized is about to return (we can customize the response like below)
            OnChallenge = async context =>   // 'context' is JwtBearerChallengeContext
            {
                Console.WriteLine("OnChallenge triggered");

                context.HandleResponse(); // suppress the default behaviour or stop default 401 response

                // writing customized response
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";

                string message = context.Response.Headers.ContainsKey("Token-Expired")
                    ? "Token expired. Please login again."
                    : "Unauthorized. Invalid or missing token.";

                var response = new { error = "Unauthorized", message };
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
            }
        };
    });

// Registering the CustomActionFilter which centralize your model validation error handling and send back your custom error format automatically
builder.Services.AddControllers(options =>
{
    // Custom Class that centarlizes the validation errors
    options.Filters.Add<ValidateModelAttribute>();
})
.ConfigureApiBehaviorOptions(options =>
{
    // Disable default automatic validation error response
    options.SuppressModelStateInvalidFilter = true;
});

// adding CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5000") // React app
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // crucial for cookies
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Code for serving static files (in this case from Images folder) from API
// we need to declare this because we don't have wwwroot folder in the project to serve static files
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
    RequestPath = "/Uploads"
});

app.MapControllers();

app.Run();
