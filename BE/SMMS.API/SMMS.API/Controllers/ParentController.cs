using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMMS.Application.DataObject.RequestObject;

using SMMS.Application.Services.Interfaces;
using System.Security.Claims;

namespace SMMS.API.Controllers
{
	[ApiController]
	[Route("api/parents")]
	[Authorize(Roles = "Parent")]
	public class ParentController : ControllerBase
	{
		private readonly IConselingService _conselingService;
		private readonly IUserService _userService;
		private readonly IHealthCheckupService _healthCheckupService;
		private readonly IActivityConsentService _consentService;

		public ParentController(IConselingService conselingService, IUserService userService, IHealthCheckupService healthCheckupService, IActivityConsentService consentService)
		{
			_conselingService = conselingService;
			_userService = userService;
			_healthCheckupService = healthCheckupService;
			_consentService = consentService;
		}
		[HttpGet("parents/students")]
		[Authorize(Roles = "Parent")]
		public async Task<IActionResult> GetMyStudents()
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(parentId)) return Unauthorized();
			var students = await _userService.GetMyStudentsAsync(parentId);
			return Ok(students);
		}
		[HttpGet("get-all-student-health-checkup")]
		public async Task<IActionResult> GetHealthCheckup()
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var schedules = await _healthCheckupService.GetCheckingByParent(parentId);
			if (schedules == null || !schedules.Any()) return NotFound("No checkup found.");
			return Ok(schedules);
		}

		[HttpGet("get-all-conseling-schedules")]
		public async Task<IActionResult> GetAllConselingSchedules()
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var schedules = await _conselingService.GetConselingSchedulesByParentIdAsync(parentId);
			if (schedules == null || !schedules.Any()) return NotFound("No counseling schedules found.");
			return Ok(schedules);
		}
		[HttpPost("conseling-schedules")]
		public async Task<IActionResult> RequestConselingSchedule([FromBody] ConselingRequest request)
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var result = await _conselingService.RequestConselingScheduleAsync(request.StudentId, request.HealthCheckupId, request.RequestedDate, parentId, request.Note);
			if (!result) return BadRequest("Failed to request schedule.");
			return Ok("Schedule requested.");
		}

		[HttpGet("students/health")]
		public async Task<IActionResult> GetStudentsHealthProfile()
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var students = await _userService.GetMyStudentsHealthProfileAsync(parentId);
			return Ok(students);
		}
		[HttpPut("students/{studentId}/health-profile")]
		public async Task<IActionResult> UpdateStudentHealthProfile(string studentId, [FromBody] HealthProfileRequest request)
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(parentId)) return Unauthorized();
			var result = await _userService.UpdateHealthProfileByParentAsync(studentId, request, parentId);
			if (!result) return BadRequest("Không thể cập nhật hồ sơ sức khỏe. Học sinh không tồn tại hoặc không thuộc về phụ huynh này.");
			return NoContent();
		}
		[HttpGet("parents/students-with-healthprofile")]
		[Authorize(Roles = "Parent")]
		public async Task<IActionResult> GetMyStudentsWithHealthProfile()
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(parentId)) return Unauthorized();
			var students = await _userService.GetMyStudentsHealthProfileAsync(parentId);
			return Ok(students);
		}

		[HttpGet("activity-consents/my-children")]
		public async Task<IActionResult> GetActivityConsentsForMyChildren()
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var consents = await _consentService.GetActivityConsentsByParentIdAsync(parentId);
			return Ok(consents);
		}
		[HttpPut("activity-consents/{id}/confirm")]
		[Authorize(Roles = "Parent")]
		public async Task<IActionResult> ConfirmActivityConsent(string id, [FromBody] bool status)
		{
			var parentId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			var result = await _consentService.ConfirmActivityConsentAsync(id, status, parentId);
			if (!result) return BadRequest("Failed to confirm consent.");
			return NoContent();
		}
	}
}
