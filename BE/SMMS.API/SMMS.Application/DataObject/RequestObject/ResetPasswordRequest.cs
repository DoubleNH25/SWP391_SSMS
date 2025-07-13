namespace SMMS.Application.DataObject.RequestObject
{
    public class ResetPasswordRequest
    {
        public string Email { get; set; } = null!;
        public string ResetToken { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string VerifyPassword { get; set; } = null!;
    }
}
