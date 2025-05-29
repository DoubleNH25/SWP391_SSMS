

using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;

namespace SMMS.Application.Services.Interfaces
{
	public interface IUserService
	{
		Task<List<UserResponse>> GetAllUsersAsync();
		Task<UserResponse> GetUserByIdAsync(string id);
		Task<bool> CreateUserAsync(UserCreateRequest request);
		Task<bool> UpdateUserAsync(string id, UserUpdateRequest request);
		Task<bool> DeleteUserAsync(string id);
		Task<UserProfileResponse> GetMyProfileAsync(string userId);
		Task<bool> UpdateMyProfileAsync(string userId, UserProfileUpdateRequest request);
	}
}
