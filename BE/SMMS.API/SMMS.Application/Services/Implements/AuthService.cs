
using FirebaseAdmin.Auth;
using Microsoft.EntityFrameworkCore;
using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
using SMMS.Application.Helpers.Implements;
using SMMS.Application.Helpers.Interface;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;
using System.Reflection.Metadata;

namespace SMMS.Application.Services.Implements
{
	public class AuthService : IAuthService
	{
		private readonly IRepositoryManager _repositoryManager;
		private readonly IJwtTokenGenerator _jwtTokenGenerator;
		private readonly CloudinaryService _cloudinaryService;
		private readonly SendMailService _sendMailService;
		private readonly IRedisCacheService _redisCacheService;

		public AuthService(IRepositoryManager repositoryManager, IJwtTokenGenerator jwtTokenGenerator,
			SendMailService sendMailService, IRedisCacheService redisCacheService)
		{
			_repositoryManager = repositoryManager;
			_jwtTokenGenerator = jwtTokenGenerator;
			_sendMailService = sendMailService;
			_redisCacheService = redisCacheService;
		}
		public async Task<AuthResponse> LoginAsync(string email, string password)
		{
			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Email == email, false)
				.Include(u => u.Role)
				.FirstOrDefault();
			if (user == null)
			{
				Console.WriteLine($"User not found for email: {email}");
				throw new Exception("Invalid credentials");
			}
			Console.WriteLine($"User found: {user.Id}, Role: {user.Role?.RoleName}");
			//if (user.Role.RoleName == "Parent")
			//{
			//	Console.WriteLine("Parent Cannot Login With Email Or Password");
			//	throw new Exception("Parent Cannot Login With Email Or Password");
			//}
			var passwordVerified = BCrypt.Net.BCrypt.Verify(password, user.Password);
			Console.WriteLine($"Password verified: {passwordVerified}");
			if (!passwordVerified)
			{
				throw new Exception("Invalid credentials");
			}

			var token = _jwtTokenGenerator.GenerateToken(user);
			return new AuthResponse { Token = token, UserId = user.Id };
		}

		private async Task<string?> VerifyFirebasePhoneTokenAsync(string idToken)
		{
			try
			{
				var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
				if (decodedToken.Claims.TryGetValue("phone_number", out var phoneObj))
					return phoneObj?.ToString();

				return null;
			}
			catch
			{
				return null;
			}
		}

