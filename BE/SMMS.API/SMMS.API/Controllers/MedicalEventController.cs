using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.Services.Interfaces;
using System.Security.Claims;

namespace SMMS.API.Controllers
{
	[ApiController]
	[Route("api/medical-events")]
	public class MedicalEventController : ControllerBase
	{
		private readonly IHealthActivityService _healthActivityService;
		private readonly IVaccinationCampaignService _vaccinationCampaignService;
		private readonly IActivityConsentService _consentService;

		public MedicalEventController(IHealthActivityService healthActivityService, IVaccinationCampaignService vaccinationCampaignService, IActivityConsentService consentService)
		{
			_healthActivityService = healthActivityService;
			_vaccinationCampaignService = vaccinationCampaignService;
			_consentService = consentService;
		}

		[HttpGet("health-activities/all")]
		[Authorize(Roles = "Admin,Manager,Nurse")]
		public async Task<IActionResult> GetAllHealthActivities()
		{
			var activities = await _healthActivityService.GetAllHealthActivityAsync();
			return Ok(activities);
		}

		[HttpGet("health-activities/rejected")]
		[Authorize(Roles = "Admin,Manager,Nurse")]
		public async Task<IActionResult> GetRejectedHealthActivities()
		{
			var activities = await _healthActivityService.GetRejectHealthActivitiesAsync();
			return Ok(activities);
		}

