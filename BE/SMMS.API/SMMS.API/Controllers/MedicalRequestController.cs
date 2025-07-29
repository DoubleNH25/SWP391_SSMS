using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.Services.Interfaces;
using SMMS.Application.Helpers.Implements;
using System.Security.Claims;

namespace SMMS.API.Controllers
{
    [ApiController]
    [Route("api/medical-request")]
    public class MedicalRequestController : ControllerBase
    {
        private readonly IMedicalService _medicalService;
        private readonly CloudinaryService _cloudinaryService;

        public MedicalRequestController(IMedicalService medicalService, CloudinaryService cloudinaryService)
        {
            _medicalService = medicalService;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> CreateMedicalRequest([FromBody] CreateMedicalRequestRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _medicalService.CreateMedicalRequestAsync(userId, request);
            if (!result)
                return BadRequest("Failed to create medical request.");
            return Ok("Medical request created successfully.");
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetAllMedicalRequests()
        {
            var result = await _medicalService.GetAllMedicalRequestsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetMedicalRequestById(string id)
        {
            var result = await _medicalService.GetMedicalRequestByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> UpdateMedicalRequest(string id, [FromBody] UpdateMedicalRequestRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User not authenticated.");
                }
                var result = await _medicalService.UpdateMedicalRequestAsync(id, request, userId);
                return Ok(new {
                    success = true,
                    message = "Medical request updated successfully.",
                    data = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { success = false, message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while updating the medical request." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> DeleteMedicalRequest(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _medicalService.DeleteMedicalRequestAsync(id, userId);
            if (!result) return BadRequest("Failed to delete medical request.");
            return Ok("Medical request deleted successfully.");
        }

        [HttpGet("student/{studentId}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetMedicalRequestsByStudent(string studentId)
        {
            var result = await _medicalService.GetMedicalRequestsByStudentAsync(studentId);
            return Ok(result);
        }

        [HttpGet("parent/{parentId}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetMedicalRequestsByParent(string parentId)
        {
            var result = await _medicalService.GetMedicalRequestsByParentAsync(parentId);
            return Ok(result);
        }

        [HttpGet("daily/{date}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetDailyMedicationSchedule(DateTime date)
        {
            var result = await _medicalService.GetDailyMedicationScheduleAsync(date);
            return Ok(result);
        }

        [HttpGet("daily/today")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetTodayMedicationSchedule()
        {
            var result = await _medicalService.GetDailyMedicationScheduleAsync(DateTime.Today);
            return Ok(result);
        }

        [HttpPut("administration")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> RecordMedicationAdministration([FromBody] RecordMedicationAdministrationRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _medicalService.RecordMedicationAdministrationAsync(userId, request);
            if (!result) return BadRequest("Failed to record medication administration.");
            return Ok("Medication administration recorded successfully.");
        }

        [HttpGet("history/completed/{date}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetCompletedMedicationHistory(DateTime date)
        {
            try
            {
                var result = await _medicalService.GetCompletedMedicationHistoryAsync(date);
                return Ok(new {
                    success = true,
                    message = "Completed medication history retrieved successfully.",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while retrieving completed medication history." });
            }
        }

        [HttpGet("history/completed/today")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetTodayCompletedMedicationHistory()
        {
            try
            {
                var result = await _medicalService.GetTodayCompletedMedicationHistoryAsync();
                return Ok(new {
                    success = true,
                    message = "Today's completed medication history retrieved successfully.",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while retrieving today's completed medication history." });
            }
        }

        [HttpGet("search")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> SearchMedicalRequests(
            [FromQuery] string? medicationName,
            [FromQuery] string? studentId,
            [FromQuery] DateTime? date,
            [FromQuery] string? status)
        {
            var result = await _medicalService.SearchMedicalRequestsAsync(medicationName, studentId, date, status);
            return Ok(result);
        }

        [HttpPost("upload-image")]
        [Authorize]
        public async Task<IActionResult> UploadImage([FromForm] ImageUploadRequest request)
        {
            if (request.Image == null || request.Image.Length == 0)
                return BadRequest("No image uploaded.");
            var imageUrl = await _cloudinaryService.UploadImageAsync(request.Image);
            return Ok(new { imageUrl });
        }

        [HttpGet("parent-id/{studentId}")]
        [Authorize(Roles = "Admin,Manager,Nurse,Parent")]
        public async Task<IActionResult> GetParentIdByStudentId(string studentId)
        {
            // Giả sử có service lấy parentId từ studentId
            var parent = await _medicalService.GetParentByStudentIdAsync(studentId);
            if (parent == null)
                return NotFound(new { message = "Parent not found for this student." });
            return Ok(new { parentId = parent.Id });
        }
    }
} 