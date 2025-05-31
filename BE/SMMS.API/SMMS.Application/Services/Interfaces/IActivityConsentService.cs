using SMMS.Application.DataObject.ResponseObject;

namespace SMMS.Application.Services.Interfaces
{
	public interface IActivityConsentService
	{
		Task<bool> ConfirmActivityConsentAsync(string activityConsentId, bool status, string parentId);
		Task<List<ActivityConsentResponse>> GetActivityConsentsByParentIdAsync(string parentId);
		Task<List<ActivityConsentResponse>> GetActivityConsentsByHealthActivityIdAsync(string healthActivityId);
		Task<List<ActivityConsentResponse>> GetActivityConsentsByVaccinationCampaignIdAsync(string vaccinationCampaignId);
	}
}