		[HttpGet("health-activities/pending")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> GetPendingHealthActivities()
		{
			var pending = await _healthActivityService.GetPendingHealthActivitiesAsync();
			return Ok(pending);
		}
		[HttpGet("health-activities/approved")]
		[Authorize(Roles = "Admin,Manager,Nurse")]
		public async Task<IActionResult> GetApprovedHealthActivities()
		{
			var activities = await _healthActivityService.GetApprovedHealthActivitiesAsync();
			return Ok(activities);
		}

		[HttpPost("health-activities")]
		[Authorize(Roles = "Nurse")]
		public async Task<IActionResult> CreateHealthActivity([FromBody] HealthActivityRequest request)
		{
			var nurseId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (nurseId == null) return Unauthorized("Nurse ID not found in claims.");
			var response = await _healthActivityService.CreateHealthActivityAsync(request, nurseId);
			return Ok(response);
		}

		[HttpPut("health-activities/{id}/approve")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> ApproveHealthActivity(string id)
		{
			var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (approverId == null) return Unauthorized("Approver ID not found in claims.");
			var result = await _healthActivityService.ApproveHealthActivityAsync(id, approverId);
			if (!result) return NotFound();
			return NoContent();
		}
		[HttpPut("health-activities/{id}/reject")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> RejectHealthActivity(string id)
		{
			var rejecterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (rejecterId == null) return Unauthorized("Rejecter ID not found in claims.");
			var result = await _healthActivityService.RejectHealthActivityAsync(id, rejecterId);
			if (!result) return NotFound();
			return NoContent();
		}

		[HttpPut("health-activities/{id}")]
		[Authorize(Roles = "Nurse,Admin,Manager")]
		public async Task<IActionResult> UpdateHealthActivity(string id, [FromBody] HealthActivityRequest request)
		{
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized("User ID not found in claims.");
			var result = await _healthActivityService.UpdateHealthActivityAsync(id, request, userId);
			if (!result) return BadRequest("Cannot update health activity.");
			return NoContent();
		}
		[HttpDelete("health-activities/{id}")]
		[Authorize(Roles = "Nurse,Admin,Manager")]
		public async Task<IActionResult> DeleteHealthActivity(string id)
		{
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized("User ID not found in claims.");
			var result = await _healthActivityService.DeleteHealthActivityAsync(id, userId);
			if (!result) return BadRequest("Cannot delete health activity.");
			return NoContent();
		}

		[HttpGet("vaccination-campaigns/all")]
		[Authorize(Roles = "Admin,Manager,Nurse")]
		public async Task<IActionResult> GetAllVaccineCampaign()
		{
			var activities = await _vaccinationCampaignService.GetAllVaccineCampaignAsync();
			return Ok(activities);
		}

		[HttpGet("vaccination-campaigns/reject")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> GetRejectVaccinationCampaigns()
		{
			var pending = await _vaccinationCampaignService.GetRejectVaccinationCampaignsAsync();
			return Ok(pending);
		}

		[HttpGet("vaccination-campaigns/pending")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> GetPendingVaccinationCampaigns()
		{
			var pending = await _vaccinationCampaignService.GetPendingVaccinationCampaignsAsync();
			return Ok(pending);
		}
		[HttpGet("vaccination-campaigns/approved")]
		[Authorize(Roles = "Admin,Manager,Nurse,Parent")]
		public async Task<IActionResult> GetApprovedVaccinationCampaigns()
		{
			var campaigns = await _vaccinationCampaignService.GetApprovedVaccinationCampaignsAsync();
			return Ok(campaigns);
		}

		[HttpPost("vaccination-campaigns")]
		[Authorize(Roles = "Nurse")]
		public async Task<IActionResult> CreateVaccinationCampaign([FromBody] VaccinationCampaignRequest request)
		{
			var nurseId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (nurseId == null) return Unauthorized("Nurse ID not found in claims.");
			var response = await _vaccinationCampaignService.CreateVaccinationCampaignAsync(request, nurseId);
			return Ok(response);
		}

		[HttpPut("vaccination-campaigns/{id}/approve")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> ApproveVaccinationCampaign(string id)
		{
			var approverId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (approverId == null) return Unauthorized("Approver ID not found in claims.");
			var result = await _vaccinationCampaignService.ApproveVaccinationCampaignAsync(id, approverId);
			if (!result) return NotFound();
			return NoContent();
		}

		[HttpPut("vaccination-campaigns/{id}/reject")]
		[Authorize(Roles = "Admin,Manager")]
		public async Task<IActionResult> RejectVaccinationCampaign(string id)
		{
			var rejecterId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (rejecterId == null) return Unauthorized("Approver ID not found in claims.");
			var result = await _vaccinationCampaignService.RejectVaccinationCampaignAsync(id, rejecterId);
			if (!result) return NotFound();
			return NoContent();
		}

		[HttpPut("vaccination-campaigns/{id}")]
		[Authorize(Roles = "Nurse,Admin,Manager")]
		public async Task<IActionResult> UpdateVaccinationCampaign(string id, [FromBody] VaccinationCampaignRequest request)
		{
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized("User ID not found in claims.");
			var result = await _vaccinationCampaignService.UpdateVaccinationCampaignAsync(id, request, userId);
			if (!result) return BadRequest("Cannot update vaccination campaign.");
			return NoContent();
		}

		[HttpDelete("vaccination-campaigns/{id}")]
		[Authorize(Roles = "Nurse,Admin,Manager")]
		public async Task<IActionResult> DeleteVaccinationCampaign(string id)
		{
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized("User ID not found in claims.");
			var result = await _vaccinationCampaignService.DeleteVaccinationCampaignAsync(id, userId);
			if (!result) return BadRequest("Cannot delete vaccination campaign.");
			return NoContent();
		}
		/// <summary>
		/// Thông báo Và chờ phụ huynh duyệt 
		/// </summary>
		/// <param name="healthActivityId"></param>
		/// <returns></returns>

		[HttpGet("activity-consents/health-activities/{healthActivityId}")]
		[Authorize(Roles = "Admin,Manager,Nurse")]
		public async Task<IActionResult> GetActivityConsentsForHealthActivity(string healthActivityId)
		{
			var consents = await _consentService.GetConsentsByHAIdAsync(healthActivityId);
			return Ok(consents);
		}

		[HttpGet("activity-consents/vaccination-campaigns/{vaccinationCampaignId}")]
		[Authorize(Roles = "Admin,Manager,Nurse")]
		public async Task<IActionResult> GetActivityConsentsForVaccinationCampaign(string vaccinationCampaignId)
		{
			var consents = await _consentService.GetConsentsByVCIdAsync(vaccinationCampaignId);
			return Ok(consents);
		}

	}
}
