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
        private readonly IPasswordResetRepository passwordResetRepository;

        public AuthController(UserManager<ApplicationUser> userManager, IUserProfileRepository userProfileRepository, ITokenRepository tokenRepository, ICompanyUserRepository companyUserRepository, IPasswordResetRepository passwordResetRepository)
        {
            this.userManager = userManager;
            this.userProfileRepository = userProfileRepository;
            this.tokenRepository = tokenRepository;
            this.companyUserRepository = companyUserRepository;
            this.passwordResetRepository = passwordResetRepository;
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
            return BadRequest(new { error = "Something went wrong" } );
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
            return BadRequest(new { error = "Something went wrong" });
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
                    var roles = await userManager.GetRolesAsync(user);
                    var role = roles.FirstOrDefault();
                    //Console.WriteLine(role);

                    if (role != null)
                    {
                        // create JWT Token
                        var jwtToken = tokenRepository.CreateJWTToken(user, role);

                        var userWithProfile = new ApplicationUser();
                        var companyWithProfile = new ApplicationUser();

                        if(role == "User" || role  == "Admin")
                        {
                            // retrieving user profile
                            userWithProfile = await userManager.Users.Include(u => u.UserProfile).FirstOrDefaultAsync(u => u.Id == user.Id);
                        }
                        else if(role == "Recruiter")
                        {
                            // retrieving company profile
                            companyWithProfile = await userManager.Users.Include(u => u.CompanyProfile).FirstOrDefaultAsync(u => u.Id == user.Id);
                        }
                           

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

                        if(role == "Recruiter")
                        {
                            return Ok(new
                            {
                                message = "Login Successful",
                                user = new
                                {
                                    id = user.Id,
                                    email = user.Email,
                                    companyName = companyWithProfile != null && companyWithProfile.CompanyProfile != null ? companyWithProfile.CompanyProfile.CompanyName : null,
                                    companyImage = companyWithProfile != null && companyWithProfile.CompanyProfile != null && companyWithProfile.CompanyProfile.CompanyImagePath != null ? companyWithProfile.CompanyProfile.CompanyImagePath : null,
                                    role,
                                }
                            });
                        }

                        return Ok(new
                        {
                            message = "Login Successful!!",
                            user = new
                            {
                                id = user.Id,
                                userName = user.UserName,
                                fullName = userWithProfile != null && userWithProfile.UserProfile != null ? userWithProfile.UserProfile.FullName : null,
                                profileImage = userWithProfile != null && userWithProfile.UserProfile != null && userWithProfile.UserProfile.ProfileImagePath != null ? userWithProfile.UserProfile.ProfileImagePath : null,
                                role,
                            }
                        });
                    }
                }
                else
                {
                    return NotFound(new { message = "Invalid Email or Password" });
                }
            }
            else
            {
                return NotFound(new { message= "Invalid Email or Password"});
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

            if (!result.Success && result.Message == "User Not Found") return NotFound(new {message = result.Message});

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

            if (!result.Success && result.Message == "User Not Found") return NotFound(new { message = result.Message });

            if (!result.Success) return BadRequest(new { error = result.Message });

            return Ok(new { message = result.Message } );
        }


        // retrieving loggedIn user profile
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // from token
            var role = User.FindFirstValue(ClaimTypes.Role);
            
            var user = new ApplicationUser();
            Console.WriteLine("role:" + role);
            if(role == "User" || role == "Admin")
            {
                 user = await userManager.Users
                  .Include(u => u.UserProfile)
                  .FirstOrDefaultAsync(u => u.Id == userId);
            }
            else if(role == "Recruiter")
            {
                user = await userManager.Users
                  .Include(u => u.CompanyProfile)
                  .FirstOrDefaultAsync(u => u.Id == userId);

            }

            if (user == null)
                return NotFound(new { message = "User Not Found"});

            //var role = (await userManager.GetRolesAsync(user)).FirstOrDefault();

            if (role == "User" || role == "Admin")
            {
                return Ok(new UserSummaryDTO
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.UserProfile!.FullName,
                    Location = user.UserProfile!.Location,
                    MobileNumber = user.UserProfile.MobileNumber,
                    ProfileImagePath = user.UserProfile.ProfileImagePath,
                    ResumePath = user.UserProfile.ResumeFilePath,
                    Role = role,
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
                    CompanyImagePath = user.CompanyProfile.CompanyImagePath,
                    Role= role,
                });
            }
        }

        // POST: /api/Auth/UpdateUserPswd
        [HttpPost]
        [ValidateModel]
        [Authorize]
        [Route("UpdatePassword")]
        public async Task<IActionResult> UpdatePassword([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            // This is a ClaimsPrincipal from the authenticated request
            //var currentUser = User;

            // Example: get user ID from claims
            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //Console.WriteLine("user id: " + userId);
            
            var result = await userProfileRepository.ChangePasswordAsync(User, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Password change failed", errors = result.Errors.Select(e => e.Description) });
            }

            // Remove token cookie so user must log in again
            Response.Cookies.Delete("jwt_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(-1) // expired in the past (assume)
            });

            return Ok(new { message = "Password updated successfully!!" } );
        }

        // Forgot password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDTO forgotPasswordRequestDTO)
        {
            var (Success, Message) = await passwordResetRepository.ForgotPasswordAsync(forgotPasswordRequestDTO.Email);

            if (!Success) return BadRequest(new { Message });

            return Ok(new { Message });
        }

        // Reset password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDTO resetPasswordRequestDTO)
        {
            // Calling respository method
            var result = await passwordResetRepository.ResetPasswordAsync(resetPasswordRequestDTO.Email, resetPasswordRequestDTO.Token, resetPasswordRequestDTO.NewPassword);

            if(!result.Succeeded)
            {
                // Return 400 Bad Request with errors
                return BadRequest(new
                {
                    success = false,
                    message = "Password reset failed.",
                    errors = result.Errors
                });
            }

            // Return 200 OK with success message
            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        // PUT: /api/Auth/UpdateCompanyPswd
        //[HttpPost]
        //[ValidateModel]
        //[Authorize]
        //[Route("UpdateCompanyPswd")]
        //public async Task<IActionResult> UpdateCompanyPassword([FromBody] ChangePasswordDTO changePasswordDTO)
        //{
        //    var result = await companyUserRepository.ChangePasswordAsync(User, changePasswordDTO.CurrentPassword, changePasswordDTO.NewPassword);

        //    if (!result.Succeeded)
        //    {
        //        return BadRequest(new { message = "Password change failed", errors = result.Errors.Select(e => e.Description) });
        //    }

        //    // Remove token cookie so user must log in again
        //    Response.Cookies.Delete("jwt_token");

        //    return Ok(new { message = "Password updated successfully" });
        //}


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