		public async Task<AuthResponse> VerifyPhoneNumberAsync(VerifyPhoneRequest request)
		{
			try
			{
				var verifiedPhone = await VerifyFirebasePhoneTokenAsync(request.IdToken);
				if (verifiedPhone == null)
				{
					throw new Exception("Xác thực OTP không hợp lệ hoặc không khớp số điện thoại.");
				}

				string normalizedPhoneNumber = verifiedPhone;
				if (normalizedPhoneNumber.StartsWith("+84"))
				{
					normalizedPhoneNumber = string.Concat("0", normalizedPhoneNumber.AsSpan(3));
				}

				var user = _repositoryManager.UserRepository.FindByCondition(u => u.Phone == normalizedPhoneNumber, false)
					.Include(u => u.Role)
					.FirstOrDefault();
				if (user == null)
				{
					throw new Exception("Invalid credentials");
				}
				var token = _jwtTokenGenerator.GenerateToken(user);

				return new AuthResponse { Token = token, UserId = user.Id };
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		public async Task<string> CreateAccountOtpAsync(CreateAccountModelView model)
		{
			try
			{
				// xac thuc id token lan 2
				var verifiedPhone = await VerifyFirebasePhoneTokenAsync(model.IdToken);
				var normalizedPhone = string.Concat("+84", model.PhoneNumber.AsSpan(1));
				if (verifiedPhone == null || verifiedPhone != normalizedPhone)
				{
					throw new Exception("Xác thực OTP không hợp lệ hoặc không khớp số điện thoại.");
				}

				// kiem tra email da co hay chua
				var existingEmail = _repositoryManager.UserRepository
					.FindByCondition(u => u.Email == model.Email, false)
					.FirstOrDefault();

				if (existingEmail != null)
				{
					throw new Exception("Email already in use");
				}

				// Tạo user mới
				var role = _repositoryManager.RoleRepository
					.FindByCondition(r => r.RoleName == "User", false)
					.FirstOrDefault();
				var user = new User
				{
					Id = Guid.NewGuid().ToString(),
					RoleId = role.Id,
					Email = model.Email,
					Phone = model.PhoneNumber,
					FullName = model.FullName,
					Image = await _cloudinaryService.UploadImageAsync(model.Image),
					Password = BCrypt.Net.BCrypt.HashPassword(model.Password),
					CreatedTime = DateTime.Now,
				};
				user.CreatedBy = user.Id.ToString();

				_repositoryManager.UserRepository.Create(user);
				await _repositoryManager.SaveAsync();

				return "Success";
			}
			catch (Exception ex)
			{
				throw new Exception($"Error: {ex.Message}");
			}
		}

		public async Task<string> ForgetPasswordAsync(ForgetPasswordModel model)
		{
			try
			{
				var userExists = _repositoryManager.UserRepository
					.FindByCondition(u => u.Email == model.Email, false)
					.FirstOrDefault();

				if (userExists == null)
				{
					return "Email không tồn tại trong hệ thống";
				}

				await _sendMailService.SendOtpAsync(model.Email);

				return "Gửi OTP thành công";
			}
			catch (Exception ex)
			{
				throw new Exception($"Lỗi: {ex.Message}");
			}
		}

		public async Task<string> VerifyOtpAsync(VerifyOtpRequest request)
		{
			try
			{
				string otpKey = $"otp:{request.Email}";
				string? cachedOtp = await _redisCacheService.GetAsync(otpKey);

				if (string.IsNullOrEmpty(cachedOtp))
					throw new Exception("OTP đã hết hạn hoặc chưa được gửi.");

				if (cachedOtp != request.Otp)
					throw new Exception("Mã OTP không đúng.");

				// OTP đúng → xoá OTP khỏi Redis
				await _redisCacheService.RemoveAsync(otpKey);

				// Sinh reset token và lưu vào Redis trong 15 phút
				string resetToken = Guid.NewGuid().ToString();
				string tokenKey = $"reset-token:{request.Email}";
				await _redisCacheService.SetAsync(tokenKey, resetToken, TimeSpan.FromMinutes(15));

				return resetToken;
			}
			catch (Exception ex)
			{
				throw new Exception($"Lỗi: {ex.Message}");
			}
		}

		public async Task<string> ResetPasswordAsync(ResetPasswordRequest request)
		{
			try
			{
				string tokenKey = $"reset-token:{request.Email}";
				var tokenInRedis = await _redisCacheService.GetAsync(tokenKey);

				if (tokenInRedis == null || tokenInRedis != request.ResetToken)
					throw new Exception("Token không hợp lệ hoặc đã hết hạn.");

				if (request.NewPassword != request.VerifyPassword)
					throw new Exception("Mật khẩu xác nhận không khớp với mật khẩu mới.");

				// Tìm user theo email
				var user = _repositoryManager.UserRepository
						 .FindByCondition(u => u.Email == request.Email && !u.DeletedTime.HasValue, false)
						 .FirstOrDefault();
				if (user == null)
					throw new Exception("Người dùng không tồn tại.");

				// Hash mật khẩu mới bằng BCrypt
				user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
				user.LastUpdatedTime = DateTime.Now;
				user.LastUpdatedBy = user.Id;
				_repositoryManager.UserRepository.Update(user);
				await _repositoryManager.SaveAsync();

				// Xoá reset-token sau khi dùng
				await _redisCacheService.RemoveAsync(tokenKey);

				return "Reset Password successfully";
			}
			catch (Exception ex)
			{
				throw new Exception($"Lỗi: {ex.Message}");
			}
		}


	}
}