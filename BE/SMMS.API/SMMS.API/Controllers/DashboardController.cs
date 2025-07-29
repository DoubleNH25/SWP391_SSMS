using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMMS.Application.Services.Interfaces;

namespace SMMS.API.Controllers
{
	[ApiController]
	[Route("api")]
	[Authorize(Roles = "Admin,Manager,Nurse,Parent")]
	public class DashboardController : ControllerBase
	{
		private readonly IUserService _userService;
		private readonly IMedicalService _medicalService;

		public DashboardController(IUserService userService, IMedicalService medicalService)
		{
			_userService = userService;
			_medicalService = medicalService;
		}

		[HttpGet("students/count")]
		public async Task<IActionResult> GetStudentsCount()
		{
			var count = await _userService.GetStudentsCountAsync();
			return Ok(new { count });
		}

		[HttpGet("parents/count")]
		public async Task<IActionResult> GetParentsCount()
		{
			var count = await _userService.GetParentsCountAsync();
			return Ok(new { count });
		}

		[HttpGet("users/nurses/count")]
		public async Task<IActionResult> GetNursesCount()
		{
			var count = await _userService.GetNursesCountAsync();
			return Ok(new { count });
		}

		[HttpGet("medical/request/daily/today/count")]
		public async Task<IActionResult> GetTodayMedicalRequestsCount()
		{
			var count = await _medicalService.GetTodayMedicalRequestsCountAsync();
			return Ok(new { count });
		}

		[HttpGet("incidents/count")]
		public async Task<IActionResult> GetMedicalIncidentsCount()
		{
			var count = await _medicalService.GetMedicalIncidentsCountAsync();
			return Ok(new { count });
		}
	}
}
