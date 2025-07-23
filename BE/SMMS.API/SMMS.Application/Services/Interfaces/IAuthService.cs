

using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;

namespace SMMS.Application.Services.Interfaces
{
	public interface IAuthService
	{
		Task<AuthResponse> LoginAsync(string email, string password);
        Task<AuthResponse> ValidateGoogleTokenAsync(string email);
		Task<AuthResponse> VerifyPhoneNumberAsync(VerifyPhoneRequest request);
		Task<string> CreateAccountOtpAsync(CreateAccountModelView model);
        Task<string> ForgetPasswordAsync(ForgetPasswordModel model);
        Task<string> VerifyOtpAsync(VerifyOtpRequest request);
        Task<string> ResetPasswordAsync(ResetPasswordRequest request);
        Task<bool> ChechPhoneNumberAsync(string phoneNumber);
    }
}
