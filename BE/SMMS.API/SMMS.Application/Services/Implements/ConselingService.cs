using SMMS.Application.DataObject.ResponseObject;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Entity;
using SMMS.Domain.Enum;
using SMMS.Domain.Interface.Repositories;

namespace SMMS.Application.Services.Implements
{
	public class ConselingService : IConselingService
	{
		private readonly IRepositoryManager _repositoryManager;
		private readonly INotificationService _notificationService;

		public ConselingService(IRepositoryManager repositoryManager, INotificationService notificationService)
		{
			_repositoryManager = repositoryManager;
			_notificationService = notificationService;
		}

		public async Task<bool> RequestConselingScheduleAsync(string studentId, string healthCheckupId, DateTime requestedDate, string note)
		{
			var student = _repositoryManager.StudentRepository
				.FindByCondition(s => s.Id == studentId, false)
				.FirstOrDefault();
			if (student == null) return false;

			var healthCheckup = _repositoryManager.HealthCheckRepository
				.FindByCondition(hcr => hcr.Id == healthCheckupId, false)
				.FirstOrDefault();
			if (healthCheckup == null) return false;

			var healthActivity = _repositoryManager.HealthActivityRepository
				.FindByCondition(ha => ha.Id == healthCheckup.HealthActivityId, false)
				.FirstOrDefault();
			if (healthActivity == null) return false;

			var nurseId = healthActivity.UserId;

			var schedule = new ConselingSchedule
			{
				StudentId = studentId,
				ParentId = student.ParentId,
				MedicalStaffId = nurseId,
				HealthCheckupId = healthCheckupId,
				MeetingDate = requestedDate,
				Note = note,
				Status = ApprovalStatus.Pending,
				CreatedBy = nurseId,
				CreatedTime = DateTimeOffset.UtcNow
			};
			_repositoryManager.ConselingRepository.Create(schedule);

			//// Notify Nurse//////////////////////////////
			//await _notificationService.CreateNotificationAsync(
			//	schedule.MedicalStaffId,
			//	"New Counseling Schedule Request",
			//	$"Parent of {student.StudentCode}-{student.FullName} has requested a counseling session."
			//	,schedule.Id
			//);

			// Notify Parent/////////////////////////////
			await _notificationService.CreateNotificationAsync(
				schedule.ParentId,
				"Yêu cầu tư vấn",
				$"Lịch tư vấn cho con của bạn: {student.StudentCode}-{student.FullName}. Hãy đồng ý hoặc từ chối yêu cầu",
				schedule.Id
			);


			await _repositoryManager.SaveAsync();
			return true;
		}
		public async Task<bool> UpdateScheduleStatusAsync(string conselingScheduleId, ApprovalStatus status, string parentId, string? parentRejectNote)
		{
			var schedule = _repositoryManager.ConselingRepository
				.FindByCondition(cs => cs.Id == conselingScheduleId && cs.ParentId == parentId, true)
				.FirstOrDefault();
			if (schedule == null) return false;

			schedule.Status = status;
			if (status == ApprovalStatus.Rejected)
			{
				schedule.ParentRejectNote = parentRejectNote;
			}
			schedule.LastUpdatedBy = parentId;
			schedule.LastUpdatedTime = DateTimeOffset.UtcNow;
			_repositoryManager.ConselingRepository.Update(schedule);

			// Notify Nurse//////////////////////////////////////////
			var message = status == ApprovalStatus.Approved
				? $"Yêu cầu tư vấn đã được đồng ý. Lịch hẹn vào ngày: {schedule.MeetingDate}."
				: "Yêu cầu tư vấn đã bị từ chối.";
			await _notificationService.CreateNotificationAsync(
				schedule.MedicalStaffId,
				$"Lịch tư vấn - {status}",
				message, schedule.MedicalStaffId
			);

			await _repositoryManager.SaveAsync();
			return true;
		}
		public async Task<List<ConselingResponse>> GetSchedulesByNIdAsync(string nurseId)
		{
			var schedules = _repositoryManager.ConselingRepository
				.FindByCondition(cs => cs.MedicalStaffId == nurseId, false)
				.ToList();
			var responses = new List<ConselingResponse>();
			foreach (var schedule in schedules)
			{
				var student = _repositoryManager.StudentRepository
					.FindByCondition(s => s.Id == schedule.StudentId, false)
					.FirstOrDefault();
				var parent = _repositoryManager.UserRepository
					.FindByCondition(u => u.Id == schedule.ParentId, false)
					.FirstOrDefault();
				var healthCheckup = _repositoryManager.HealthCheckRepository
					.FindByCondition(hcr => hcr.Id == schedule.HealthCheckupId, false)
					.FirstOrDefault();
				responses.Add(new ConselingResponse
				{
					Id = schedule.Id,
					StudentId = student?.Id,
					StudentName = student?.FullName,
					ParentName = parent?.FullName,
					HealthCheckupId = healthCheckup?.Id,
					MeetingDate = schedule.MeetingDate,
					Note = schedule.Note,
					Status = schedule.Status,
					CreatedTime = schedule.CreatedTime,
					CreatedBy = schedule.CreatedBy,
					UpdatedTime = schedule.LastUpdatedTime,
					UpdatedBy = schedule.LastUpdatedBy,
					ParentRejectNote = schedule.ParentRejectNote
				});
			}
			return responses;

		}
		public async Task<List<ConselingResponse>> GetAllSchedulesAsync()
		{
			var schedules = _repositoryManager.ConselingRepository
				.FindAll(false)
				.ToList();
			var responses = new List<ConselingResponse>();
			foreach (var schedule in schedules)
			{
				var student = _repositoryManager.StudentRepository
					.FindByCondition(s => s.Id == schedule.StudentId, false)
					.FirstOrDefault();
				var parent = _repositoryManager.UserRepository
					.FindByCondition(u => u.Id == schedule.ParentId, false)
					.FirstOrDefault();
				var healthCheckup = _repositoryManager.HealthCheckRepository
					.FindByCondition(hcr => hcr.Id == schedule.HealthCheckupId, false)
					.FirstOrDefault();
				responses.Add(new ConselingResponse
				{
					Id = schedule.Id,
					StudentId = student?.Id,
					StudentName = student?.FullName,
					ParentName = parent?.FullName,
					HealthCheckupId = healthCheckup?.Id,
					MeetingDate = schedule.MeetingDate,
					Note = schedule.Note,
					Status = schedule.Status,
					CreatedTime = schedule.CreatedTime,
					CreatedBy = schedule.CreatedBy,
					UpdatedTime = schedule.LastUpdatedTime,
					UpdatedBy = schedule.LastUpdatedBy,
					ParentRejectNote = schedule.ParentRejectNote
				});
			}
			return responses;
		}
		public async Task<List<ConselingResponse>> GetSchedulesByPIdAsync(string parentId)
		{
			var schedules = _repositoryManager.ConselingRepository
				.FindByCondition(cs => cs.ParentId == parentId, false)
				.ToList();
			var responses = new List<ConselingResponse>();
			foreach (var schedule in schedules)
			{
				var student = _repositoryManager.StudentRepository
					.FindByCondition(s => s.Id == schedule.StudentId, false)
					.FirstOrDefault();
				var parent = _repositoryManager.UserRepository
					.FindByCondition(u => u.Id == schedule.ParentId, false)
					.FirstOrDefault();
				var healthCheckup = _repositoryManager.HealthCheckRepository
					.FindByCondition(hcr => hcr.Id == schedule.HealthCheckupId, false)
					.FirstOrDefault();
				responses.Add(new ConselingResponse
				{
					Id = schedule.Id,
					StudentId = student?.Id,
					StudentName = student?.FullName,
					ParentName = parent?.FullName,
					HealthCheckupId = healthCheckup?.Id,
					MeetingDate = schedule.MeetingDate,
					Note = schedule.Note,
					Status = schedule.Status,
					CreatedTime = schedule.CreatedTime,
					CreatedBy = schedule.CreatedBy,
					UpdatedTime = schedule.LastUpdatedTime,
					UpdatedBy = schedule.LastUpdatedBy,
					ParentRejectNote = schedule.ParentRejectNote
				});
			}
			return responses;

		}
	}
}
