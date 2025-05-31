using SMMS.Application.DataObject.RequestObject;
using SMMS.Application.DataObject.ResponseObject;
using SMMS.Domain.Entity;
namespace SMMS.Application.Services.Interfaces
{
	public interface IHealthCheckupService
	{
		Task<bool> UpdateHealthCheckupRecordAsync(string healthCheckupRecordId, HealthCheckupUpdateRequest request, string nurseId);

		Task<List<HealthCheckUpResponse>> GetCheckingByParent(string parentId);

		Task<List<HealthCheckUpResponse>> GetCheckingByNurse(string nurseId);

		Task UpdateHealthProfileAsync(HealthCheckupRecord record);

		Task<List<HealthCheckUpResponse>> GetHealthCheckupRecordsByStudentIdAsync(string studentId);
		Task<List<HealthCheckUpResponse>> GetAllHealthCheckupRecordsAsync();
	}
}
