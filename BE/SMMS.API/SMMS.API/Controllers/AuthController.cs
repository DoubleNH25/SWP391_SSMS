using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.Services.Interfaces;

namespace SMMS.API.Controllers
{
	[ApiController]
	[Route("api/auth")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("login")]
		[AllowAnonymous]
		public async Task<IActionResult> Login([FromBody] LoginRequest request)
		{
			if (string.IsNullOrWhiteSpace(request.Email))
			{
				return BadRequest("Email is required.");
			}
			if (string.IsNullOrWhiteSpace(request.Password))
			{
				return BadRequest("Password is required.");
			}
			var response = await _authService.LoginAsync(request.Email, request.Password);
			return Ok(response);
		}

        [HttpPost("verify-phonenumber")]
        public async Task<IActionResult> VerifyPhoneNumber(VerifyPhoneRequest request)
        {
            var checker = await _authService.VerifyPhoneNumberAsync(request);

            return Ok(checker);
        }

        [HttpPost("create-account")]
        public async Task<IActionResult> CreateAccount(CreateAccountModelView model)
        {
            var checker = await _authService.CreateAccountOtpAsync(model);

            return Ok(checker);
        }

        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordModel model)
        {
            var checker = await _authService.ForgetPasswordAsync(model);

            return Ok(checker);
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpRequest model)
        {
            var checker = await _authService.VerifyOtpAsync(model);

            return Ok(checker);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
        {
            var checker = await _authService.ResetPasswordAsync(model);

            return Ok(checker);
        }

        [HttpPost("login-google")]
        public async Task<IActionResult> LoginGoogle([FromBody]TokenRequest email)
        {
            var checker = await _authService.ValidateGoogleTokenAsync(email.email);

            return Ok(checker);
        }

        [HttpPost("check-phone")]
        public async Task<IActionResult> CheckPhoneNumber(string phone)
        {
            var checker = await _authService.ChechPhoneNumberAsync(phone);

            return Ok(checker);
        }

    }
}
