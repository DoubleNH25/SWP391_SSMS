using SMMS.Application.DataObject.ResponseObject;

namespace SMMS.Application.Services.Interfaces
{
	public interface IActivityConsentService
	{
		Task<bool> ConfirmActivityConsentAsync(string activityConsentId, bool status, string parentId);
		Task<List<ActivityConsentResponse>> GetConsentsByParentIdAsync(string parentId);
		Task<List<ActivityConsentResponse>> GetConsentsByHAIdAsync(string healthActivityId); //Health Activity
		Task<List<ActivityConsentResponse>> GetConsentsByVCIdAsync(string vaccinationCampaignId); //Vaccination Campaign
	}
}
