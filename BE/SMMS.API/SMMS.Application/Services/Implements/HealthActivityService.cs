

using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;

namespace SMMS.Application.Services.Implements
{
	public class HealthActivityService : IHealthActivityService
	{
		private readonly IRepositoryManager _repositoryManager;

		public HealthActivityService(IRepositoryManager repositoryManager)
		{
			_repositoryManager = repositoryManager;
		}

		public async Task<HealthActivityResponse> CreateHealthActivityAsync(HealthActivityRequest request, string nurseId)
		{
			var healthActivity = new HealthActivity
			{
				UserId = nurseId,
				Name = request.Name,
				Description = request.Description,
				ScheduledDate = request.ScheduledDate,
				IsAccepted = false,
				CreatedBy = nurseId,
				CreatedTime = DateTimeOffset.UtcNow
			};
			_repositoryManager.HealthActivityRepository.Create(healthActivity);
			await _repositoryManager.SaveAsync();
			return new HealthActivityResponse
			{
				Id = healthActivity.Id,
				Name = healthActivity.Name,
				Description = healthActivity.Description,
				ScheduledDate = healthActivity.ScheduledDate,
				IsAccepted = healthActivity.IsAccepted
			};
		}

		public async Task<bool> ApproveHealthActivityAsync(string healthActivityId, string approverId)
		{
			var healthActivity = _repositoryManager.HealthActivityRepository
				.FindByCondition(ha => ha.Id == healthActivityId, true)
				.FirstOrDefault();
			if (healthActivity == null) return false;

			healthActivity.IsAccepted = true;
			healthActivity.LastUpdatedBy = approverId;
			healthActivity.LastUpdatedTime = DateTimeOffset.UtcNow;
			_repositoryManager.HealthActivityRepository.Update(healthActivity);
			await CreateActivityConsentsAsync(healthActivity);
			await _repositoryManager.SaveAsync();
			return true;
		}

		private async Task CreateActivityConsentsAsync(HealthActivity healthActivity)
		{
			var students = _repositoryManager.StudentRepository.FindAll(false).ToList();
			foreach (var student in students)
			{
				var consent = new ActivityConsent
				{
					StudentId = student.Id,
					UserId = student.ParentId,
					HealthActivityId = healthActivity.Id,
					VaccinationCampaignId = null,
					Status = false,
					Comments = "none",
					ScheduleTime = healthActivity.ScheduledDate,
					CreatedBy = "System",
					CreatedTime = DateTimeOffset.UtcNow,
					ActivityType = "HealthActivity"
				};
				_repositoryManager.ConsentRepository.Create(consent);
			}
		}

		public async Task<List<HealthActivityResponse>> GetPendingHealthActivitiesAsync()
		{
			return _repositoryManager.HealthActivityRepository
				.FindByCondition(ha => !ha.IsAccepted, false)
				.Select(ha => new HealthActivityResponse
				{
					Id = ha.Id,
					Name = ha.Name,
					Description = ha.Description,
					ScheduledDate = ha.ScheduledDate,
					IsAccepted = ha.IsAccepted
				}).ToList();
		}
		public async Task<List<HealthActivityResponse>> GetApprovedHealthActivitiesAsync()
		{
			return _repositoryManager.HealthActivityRepository
				.FindByCondition(ha => ha.IsAccepted, false)
				.Select(ha => new HealthActivityResponse
				{
					Id = ha.Id,
					Name = ha.Name,
					Description = ha.Description,
					ScheduledDate = ha.ScheduledDate,
					IsAccepted = ha.IsAccepted
				}).ToList();
		}

		public async Task<List<HealthActivityResponse>> GetAllHealthActivityAsync()
		{
			return _repositoryManager.HealthActivityRepository
				.FindAll(false)
				.Select(ha => new HealthActivityResponse
				{
					Id = ha.Id,
					Name = ha.Name,
					Description = ha.Description,
					ScheduledDate = ha.ScheduledDate,
					IsAccepted = ha.IsAccepted
				}).ToList();
		}
		public async Task<bool> UpdateHealthActivityAsync(string healthActivityId, HealthActivityRequest request, string userId)
		{
			var activity = _repositoryManager.HealthActivityRepository
				.FindByCondition(ha => ha.Id == healthActivityId && !ha.IsAccepted, true)
				.FirstOrDefault();
			if (activity == null) return false;

			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == userId, false).FirstOrDefault();
			if (activity.UserId != userId && user.Role.RoleName != "Admin" && user.Role.RoleName != "Manager")
			{
				return false;
			}

			activity.Name = request.Name;
			activity.Description = request.Description;
			activity.ScheduledDate = request.ScheduledDate;
			activity.LastUpdatedBy = userId;
			activity.LastUpdatedTime = DateTimeOffset.UtcNow;
			_repositoryManager.HealthActivityRepository.Update(activity);
			await _repositoryManager.SaveAsync();
			return true;
		}

		public async Task<bool> DeleteHealthActivityAsync(string healthActivityId, string userId)
		{
			var activity = _repositoryManager.HealthActivityRepository
				.FindByCondition(ha => ha.Id == healthActivityId && !ha.IsAccepted, true)
				.FirstOrDefault();
			if (activity == null) return false;

			var user = _repositoryManager.UserRepository.FindByCondition(u => u.Id == userId, false).FirstOrDefault();
			if (activity.UserId != userId && user.Role.RoleName != "Admin" && user.Role.RoleName != "Manager")
			{
				return false;
			}

			activity.DeletedBy = userId;
			activity.DeletedTime = DateTimeOffset.UtcNow;
			_repositoryManager.HealthActivityRepository.Update(activity);
			await _repositoryManager.SaveAsync();
			return true;
		}
	}
}
