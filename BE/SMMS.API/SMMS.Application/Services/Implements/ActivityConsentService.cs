using Microsoft.EntityFrameworkCore;
using SMMS.Application.DataObject.ResponseObject;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;

namespace SMMS.Application.Services.Implements
{
	public class ActivityConsentService : IActivityConsentService
	{
		private readonly IRepositoryManager _repositoryManager;

		public ActivityConsentService(IRepositoryManager repositoryManager)
		{
			_repositoryManager = repositoryManager;
		}

		public async Task<bool> ConfirmActivityConsentAsync(string activityConsentId, bool status, string parentId)
		{
			var consent = _repositoryManager.ConsentRepository
				.FindByCondition(ac => ac.Id == activityConsentId && ac.UserId == parentId, true)
				.FirstOrDefault();
			if (consent == null) return false;

			consent.Status = status;
			consent.LastUpdatedBy = parentId;
			consent.LastUpdatedTime = DateTimeOffset.UtcNow;
			_repositoryManager.ConsentRepository.Update(consent);

			if (status)
			{
				if (consent.HealthActivityId != null)
				{
					var record = new HealthCheckupRecord
					{
						HealthActivityId = consent.HealthActivityId,
						StudentId = consent.StudentId,
						AbnormalNote = "None",
						Vision = "None",
						Hearing = "None",
						BMI = 0.0,
						Dental = "None",
						Time = consent.ScheduleTime,
						CreatedBy = "System",
						CreatedTime = DateTimeOffset.UtcNow
					};
					_repositoryManager.HealthCheckRepository.Create(record);
				}
				else if (consent.VaccinationCampaignId != null)
				{
					var record = new VaccinationRecord
					{
						VaccinationCampaignId = consent.VaccinationCampaignId,
						StudentId = consent.StudentId,
						ResultNote = "None",
						Time = consent.ScheduleTime,
						CreatedBy = "System",
						CreatedTime = DateTimeOffset.UtcNow
					};
					_repositoryManager.VaccinationRecordRepository.Create(record);
				}
			}
			await _repositoryManager.SaveAsync();
			return true;
		}
		public async Task<List<ActivityConsentResponse>> GetConsentsByParentIdAsync(string parentId)
		{
			var consents = _repositoryManager.ConsentRepository
				.FindByCondition(ac => ac.UserId == parentId, false)
				.Include(ac => ac.Student)
				.Include(ac => ac.HealthActivity)
				.Include(ac => ac.VaccinationCampaign)
				.Select(ac => new ActivityConsentResponse
				{
					Id = ac.Id,
					StudentId = ac.StudentId,
					StudentName = ac.Student.FullName,
					ActivityType = ac.ActivityType,
					ActivityId = ac.HealthActivityId ?? ac.VaccinationCampaignId,
					ActivityName = ac.HealthActivity != null ? ac.HealthActivity.Name : ac.VaccinationCampaign.Name,
					Status = ac.Status,
					ScheduleTime = ac.ScheduleTime
				}).ToList();
			return consents;
		}

		public async Task<List<ActivityConsentResponse>> GetConsentsByHAIdAsync(string healthActivityId) //Health Activity
		{
			var consents = _repositoryManager.ConsentRepository
				.FindByCondition(ac => ac.HealthActivityId == healthActivityId, false)
				.Include(ac => ac.Student)
				.Include(ac => ac.HealthActivity)
				.Select(ac => new ActivityConsentResponse
				{
					Id = ac.Id,
					StudentId = ac.StudentId,
					StudentName = ac.Student.FullName,
					ActivityType = "HealthActivity",
					ActivityId = ac.HealthActivityId,
					ActivityName = ac.HealthActivity.Name,
					Status = ac.Status,
					ScheduleTime = ac.ScheduleTime
				}).ToList();
			return consents;
		}

		public async Task<List<ActivityConsentResponse>> GetConsentsByVCIdAsync(string vaccinationCampaignId) //Vaccination Campaign
		{
			var consents = _repositoryManager.ConsentRepository
				.FindByCondition(ac => ac.VaccinationCampaignId == vaccinationCampaignId, false)
				.Include(ac => ac.Student)
				.Include(ac => ac.VaccinationCampaign)
				.Select(ac => new ActivityConsentResponse
				{
					Id = ac.Id,
					StudentId = ac.StudentId,
					StudentName = ac.Student.FullName,
					ActivityType = "VaccinationCampaign",
					ActivityId = ac.VaccinationCampaignId,
					ActivityName = ac.VaccinationCampaign.Name,
					Status = ac.Status,
					ScheduleTime = ac.ScheduleTime
				}).ToList();
			return consents;
		}
	}
}
