using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMedicalRequestFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HealthActivityClasses",
                keyColumn: "Id",
                keyValue: "159a0cf8-662d-4efb-9218-bcd9cc1d7cf5");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "0db6e4d5-f85a-42f5-a4a9-28693325bcf8");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "eb41da02-3801-4e1f-b44e-dbef4408e9e9");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "53e4564c-0e72-4772-addf-c7642db2a5f3");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "f593f5b2-8234-416c-8cdd-a486be2f743a");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaignClasses",
                keyColumn: "Id",
                keyValue: "7579f8ed-c028-4e59-b7a9-517cfaad9622");

            migrationBuilder.DeleteData(
                table: "HealthActivity",
                keyColumn: "Id",
                keyValue: "7aab09da-b367-4d59-ac41-73453808efc6");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "a2e1f677-b7e7-4e11-b414-1512af9def4b");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "de99dad4-8b7a-44b8-b4b9-f8e54fb91e6c");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "357e080e-8ffa-4f54-8fb7-807e29c573f5");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "6b524770-a631-4f19-b68f-3269977fd64a");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaign",
                keyColumn: "Id",
                keyValue: "0484b4d6-44c0-4fe8-979e-af03d3c5433f");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "56ed3a71-79ec-4156-b6a3-2403f3e4b603");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "f7bd68cf-a9eb-48b3-b04f-c5b5d8486c2d");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "94389e8e-a398-4e89-8962-897ac3d03609");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "b5c344e4-029e-4227-beea-0a8b7bfacd95");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "4d07fa7f-4d9a-4f85-a301-cab23e66ca8a");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "eca3116c-dbd1-4e91-a03a-044a1d0de7c9");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompletedToday",
                table: "MedicalRequest",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastCompletedDate",
                table: "MedicalRequest",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "MedicalRequest",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "3867fc63-f457-4a46-9da9-90cab9c661e9", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8471), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "488f8825-b0ac-4a61-aee3-dbfd01233ca3", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8490), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8490), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "adb29313-f26e-4705-9af0-17ef74e2047f", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8528), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8529), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "ca0a8d83-a8cd-45d0-9a2b-d1bad70ca619", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8534), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 830, DateTimeKind.Unspecified).AddTicks(8534), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "4db38b61-13da-4a3e-9618-12bcd3f4ea08", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(4838), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 },
                    { "e6b89092-3d34-4cb9-90d7-8be71550aee6", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(4849), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "0611a8a3-e540-4c0a-9591-044f35d1327c", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(3936), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$kvg9J1r5wB9z7zUyGubCkOBk19cHzf5jzh.WNPL9SkuCS5uAKDbDa", "0987051234", "ca0a8d83-a8cd-45d0-9a2b-d1bad70ca619" },
                    { "12fd676f-df5d-4ee4-885e-755b40e9bde8", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 8, 946, DateTimeKind.Unspecified).AddTicks(4684), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$JaTvFfzWwOy6RHSH2fg6TO5dxUOlfjccQoIOQxpi0p4lfbzLKVVdO", "0987654321", "3867fc63-f457-4a46-9da9-90cab9c661e9" },
                    { "e17ce554-9ae9-454c-a599-f74616d6f19a", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 67, DateTimeKind.Unspecified).AddTicks(9118), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$VqhGncxUCsq4XcA4y1u.x.JlrKrDYsUowj3XY/KbbHjtGVe3DKvpa", "0912345678", "adb29313-f26e-4705-9af0-17ef74e2047f" },
                    { "f5165ef5-d766-4e9a-83ef-80914b4f1f29", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 185, DateTimeKind.Unspecified).AddTicks(5346), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$lvVRUA9GNxrXdxqfsELi1e5ZzSXrF4K5fl4ScmwsqDd3trZYsJ9tW", "0987651234", "488f8825-b0ac-4a61-aee3-dbfd01233ca3" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "Status", "UserId" },
                values: new object[] { "d191dcb9-a1a2-440b-9e06-284c000af116", "e17ce554-9ae9-454c-a599-f74616d6f19a", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(5147), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Yearly health check for students", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Annual Health Check", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "e17ce554-9ae9-454c-a599-f74616d6f19a" });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "4777119f-6184-4e70-b82c-cc3c6dc229e1", "e6b89092-3d34-4cb9-90d7-8be71550aee6", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(4983), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "0611a8a3-e540-4c0a-9591-044f35d1327c" },
                    { "da41bc81-f90f-42d9-a7f6-d3d49dc18d23", "4db38b61-13da-4a3e-9618-12bcd3f4ea08", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(4973), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "0611a8a3-e540-4c0a-9591-044f35d1327c" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "Status", "UserId", "VaccineName", "VaccineType" },
                values: new object[] { "29f1fcd2-34a5-46fa-a3b3-761cb02d0887", "e17ce554-9ae9-454c-a599-f74616d6f19a", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(5318), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Flu Vaccination", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "e17ce554-9ae9-454c-a599-f74616d6f19a", "Flu Vaccine", "Flu" });

            migrationBuilder.InsertData(
                table: "HealthActivityClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "HealthActivityId", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId" },
                values: new object[] { "caa4e1d1-f910-4f22-9a6e-94875554fc4d", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(5210), new TimeSpan(0, 0, 0, 0, 0)), null, null, "d191dcb9-a1a2-440b-9e06-284c000af116", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "4db38b61-13da-4a3e-9618-12bcd3f4ea08" });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "LastUpdatedBy", "LastUpdatedTime", "StudentId", "VaccinationHistory", "Vision" },
                values: new object[,]
                {
                    { "6412b98f-c13f-4689-8af5-7b1f77364c57", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(5059), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "da41bc81-f90f-42d9-a7f6-d3d49dc18d23", "Fully vaccinated", "20/20" },
                    { "a645107d-f48a-4a14-b161-a2c7f5caa334", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(5076), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "4777119f-6184-4e70-b82c-cc3c6dc229e1", "Fully vaccinated", "20/25" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaignClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId", "VaccinationCampaignId" },
                values: new object[] { "85695f3c-71d8-46ff-876a-6994da7d9bac", "System", new DateTimeOffset(new DateTime(2025, 6, 7, 9, 23, 9, 305, DateTimeKind.Unspecified).AddTicks(5371), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "e6b89092-3d34-4cb9-90d7-8be71550aee6", "29f1fcd2-34a5-46fa-a3b3-761cb02d0887" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HealthActivityClasses",
                keyColumn: "Id",
                keyValue: "caa4e1d1-f910-4f22-9a6e-94875554fc4d");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "6412b98f-c13f-4689-8af5-7b1f77364c57");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "a645107d-f48a-4a14-b161-a2c7f5caa334");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "12fd676f-df5d-4ee4-885e-755b40e9bde8");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "f5165ef5-d766-4e9a-83ef-80914b4f1f29");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaignClasses",
                keyColumn: "Id",
                keyValue: "85695f3c-71d8-46ff-876a-6994da7d9bac");

            migrationBuilder.DeleteData(
                table: "HealthActivity",
                keyColumn: "Id",
                keyValue: "d191dcb9-a1a2-440b-9e06-284c000af116");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "3867fc63-f457-4a46-9da9-90cab9c661e9");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "488f8825-b0ac-4a61-aee3-dbfd01233ca3");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "4777119f-6184-4e70-b82c-cc3c6dc229e1");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "da41bc81-f90f-42d9-a7f6-d3d49dc18d23");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaign",
                keyColumn: "Id",
                keyValue: "29f1fcd2-34a5-46fa-a3b3-761cb02d0887");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "4db38b61-13da-4a3e-9618-12bcd3f4ea08");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "e6b89092-3d34-4cb9-90d7-8be71550aee6");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "0611a8a3-e540-4c0a-9591-044f35d1327c");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "e17ce554-9ae9-454c-a599-f74616d6f19a");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "adb29313-f26e-4705-9af0-17ef74e2047f");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "ca0a8d83-a8cd-45d0-9a2b-d1bad70ca619");

            migrationBuilder.DropColumn(
                name: "IsCompletedToday",
                table: "MedicalRequest");

            migrationBuilder.DropColumn(
                name: "LastCompletedDate",
                table: "MedicalRequest");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "MedicalRequest");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "4d07fa7f-4d9a-4f85-a301-cab23e66ca8a", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5896), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5897), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "a2e1f677-b7e7-4e11-b414-1512af9def4b", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5845), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5846), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "de99dad4-8b7a-44b8-b4b9-f8e54fb91e6c", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5829), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "eca3116c-dbd1-4e91-a03a-044a1d0de7c9", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5950), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 78, DateTimeKind.Unspecified).AddTicks(5951), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "56ed3a71-79ec-4156-b6a3-2403f3e4b603", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(212), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 },
                    { "f7bd68cf-a9eb-48b3-b04f-c5b5d8486c2d", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(218), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "53e4564c-0e72-4772-addf-c7642db2a5f3", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 677, DateTimeKind.Unspecified).AddTicks(7300), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$co/Ct3wcpcKEHRo1smFfvuCwWyCHni312Rm0q6YIdHYKVFoaJQ1lu", "0987651234", "a2e1f677-b7e7-4e11-b414-1512af9def4b" },
                    { "94389e8e-a398-4e89-8962-897ac3d03609", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 873, DateTimeKind.Unspecified).AddTicks(9344), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$8Nob.GbYaPikot72dM2O6u8UG9GuCVgZhr3zVbbdPCIrt5I4IWcra", "0987051234", "eca3116c-dbd1-4e91-a03a-044a1d0de7c9" },
                    { "b5c344e4-029e-4227-beea-0a8b7bfacd95", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 479, DateTimeKind.Unspecified).AddTicks(6933), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$jlL.cG7zVHC7HJAJU1zVxeIhoII4YmJAw735jFyxDLZ.gsd6ovfWm", "0912345678", "4d07fa7f-4d9a-4f85-a301-cab23e66ca8a" },
                    { "f593f5b2-8234-416c-8cdd-a486be2f743a", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 291, DateTimeKind.Unspecified).AddTicks(6517), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$.KMgDX4IfULg5H/kqSNF6.ZFIPpahbPHLG/D7KRAiHkIEPeZyi6TC", "0987654321", "de99dad4-8b7a-44b8-b4b9-f8e54fb91e6c" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "Status", "UserId" },
                values: new object[] { "7aab09da-b367-4d59-ac41-73453808efc6", "b5c344e4-029e-4227-beea-0a8b7bfacd95", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(482), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Yearly health check for students", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Annual Health Check", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "b5c344e4-029e-4227-beea-0a8b7bfacd95" });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "357e080e-8ffa-4f54-8fb7-807e29c573f5", "56ed3a71-79ec-4156-b6a3-2403f3e4b603", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(311), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "94389e8e-a398-4e89-8962-897ac3d03609" },
                    { "6b524770-a631-4f19-b68f-3269977fd64a", "f7bd68cf-a9eb-48b3-b04f-c5b5d8486c2d", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(315), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "94389e8e-a398-4e89-8962-897ac3d03609" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "Status", "UserId", "VaccineName", "VaccineType" },
                values: new object[] { "0484b4d6-44c0-4fe8-979e-af03d3c5433f", "b5c344e4-029e-4227-beea-0a8b7bfacd95", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(798), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Flu Vaccination", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "b5c344e4-029e-4227-beea-0a8b7bfacd95", "Flu Vaccine", "Flu" });

            migrationBuilder.InsertData(
                table: "HealthActivityClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "HealthActivityId", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId" },
                values: new object[] { "159a0cf8-662d-4efb-9218-bcd9cc1d7cf5", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(622), new TimeSpan(0, 0, 0, 0, 0)), null, null, "7aab09da-b367-4d59-ac41-73453808efc6", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "56ed3a71-79ec-4156-b6a3-2403f3e4b603" });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "LastUpdatedBy", "LastUpdatedTime", "StudentId", "VaccinationHistory", "Vision" },
                values: new object[,]
                {
                    { "0db6e4d5-f85a-42f5-a4a9-28693325bcf8", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(366), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "357e080e-8ffa-4f54-8fb7-807e29c573f5", "Fully vaccinated", "20/20" },
                    { "eb41da02-3801-4e1f-b44e-dbef4408e9e9", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(372), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "6b524770-a631-4f19-b68f-3269977fd64a", "Fully vaccinated", "20/25" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaignClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId", "VaccinationCampaignId" },
                values: new object[] { "7579f8ed-c028-4e59-b7a9-517cfaad9622", "System", new DateTimeOffset(new DateTime(2025, 6, 6, 10, 50, 7, 874, DateTimeKind.Unspecified).AddTicks(839), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "f7bd68cf-a9eb-48b3-b04f-c5b5d8486c2d", "0484b4d6-44c0-4fe8-979e-af03d3c5433f" });
        }
    }
}
