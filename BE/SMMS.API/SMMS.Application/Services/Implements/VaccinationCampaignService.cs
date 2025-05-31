

using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;

namespace SMMS.Application.Services.Implements
{
	public class VaccinationCampaignService : IVaccinationCampaignService
	{
		private readonly IRepositoryManager _repositoryManager;

		public VaccinationCampaignService(IRepositoryManager repositoryManager)
		{
			_repositoryManager = repositoryManager;
		}

		public async Task<VaccinationCampaignResponse> CreateVaccinationCampaignAsync(VaccinationCampaignRequest request, string nurseId)
		{
			var campaign = new VaccinationCampaign
			{
				Name = request.Name,
				VaccineName = request.VaccineName,
				EXP = request.EXP,
				MFG = request.MFG,
				VaccineType = request.VaccineType,
				StartDate = request.StartDate,
				IsAccepted = false,
				CreatedBy = nurseId,
				CreatedTime = DateTimeOffset.UtcNow
			};
			_repositoryManager.VaccinationCampaignRepository.Create(campaign);
			await _repositoryManager.SaveAsync();
			return new VaccinationCampaignResponse
			{
				Id = campaign.Id,
				Name = campaign.Name,
				VaccineName = campaign.VaccineName,
				EXP = campaign.EXP,
				MFG = campaign.MFG,
				VaccineType = campaign.VaccineType,
				StartDate = campaign.StartDate,
				IsAccepted = campaign.IsAccepted
			};
		}

		public async Task<bool> ApproveVaccinationCampaignAsync(string vaccinationCampaignId, string approverId)
		{
			var campaign = _repositoryManager.VaccinationCampaignRepository
				.FindByCondition(vc => vc.Id == vaccinationCampaignId, true)
				.FirstOrDefault();
			if (campaign == null) return false;

			campaign.IsAccepted = true;
			campaign.LastUpdatedBy = approverId;
			campaign.LastUpdatedTime = DateTimeOffset.UtcNow;
			_repositoryManager.VaccinationCampaignRepository.Update(campaign);
			await CreateActivityConsentsAsync(campaign);
			await _repositoryManager.SaveAsync();
			return true;
		}

		private async Task CreateActivityConsentsAsync(VaccinationCampaign campaign)
		{
			var students = _repositoryManager.StudentRepository.FindAll(false).ToList();
			foreach (var student in students)
			{
				var consent = new ActivityConsent
				{
					StudentId = student.Id,
					UserId = student.ParentId,
					VaccinationCampaignId = campaign.Id,
					HealthActivityId = null,
					Status = false,
					CreatedBy = "System",
					CreatedTime = DateTimeOffset.UtcNow,
					ActivityType = "VaccinationCampaign"
				};
				_repositoryManager.ConsentRepository.Create(consent);
			}
		}
		public async Task<List<VaccinationCampaignResponse>> GetPendingVaccinationCampaignsAsync()
		{
			return _repositoryManager.VaccinationCampaignRepository
				.FindByCondition(vc => !vc.IsAccepted, false)
				.Select(vc => new VaccinationCampaignResponse
				{
					Id = vc.Id,
					Name = vc.Name,
					VaccineName = vc.VaccineName,
					EXP = vc.EXP,
					MFG = vc.MFG,
					VaccineType = vc.VaccineType,
					StartDate = vc.StartDate,
					IsAccepted = vc.IsAccepted
				}).ToList();
		}

		public async Task<List<VaccinationCampaignResponse>> GetApprovedVaccinationCampaignsAsync()
		{
			return _repositoryManager.VaccinationCampaignRepository
				.FindByCondition(vc => vc.IsAccepted, false)
				.Select(vc => new VaccinationCampaignResponse
				{
					Id = vc.Id,
					Name = vc.Name,
					VaccineName = vc.VaccineName,
					EXP = vc.EXP,
					MFG = vc.MFG,
					VaccineType = vc.VaccineType,
					StartDate = vc.StartDate,
					IsAccepted = vc.IsAccepted
				}).ToList();
		}

		public async Task<bool> UpdateVaccinationCampaignAsync(string vaccinationCampaignId, VaccinationCampaignRequest request, string userId)
		{
			var campaign = _repositoryManager.VaccinationCampaignRepository
				.FindByCondition(vc => vc.Id == vaccinationCampaignId && !vc.IsAccepted, true)
				.FirstOrDefault();
			if (campaign == null) return false;

			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == userId, false).FirstOrDefault();
			if (campaign.CreatedBy != userId && user.Role.RoleName != "Admin" && user.Role.RoleName != "Manager")
			{
				return false;
			}

			campaign.Name = request.Name;
			campaign.VaccineName = request.VaccineName;
			campaign.EXP = request.EXP;
			campaign.MFG = request.MFG;
			campaign.VaccineType = request.VaccineType;
			campaign.StartDate = request.StartDate;
			campaign.LastUpdatedBy = userId;
			campaign.LastUpdatedTime = DateTimeOffset.UtcNow;
			_repositoryManager.VaccinationCampaignRepository.Update(campaign);
			await _repositoryManager.SaveAsync();
			return true;
		}

		public async Task<bool> DeleteVaccinationCampaignAsync(string vaccinationCampaignId, string userId)
		{
			var campaign = _repositoryManager.VaccinationCampaignRepository
				.FindByCondition(vc => vc.Id == vaccinationCampaignId && !vc.IsAccepted, true)
				.FirstOrDefault();
			if (campaign == null) return false;

			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == userId, false).FirstOrDefault();
			if (campaign.CreatedBy != userId && user.Role.RoleName != "Admin" && user.Role.RoleName != "Manager")
			{
				return false;
			}

			campaign.DeletedBy = userId;
			campaign.DeletedTime = DateTimeOffset.UtcNow;
			_repositoryManager.VaccinationCampaignRepository.Update(campaign);
			await _repositoryManager.SaveAsync();
			return true;
		}
	}
}
