using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;



namespace SMMS.Application.Services.Implements
{
	public class ImportService
	{
		private readonly IRepositoryManager _repositoryManager;

		public ImportService(IRepositoryManager repositoryManager)
		{
			_repositoryManager = repositoryManager;
		}

		public async Task<(int createdUsers, int createdStudents, int updatedStudents, string error)> ImportUsersFromExcelAsync(IFormFile file)
		{
			int createdUsers = 0, createdStudents = 0, updatedStudents = 0;
			string error = null;

			try
			{
				using (var stream = new MemoryStream())
				{
					await file.CopyToAsync(stream);
					using (var package = new ExcelPackage(stream))
					{
						var worksheet = package.Workbook.Worksheets[0];
						int rowCount = worksheet.Dimension.Rows;

						for (int row = 2; row <= rowCount; row++) // Assuming row 1 is header
						{
							var parentEmail = worksheet.Cells[row, 1].Text;
							var parentFullName = worksheet.Cells[row, 2].Text;
							var parentPhone = worksheet.Cells[row, 3].Text;
							var studentFullName = worksheet.Cells[row, 4].Text;
							var studentGender = worksheet.Cells[row, 5].Text;
							var studentDobText = worksheet.Cells[row, 6].Text;
							var studentClassName = worksheet.Cells[row, 7].Text;

							// Validate required fields
							if (string.IsNullOrEmpty(parentEmail) || string.IsNullOrEmpty(studentFullName) || !DateTime.TryParse(studentDobText, out DateTime studentDob))
								continue;

							// Find or create parent
							var parent = _repositoryManager.UserRepository.FindByCondition(u => u.Email == parentEmail, false)
								.FirstOrDefault();
							if (parent == null)
							{
								var parentRole = _repositoryManager.RoleRepository.FindByCondition(r => r.RoleName == "Parent", false)
									.FirstOrDefault();
								if (parentRole == null) throw new Exception("Parent role not found");

								parent = new User
								{
									Email = parentEmail,
									FullName = parentFullName,
									Phone = parentPhone,
									RoleId = parentRole.Id,
									Password = BCrypt.Net.BCrypt.HashPassword("123456"),
									CreatedBy = "Admin",
									CreatedTime = DateTimeOffset.UtcNow
								};
								_repositoryManager.UserRepository.Create(parent);
								createdUsers++;
							}

							// Find class
							var schoolClass = _repositoryManager.ClassRepository.FindByCondition(c => c.ClassName == studentClassName, false)
								.FirstOrDefault();
							if (schoolClass == null) continue; // Skip if class not found

							// Find or create/update student
							var student = _repositoryManager.StudentRepository.FindByCondition(s => s.ParentId == parent.Id && s.FullName == studentFullName && s.DateOfBirth == studentDob, true)
								.FirstOrDefault();
							if (student == null)
							{
								student = new Student
								{
									ParentId = parent.Id,
									ClassId = schoolClass.Id,
									FullName = studentFullName,
									Gender = studentGender,
									DateOfBirth = studentDob,
									CreatedBy = "Admin",
									CreatedTime = DateTimeOffset.UtcNow
								};
								_repositoryManager.StudentRepository.Create(student);
								createdStudents++;
							}
							else
							{
								student.ClassId = schoolClass.Id;
								student.Gender = studentGender;
								student.LastUpdatedBy = "Admin";
								student.LastUpdatedTime = DateTimeOffset.UtcNow;
								_repositoryManager.StudentRepository.Update(student);
								updatedStudents++;
							}
						}

						await _repositoryManager.SaveAsync();
					}
				}
			}
			catch (Exception ex)
			{
				error = ex.Message;
			}

			return (createdUsers, createdStudents, updatedStudents, error);
		}
	}
}
