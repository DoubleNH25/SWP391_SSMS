

using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;

namespace SMMS.Application.Services.Interfaces
{
	public interface IVaccinationCampaignService
	{
		Task<List<VaccinationCampaignResponse>> GetAllVaccineCampaignAsync();
		Task<VaccinationCampaignResponse> CreateVaccinationCampaignAsync(VaccinationCampaignRequest request, string nurseId);
		Task<bool> ApproveVaccinationCampaignAsync(string vaccinationCampaignId, string approverId);
		Task<bool> RejectVaccinationCampaignAsync(string vaccinationCampaignId, string approverId);
		Task<List<VaccinationCampaignResponse>> GetRejectVaccinationCampaignsAsync();
		Task<List<VaccinationCampaignResponse>> GetPendingVaccinationCampaignsAsync();
		Task<List<VaccinationCampaignResponse>> GetApprovedVaccinationCampaignsAsync();
		Task<bool> UpdateVaccinationCampaignAsync(string vaccinationCampaignId, VaccinationCampaignRequest request, string userId);
		Task<bool> DeleteVaccinationCampaignAsync(string vaccinationCampaignId, string userId);
	}
}
