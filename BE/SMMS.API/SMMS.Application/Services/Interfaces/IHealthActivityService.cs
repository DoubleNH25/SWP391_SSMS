using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
namespace SMMS.Application.Services.Interfaces
{
	public interface IHealthActivityService
	{
		Task<HealthActivityResponse> CreateHealthActivityAsync(HealthActivityRequest request, string nurseId);
		Task<bool> ApproveHealthActivityAsync(string healthActivityId, string approverId);
		Task<bool> RejectHealthActivityAsync(string healthActivityId, string approverId);
		Task<List<HealthActivityResponse>> GetRejectHealthActivitiesAsync();
		Task<List<HealthActivityResponse>> GetPendingHealthActivitiesAsync();
		Task<List<HealthActivityResponse>> GetApprovedHealthActivitiesAsync();
		Task<List<HealthActivityResponse>> GetAllHealthActivityAsync();
		Task<bool> UpdateHealthActivityAsync(string healthActivityId, HealthActivityRequest request, string userId);
		Task<bool> DeleteHealthActivityAsync(string healthActivityId, string userId);
	}
}
