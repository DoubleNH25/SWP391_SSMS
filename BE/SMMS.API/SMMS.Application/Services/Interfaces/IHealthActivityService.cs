using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
namespace SMMS.Application.Services.Interfaces
{
	public interface IHealthActivityService
	{
		Task<HealthActivityResponse> CreateHealthActivityAsync(HealthActivityRequest request, string nurseId);
		Task<bool> ApproveHealthActivityAsync(string healthActivityId, string approverId);
		Task<List<HealthActivityResponse>> GetPendingHealthActivitiesAsync();
		Task<List<HealthActivityResponse>> GetApprovedHealthActivitiesAsync();
		Task<bool> UpdateHealthActivityAsync(string healthActivityId, HealthActivityRequest request, string userId);
		Task<bool> DeleteHealthActivityAsync(string healthActivityId, string userId);
	}
}
