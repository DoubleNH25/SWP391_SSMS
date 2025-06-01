

using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;

namespace SMMS.Application.Services.Interfaces
{
	public interface IUserService
	{

		//User Features
		Task<List<UserResponse>> GetAllUsersAsync();
		Task<UserResponse> GetUserByIdAsync(string id);
		Task<bool> CreateUserAsync(UserCreateRequest request);
		Task<bool> UpdateUserAsync(string id, UserUpdateRequest request);
		Task<bool> DeleteUserAsync(string id);
		Task<UserProfileResponse> GetMyProfileAsync(string userId);
		Task<bool> UpdateMyProfileAsync(string userId, UserProfileUpdateRequest request);

		//Student Features
		Task<List<StudentResponse>> GetMyStudentsAsync(string parentId);
		Task<List<StudentResponse>> GetAllStudentsAsync();
		Task<bool> CreateStudentAsync(string parentId, StudentRequest request);
		Task<bool> UpdateStudentAsync(string studentId, string userId, StudentRequest request);
		Task<bool> DeleteStudentAsync(string studentId, string userId);
		Task<List<StudentHealthResponse>> GetMyStudentsHealthProfileAsync(string parentId);
		Task<bool> UpdateHealthProfileByParentAsync(string studentId, HealthProfileRequest request, string parentId);
	}
}
