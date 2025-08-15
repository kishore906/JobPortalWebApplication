using System.Security.Claims;
using System.Text.Json;
using JobPortalWebAPI.CustomActionFilter;
using JobPortalWebAPI.Models.Domain;
using JobPortalWebAPI.Models.DTO;
using JobPortalWebAPI.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace JobPortalWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IUserProfileRepository userProfileRepository;
        private readonly ICompanyUserRepository companyUserRepository;
        private readonly ITokenRepository tokenRepository;

        public AuthController(UserManager<ApplicationUser> userManager, IUserProfileRepository userProfileRepository, ITokenRepository tokenRepository, ICompanyUserRepository companyUserRepository)
        {
            this.userManager = userManager;
            this.userProfileRepository = userProfileRepository;
            this.tokenRepository = tokenRepository;
            this.companyUserRepository = companyUserRepository;
        }

        // POST: /api/Auth/Register
        [HttpPost]
        [Route("Register")]
        [ValidateModel]
        public async Task<IActionResult> Register([FromForm] RegisterUserDTO registerUserDTO) { 
              // Here if ModelState.IsValid is not true -> ValidateModelAttribute class will display the errors related to model validation before continuing 

            // Creating ApplicationUser
            var user = new ApplicationUser
            {
                UserName = registerUserDTO.Email,
                Email = registerUserDTO.Email
            };

            // Inserting IdentityUser into DB
            var identityResult = await userManager.CreateAsync(user, registerUserDTO.Password);

            if (identityResult.Succeeded)
            {
                // Add Role to the registered user
                if(registerUserDTO.Role != null)
                {
                    identityResult = await userManager.AddToRoleAsync(user, registerUserDTO.Role);

                    if (identityResult.Succeeded)
                    {
                        // Creating UserProfile linked to ApplicationUser
                        var profile = new UserProfile
                        {
                            ApplicationUserId = user.Id,
                            FullName = registerUserDTO.FullName,
                            MobileNumber = registerUserDTO.MobileNumber,
                        };

                        var (Success, Message) = await userProfileRepository.CreateAsync(profile, registerUserDTO.ProfileImage);

                        if(!Success)
                        {
                            return BadRequest(new { message = Message });
                        }

                        return StatusCode(StatusCodes.Status201Created, new
                        {
                            message = Message,
                            user = new
                            {
                                id = user.Id,
                                userName = user.UserName,
                                email = user.Email,
                                fullName = profile.FullName,
                                mobileNumber = profile.MobileNumber
                            }
                        });
                    }
                }
            }
            return BadRequest(new { error = "Something went wrong!!" } );
        }

        // POST: /api/Auth/RegisterRecruiter
        [HttpPost]
        [ValidateModel]
        [Route("RegisterRecruiter")]
        public async Task<IActionResult> RegisterRecruiter([FromForm] RegisterCompanyUserDTO registerCompanyUserDTO) {
            // creating company user
            var user = new ApplicationUser
            {
                UserName = registerCompanyUserDTO.Email,
                Email = registerCompanyUserDTO.Email,
            };

            var identityResult = await userManager.CreateAsync(user, registerCompanyUserDTO.Password);

            if (identityResult.Succeeded)
            {
                // adding role to the user
                if(registerCompanyUserDTO.Role != null)
                {
                    identityResult = await userManager.AddToRoleAsync(user, registerCompanyUserDTO.Role);

                    if (identityResult.Succeeded)
                    {
                        // creating company profile
                        var companyProfile = new CompanyProfile
                        {
                            ApplicationUserId = user.Id,
                            CompanyName = registerCompanyUserDTO.CompanyName,
                            CompanyLocation = registerCompanyUserDTO.CompanyLocation,
                        };

                        var (Success, Message) = await companyUserRepository.CreateAsync(companyProfile, registerCompanyUserDTO.CompanyImage);

                        if (!Success) return BadRequest(new { message = Message });

                        return Created("",new
                        {
                            message = Message,
                            companyDetails = new
                            {
                                id = user.Id,
                                email = user.Email,
                                companyName = companyProfile.CompanyName,
                                companyLocation = companyProfile.CompanyLocation,
                            }
                        });
                    }
                }
            }
            return BadRequest(new { error = "Something went wrong!!" });
        }


        // POST: /api/Auth/Login
        [HttpPost]
        [ValidateModel]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
        {
            // check for Email
            var user = await userManager.FindByEmailAsync(loginRequestDTO.Email);

            // Console.WriteLine($"User: Id={user.Id}, UserName={user.UserName}, Email={user.Email}");
             // or
            //string json = JsonSerializer.Serialize(user);
            //Console.WriteLine(json);

            if (user != null)
            {
                // check whether the password matches or not
                var checkPasswordResult = await userManager.CheckPasswordAsync(user, loginRequestDTO.Password);

                if (checkPasswordResult)
                {
                    // Get the role of the loggedIn user
                    var role = await userManager.GetRolesAsync(user);
                    //Console.WriteLine("role: ", role.FirstOrDefault());

                    if (role != null)
                    {
                        // create JWT Token
                        var jwtToken = tokenRepository.CreateJWTToken(user, role.FirstOrDefault());

                        // creating CookieOptions for the token
                        var cookieOptions = new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true, // backend is HTTPS, so Secure=true
                            SameSite = SameSiteMode.None, // allow cross-site cookie
                            Expires = DateTime.UtcNow.AddHours(1)
                            //Expires = DateTime.UtcNow.AddMinutes(10)
                        };

                        // send the token as response in cookie
                        Response.Cookies.Append("jwt_token", jwtToken, cookieOptions);

                        return Ok(new
                        {
                            message = "Login Successful!!",
                            user = new
                            {
                                id = user.Id,
                                userName = user.UserName,
                            }
                        });
                    }
                }
                else
                {
                    return Unauthorized(new { message = "Invalid Email or Password" });
                }
            }
            else
            {
                return Unauthorized(new { message= "Invalid Email or Password"});
            }
                return BadRequest(new { error = "Something went wrong!!" });
        }

        // GET: /api/Auth/GetUser/{id}
        [HttpGet]
        [Route("getUser/{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var user = await userManager.Users.Include(u => u.UserProfile).FirstOrDefaultAsync(u => u.Id == id);

            if(user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    message = "Not Found"
                });
            }

            var role = (await userManager.GetRolesAsync(user)).FirstOrDefault();

            if(role == "User" || role == "Admin")
            {
                return Ok(new UserSummaryDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.UserProfile!.FullName,
                    Location = user.UserProfile.Location,
                    MobileNumber = user.UserProfile.MobileNumber,
                    ProfileImagePath = user.UserProfile.ProfileImagePath
                });
            }
            else
            {
                return Ok(new ReturnCompanyDTO
                {
                    Id = user.Id,
                    CompanyEmail = user.Email,
                    CompanyName = user.CompanyProfile!.CompanyName,
                    CompanyLocation = user.CompanyProfile.CompanyLocation,
                    CompanyImagePath = user.CompanyProfile.CompanyImagePath
                });
            }
        }

        // PUT: /api/auth/UpdateUserProfile
        [HttpPut]
        [ValidateModel]
        [Authorize]
        [Route("UpdateUserProfile")]
        public async Task<IActionResult> UpdateUserProfile([FromForm] UpdateUserDTO updateUserDTO)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Unauthorized();

            var result = await userProfileRepository.UpdateUserAndProfileAsync(userId, updateUserDTO);

            if (!result.Success) return BadRequest(new { error = result.Message } );

            return Ok(new { message = result.Message });
        }

        // PUT: /api/Auth/UpdateCompanyProfile
        [HttpPut]
        [ValidateModel]
        [Route("UpdateCompanyProfile")]
        public async Task<IActionResult> UpdateCompanyProfile([FromForm] UpdateCompanyDTO updateCompanyDTO)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId == null) return Unauthorized();

            var result = await companyUserRepository.UpdateCompanyProfileAsync(userId, updateCompanyDTO);

            if (!result.Success) return BadRequest(new { error = result.Message });

            return Ok(new { message = result.Message } );
        }


        // retrieving loggedIn user profile
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // from token

            var user = await userManager.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound();

            var role = (await userManager.GetRolesAsync(user)).FirstOrDefault();

            if (role == "User" || role == "Admin")
            {
                return Ok(new UserSummaryDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.UserProfile!.FullName,
                    Location = user.UserProfile!.Location,
                    MobileNumber = user.UserProfile.MobileNumber,
                    ProfileImagePath = user.UserProfile.ProfileImagePath
                });
            }
            else
            {
                return Ok(new ReturnCompanyDTO
                {
                    Id = user.Id,
                    CompanyEmail = user.Email,
                    CompanyName = user.CompanyProfile!.CompanyName,
                    CompanyLocation = user.CompanyProfile.CompanyLocation,
                    CompanyImagePath = user.CompanyProfile.CompanyImagePath
                });
            }
        }

        // PUT: /api/Auth/UpdateUserPassword
        [HttpPost]
        [ValidateModel]
        [Authorize]
        [Route("UpdateUserPswd")]
        public async Task<IActionResult> UpdateUserPassword([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            // This is a ClaimsPrincipal from the authenticated request
            //var currentUser = User;

            // Example: get user ID from claims
            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //Console.WriteLine("user id: " + userId);
            
            var result = await userProfileRepository.ChangePasswordAsync(User, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            // Remove token cookie so user must log in again
            Response.Cookies.Delete("jwt_token");

            return Ok(new { message = "Password updated successfully!!" } );
        }

        // PUT: /api/Auth/UpdateUserPassword
        [HttpPost]
        [ValidateModel]
        [Authorize]
        [Route("UpdateCompanyPswd")]
        public async Task<IActionResult> UpdateCompanyPassword([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            // This is a ClaimsPrincipal from the authenticated request
            var currentUser = User;

            // Example: get user ID from claims
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine("user id: " + userId);

            var result = await companyUserRepository.ChangePasswordAsync(User, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            // Remove token cookie so user must log in again
            Response.Cookies.Delete("jwt_token");

            return Ok(new { message = "Password updated successfully!!" });
        }


        [HttpPost("logout")]
        [Authorize] // Only logged-in users can log out
        public IActionResult Logout()
        {
            // Use the same options as when you set the cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,            // Must match original cookie
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(-1) // Expire immediately
            };

            Response.Cookies.Append("jwt_token", "", cookieOptions);

            return Ok(new { message = "Logged out successfully" });
        }
    }
}
