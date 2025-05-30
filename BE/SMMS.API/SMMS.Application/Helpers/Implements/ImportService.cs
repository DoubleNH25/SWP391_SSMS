using ClosedXML.Excel;
using SMMS.Domain.Entity;
using SMMS.Domain.Interface.Repositories;



namespace SMMS.Application.Helpers.Implements
{
	public class ImportService
	{
		private readonly IRepositoryManager _repositoryManager;

		public ImportService(IRepositoryManager repositoryManager)
		{
			_repositoryManager = repositoryManager;
		}

		public async Task ImportStudentsFromExcelAsync(Stream fileStream)
		{
			using var workbook = new XLWorkbook(fileStream);
			var worksheet = workbook.Worksheet(1); // Giả sử dữ liệu nằm ở sheet đầu tiên

			var rows = worksheet.RowsUsed().Skip(1); // Bỏ qua hàng tiêu đề

			foreach (var row in rows)
			{
				var parentEmail = row.Cell(1).GetString();
				var parentPhone = row.Cell(2).GetString();
				var parentFullName = row.Cell(3).GetString();
				var studentFullName = row.Cell(4).GetString();
				var studentGender = row.Cell(5).GetString();
				var studentDateOfBirth = row.Cell(6).GetDateTime();
				var className = row.Cell(7).GetString();

				// Tìm hoặc tạo User với role Parent
				var parentUser = _repositoryManager.UserRepository
					.FindByCondition(u => u.Email == parentEmail, true)
					.FirstOrDefault();
				if (parentUser == null)
				{
					var parentRole = _repositoryManager.RoleRepository
						.FindByCondition(r => r.RoleName == "Parent", false)
						.FirstOrDefault();
					if (parentRole == null)
					{
						throw new Exception("Role 'Parent' not found.");
					}
					parentUser = new User
					{
						Email = parentEmail,
						Phone = parentPhone,
						FullName = parentFullName,
						RoleId = parentRole.Id,
						Password = BCrypt.Net.BCrypt.HashPassword("123456"), // Mật khẩu mặc định
						CreatedBy = "System",
						CreatedTime = DateTimeOffset.UtcNow
					};
					_repositoryManager.UserRepository.Create(parentUser);
				}

				// Tìm hoặc tạo SchoolClass
				var schoolClass = _repositoryManager.ClassRepository
					.FindByCondition(c => c.ClassName == className, true)
					.FirstOrDefault();
				if (schoolClass == null)
				{
					schoolClass = new SchoolClass
					{
						Id = Guid.NewGuid().ToString(),
						ClassName = className,
						ClassRoom = className,
						CreatedBy = "System",
						CreatedTime = DateTimeOffset.UtcNow
					};
					_repositoryManager.ClassRepository.Create(schoolClass);
				}

				// Tạo Student
				var student = new Student
				{
					ParentId = parentUser.Id,
					ClassId = schoolClass.Id,
					FullName = studentFullName,
					Gender = studentGender,
					DateOfBirth = studentDateOfBirth,
					CreatedBy = "System",
					CreatedTime = DateTimeOffset.UtcNow
				};
				_repositoryManager.StudentRepository.Create(student);
			}

			await _repositoryManager.SaveAsync();
		}
	}
}
