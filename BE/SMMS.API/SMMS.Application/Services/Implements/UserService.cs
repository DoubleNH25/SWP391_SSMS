using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
using SMMS.Application.Helpers.Implements;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;

namespace SMMS.Application.Services.Implements
{
	public class UserService : IUserService
	{
		private readonly IRepositoryManager _repositoryManager;
		private readonly CloudinaryService _cloudinaryService;

		public UserService(IRepositoryManager repositoryManager, CloudinaryService cloudinaryService)
		{
			_repositoryManager = repositoryManager;
			_cloudinaryService = cloudinaryService;
		}

		public async Task<List<UserResponse>> GetAllUsersAsync()
		{
			var users = _repositoryManager.UserRepository.FindAll(false)
				.Select(u => new UserResponse
				{
					Id = u.Id,
					Email = u.Email,
					Phone = u.Phone,
					FullName = u.FullName,
					RoleName = u.Role.RoleName
				}).ToList();
			return users;
		}

		public async Task<UserResponse> GetUserByIdAsync(string id)
		{
			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == id, false)
				.Select(u => new UserResponse
				{
					Id = u.Id,
					Email = u.Email,
					Phone = u.Phone,
					FullName = u.FullName,
					RoleName = u.Role.RoleName
				}).FirstOrDefault();
			return user;
		}

		public async Task<bool> CreateUserAsync(UserCreateRequest request)
		{
			var user = new User
			{
				Email = request.Email,
				Phone = request.Phone,
				FullName = request.FullName,
				RoleId = request.RoleId,
				Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
				CreatedBy = "Admin",
				CreatedTime = DateTimeOffset.UtcNow
			};
			_repositoryManager.UserRepository.Create(user);
			await _repositoryManager.SaveAsync();
			return true;
		}

		public async Task<bool> UpdateUserAsync(string id, UserUpdateRequest request)
		{
			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == id, true)
				.FirstOrDefault();
			if (user == null) return false;

			user.Phone = request.Phone;
			user.FullName = request.FullName;
			if (!string.IsNullOrEmpty(request.Password))
				user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
			user.LastUpdatedBy = "Admin";
			user.LastUpdatedTime = DateTimeOffset.UtcNow;

			_repositoryManager.UserRepository.Update(user);
			await _repositoryManager.SaveAsync();
			return true;
		}

		public async Task<bool> DeleteUserAsync(string id)
		{
			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == id, true)
				.FirstOrDefault();
			if (user == null) return false;

			user.DeletedBy = "Admin";
			user.DeletedTime = DateTimeOffset.UtcNow;
			_repositoryManager.UserRepository.Update(user);
			await _repositoryManager.SaveAsync();
			return true;
		}

		public async Task<UserProfileResponse> GetMyProfileAsync(string userId)
		{
			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == userId, false)
				.Select(u => new UserProfileResponse
				{
					Id = u.Id,
					Email = u.Email,
					Phone = u.Phone,
					FullName = u.FullName,
					Image = u.Image
				}).FirstOrDefault();
			return user ?? throw new Exception("User not found");
		}

		public async Task<bool> UpdateMyProfileAsync(string userId, UserProfileUpdateRequest request)
		{
			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == userId, true)
				.FirstOrDefault();
			if (user == null) return false;

			user.FullName = request.FullName;
			user.Phone = request.Phone;

			if (request.Image != null)
			{
				var imageUrl = await _cloudinaryService.UploadImageAsync(request.Image);
				if (!string.IsNullOrEmpty(imageUrl))
				{
					user.Image = imageUrl;
				}
			}

			user.LastUpdatedBy = userId;
			user.LastUpdatedTime = DateTimeOffset.UtcNow;

			_repositoryManager.UserRepository.Update(user);
			await _repositoryManager.SaveAsync();
			return true;
		}
	}
}
