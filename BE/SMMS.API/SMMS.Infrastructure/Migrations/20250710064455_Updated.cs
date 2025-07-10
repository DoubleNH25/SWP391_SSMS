using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Updated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HealthActivityClasses",
                keyColumn: "Id",
                keyValue: "5c4e5339-01ed-4202-bcf0-3105f58861e7");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "031a3887-9cc5-4bee-9c50-cef4256036c7");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "cf392ce2-265a-4239-93db-faff2fecb03c");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "415337a4-b9b1-4bcc-b406-0cad52be2c4b");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "491ac80d-6114-46f0-a299-12f527eae242");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "50b49ed7-7d67-4d2e-ab50-70e28a6ecf77");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "91337070-d805-4e91-a4c5-efa44e4ec146");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "b6c0fff6-1d50-496b-b5c3-3e3bf07743a3");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "017ce373-28cd-4e88-b579-d4d9e5ba3101");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "4ad6f400-cd78-440e-a553-5ea03b308e7d");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaignClasses",
                keyColumn: "Id",
                keyValue: "3e91bdcf-11b0-4e00-bdf7-cccd154a879e");

            migrationBuilder.DeleteData(
                table: "HealthActivity",
                keyColumn: "Id",
                keyValue: "d0d7fd7a-4153-416f-aeae-cc9597c13e41");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "971d1580-c72f-4202-81b8-72c6fd2a93cc");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "c06b3052-6744-484c-b51f-896e3bb0be76");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "8a6bb4de-1d72-44f6-950e-7df94f5bd7b9");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "e15271db-e1df-4cee-93d4-877392148bf3");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaign",
                keyColumn: "Id",
                keyValue: "14cffa39-8494-4897-93a5-7f5161ce7d8f");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "82b7f52f-30bf-4a31-a522-18141c517447");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "d319498e-0883-4e2f-a271-aa294031dc5b");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "7b476d02-42ac-4bed-aab8-93ea4c483239");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "af84f767-4c3b-41b2-a7ca-d14f877480ca");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "826ee8ba-81e3-4d2a-be23-81b91d48ad4e");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "f74f0873-47ab-4039-bd11-57f15f28caa0");

            migrationBuilder.AddColumn<string>(
                name: "Supplier",
                table: "MedicalUsage",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Supplier",
                table: "MedicalStock",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Height",
                table: "HealthProfile",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "HealthProfile",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Height",
                table: "HealthCheckupRecord",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "HealthCheckupRecord",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.InsertData(
                table: "MedicalStock",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "DetailInformation", "ExpiryDate", "LastUpdatedBy", "LastUpdatedTime", "Name", "Quantity", "Status", "Supplier" },
                values: new object[,]
                {
                    { "111d187d-1052-44ae-ac57-1685fa6433f7", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(3044), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1m", 50, 0, "MediSupply" },
                    { "3d21373e-8244-4400-90f3-bf26bd7655af", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(3072), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket12h", 50, 0, "VitaCare" },
                    { "67aedbaf-c9e7-470a-b96b-cdb769c16a6f", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(3359), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket-24/7", 50, 0, "WellnessPharma" },
                    { "7efc0ba8-c53d-409a-a141-fbdff96741bf", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(3034), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1s", 100, 0, "PharmaCorp" },
                    { "8a7c8242-09b8-4cde-8d3f-37fff2263ac5", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(3048), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1h", 50, 0, "HealthPlus" }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "158fbd5d-32b0-4f0f-ae9b-79692c1014c8", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4580), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4580), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "1d4c6acc-77fe-4d6c-a0bb-248e0f809cea", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4576), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4576), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "2b8fe3d0-d30a-4736-b00b-17dfee3e9b67", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4572), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "d9369787-6f23-4658-b707-3eb942961f16", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4582), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 483, DateTimeKind.Unspecified).AddTicks(4583), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "aab91532-74ac-4b5a-b5e8-a0779cb507e4", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2306), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 },
                    { "ec3a89e7-bdce-4444-8198-46a305dd3d1c", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2312), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "028186dc-7921-421b-b925-059904f8c59f", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 842, DateTimeKind.Unspecified).AddTicks(1256), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$FcR2cDPLl81du1Ry5ARxb.vFqmVBoa8S1Q/Oo1K6zVK63Kz35BEeC", "0987651234", "1d4c6acc-77fe-4d6c-a0bb-248e0f809cea" },
                    { "2b12e4d8-d731-4035-86b7-bbdc3f24a101", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(917), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$Wv4s70wORWkhKLEsDWMyi.b23TtwdCcL.LCQtM8vPN3Ewd1m3T0XG", "0987051234", "d9369787-6f23-4658-b707-3eb942961f16" },
                    { "8bdded60-8fd4-4a5c-9bac-ce42592bea0d", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 721, DateTimeKind.Unspecified).AddTicks(3220), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$IbYuCsoieWu0sZlVRbw8gusUOnxXs2kVfDCGZRMUZjAh/LJIbqno6", "0912345678", "158fbd5d-32b0-4f0f-ae9b-79692c1014c8" },
                    { "edbb573d-b3e9-465b-a983-df25da5736c6", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 599, DateTimeKind.Unspecified).AddTicks(8519), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$dep7jDc9Y2qIjf5ZbfUJ9uZwi2jBNJjd0AZaXvAnuIIOPGtu9QyRW", "0987654321", "2b8fe3d0-d30a-4736-b00b-17dfee3e9b67" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "Status", "UserId" },
                values: new object[] { "e4d8f5f2-f47e-4b14-863a-2cbb82697773", "8bdded60-8fd4-4a5c-9bac-ce42592bea0d", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2688), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Nha Cai Hang Dau So 1 Dong Nam A", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Bet88", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "8bdded60-8fd4-4a5c-9bac-ce42592bea0d" });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "cb8cd4da-b6bf-4eeb-82dd-4937f0233639", "aab91532-74ac-4b5a-b5e8-a0779cb507e4", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2441), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "2b12e4d8-d731-4035-86b7-bbdc3f24a101" },
                    { "e74ca88f-5b1f-4c07-a29b-f3fc778696db", "ec3a89e7-bdce-4444-8198-46a305dd3d1c", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2446), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "2b12e4d8-d731-4035-86b7-bbdc3f24a101" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "Status", "UserId", "VaccineName", "VaccineType" },
                values: new object[] { "c703b4f3-ec48-489a-858d-996f23d29eb7", "8bdded60-8fd4-4a5c-9bac-ce42592bea0d", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2854), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "KT88", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "8bdded60-8fd4-4a5c-9bac-ce42592bea0d", "Nha Cai Hang Dau So 1 Chau Au", "Flu" });

            migrationBuilder.InsertData(
                table: "HealthActivityClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "HealthActivityId", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId" },
                values: new object[] { "3416d822-ba4e-46f3-9fed-f08447de2398", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2771), new TimeSpan(0, 0, 0, 0, 0)), null, null, "e4d8f5f2-f47e-4b14-863a-2cbb82697773", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "aab91532-74ac-4b5a-b5e8-a0779cb507e4" });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "Height", "LastUpdatedBy", "LastUpdatedTime", "ParentNote", "StudentId", "VaccinationHistory", "Vision", "Weight" },
                values: new object[,]
                {
                    { "0859fa2f-eef0-48f8-878a-36ad709fbdb7", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2599), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", 0.0, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "cb8cd4da-b6bf-4eeb-82dd-4937f0233639", "Fully using Rocket1h", "20/20", 0.0 },
                    { "6420bbaf-bca0-4fd9-b18d-4a411c21eba0", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2611), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", 0.0, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "e74ca88f-5b1f-4c07-a29b-f3fc778696db", "Fully using Rocket24/7", "20/25", 0.0 }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaignClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId", "VaccinationCampaignId" },
                values: new object[] { "634dcaba-f0f7-48b2-81e4-313a33894e13", "System", new DateTimeOffset(new DateTime(2025, 7, 10, 6, 44, 54, 957, DateTimeKind.Unspecified).AddTicks(2951), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "ec3a89e7-bdce-4444-8198-46a305dd3d1c", "c703b4f3-ec48-489a-858d-996f23d29eb7" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HealthActivityClasses",
                keyColumn: "Id",
                keyValue: "3416d822-ba4e-46f3-9fed-f08447de2398");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "0859fa2f-eef0-48f8-878a-36ad709fbdb7");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "6420bbaf-bca0-4fd9-b18d-4a411c21eba0");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "111d187d-1052-44ae-ac57-1685fa6433f7");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "3d21373e-8244-4400-90f3-bf26bd7655af");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "67aedbaf-c9e7-470a-b96b-cdb769c16a6f");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "7efc0ba8-c53d-409a-a141-fbdff96741bf");

            migrationBuilder.DeleteData(
                table: "MedicalStock",
                keyColumn: "Id",
                keyValue: "8a7c8242-09b8-4cde-8d3f-37fff2263ac5");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "028186dc-7921-421b-b925-059904f8c59f");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "edbb573d-b3e9-465b-a983-df25da5736c6");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaignClasses",
                keyColumn: "Id",
                keyValue: "634dcaba-f0f7-48b2-81e4-313a33894e13");

            migrationBuilder.DeleteData(
                table: "HealthActivity",
                keyColumn: "Id",
                keyValue: "e4d8f5f2-f47e-4b14-863a-2cbb82697773");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "1d4c6acc-77fe-4d6c-a0bb-248e0f809cea");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "2b8fe3d0-d30a-4736-b00b-17dfee3e9b67");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "cb8cd4da-b6bf-4eeb-82dd-4937f0233639");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "e74ca88f-5b1f-4c07-a29b-f3fc778696db");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaign",
                keyColumn: "Id",
                keyValue: "c703b4f3-ec48-489a-858d-996f23d29eb7");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "aab91532-74ac-4b5a-b5e8-a0779cb507e4");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "ec3a89e7-bdce-4444-8198-46a305dd3d1c");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "2b12e4d8-d731-4035-86b7-bbdc3f24a101");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "8bdded60-8fd4-4a5c-9bac-ce42592bea0d");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "158fbd5d-32b0-4f0f-ae9b-79692c1014c8");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "d9369787-6f23-4658-b707-3eb942961f16");

            migrationBuilder.DropColumn(
                name: "Supplier",
                table: "MedicalUsage");

            migrationBuilder.DropColumn(
                name: "Supplier",
                table: "MedicalStock");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "HealthProfile");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "HealthProfile");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "HealthCheckupRecord");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "HealthCheckupRecord");

            migrationBuilder.InsertData(
                table: "MedicalStock",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "DetailInformation", "ExpiryDate", "LastUpdatedBy", "LastUpdatedTime", "Name", "Quantity", "Status" },
                values: new object[,]
                {
                    { "415337a4-b9b1-4bcc-b406-0cad52be2c4b", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8702), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1h", 50, 0 },
                    { "491ac80d-6114-46f0-a299-12f527eae242", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8717), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket12h", 50, 0 },
                    { "50b49ed7-7d67-4d2e-ab50-70e28a6ecf77", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8696), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1m", 50, 0 },
                    { "91337070-d805-4e91-a4c5-efa44e4ec146", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8685), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1s", 100, 0 },
                    { "b6c0fff6-1d50-496b-b5c3-3e3bf07743a3", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8720), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket-24/7", 50, 0 }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "826ee8ba-81e3-4d2a-be23-81b91d48ad4e", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7761), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7762), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "971d1580-c72f-4202-81b8-72c6fd2a93cc", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7753), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "c06b3052-6744-484c-b51f-896e3bb0be76", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7756), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7757), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "f74f0873-47ab-4039-bd11-57f15f28caa0", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7764), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 792, DateTimeKind.Unspecified).AddTicks(7765), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "82b7f52f-30bf-4a31-a522-18141c517447", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8048), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 },
                    { "d319498e-0883-4e2f-a271-aa294031dc5b", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8052), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "017ce373-28cd-4e88-b579-d4d9e5ba3101", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 148, DateTimeKind.Unspecified).AddTicks(6108), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$CXg7iNDuGmaYYaUQdnfjgOjEs153F04VaV9zhgGXyMd/i0BfvCFyK", "0987651234", "c06b3052-6744-484c-b51f-896e3bb0be76" },
                    { "4ad6f400-cd78-440e-a553-5ea03b308e7d", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 20, 910, DateTimeKind.Unspecified).AddTicks(1060), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$2vDZAIOyJqWXkUOu8BqWPu04MFeHCpSqeSr1NbWUPIW8aa/9dz98O", "0987654321", "971d1580-c72f-4202-81b8-72c6fd2a93cc" },
                    { "7b476d02-42ac-4bed-aab8-93ea4c483239", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 27, DateTimeKind.Unspecified).AddTicks(6704), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$SEzXZOSCAfzZuaHwTALkaOf4CpNnuzBcjUFKwJ0JPJjVbaDoj3taK", "0912345678", "826ee8ba-81e3-4d2a-be23-81b91d48ad4e" },
                    { "af84f767-4c3b-41b2-a7ca-d14f877480ca", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(7293), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$a4wX0721vAwHLfV409UNwOGhi/T6CZmLHN.j.F8TUu8yS5MCt1S3S", "0987051234", "f74f0873-47ab-4039-bd11-57f15f28caa0" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "Status", "UserId" },
                values: new object[] { "d0d7fd7a-4153-416f-aeae-cc9597c13e41", "7b476d02-42ac-4bed-aab8-93ea4c483239", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8349), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Nha Cai Hang Dau So 1 Dong Nam A", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Bet88", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "7b476d02-42ac-4bed-aab8-93ea4c483239" });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "8a6bb4de-1d72-44f6-950e-7df94f5bd7b9", "82b7f52f-30bf-4a31-a522-18141c517447", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8122), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "af84f767-4c3b-41b2-a7ca-d14f877480ca" },
                    { "e15271db-e1df-4cee-93d4-877392148bf3", "d319498e-0883-4e2f-a271-aa294031dc5b", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8125), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "af84f767-4c3b-41b2-a7ca-d14f877480ca" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "Status", "UserId", "VaccineName", "VaccineType" },
                values: new object[] { "14cffa39-8494-4897-93a5-7f5161ce7d8f", "7b476d02-42ac-4bed-aab8-93ea4c483239", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8472), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "KT88", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "7b476d02-42ac-4bed-aab8-93ea4c483239", "Nha Cai Hang Dau So 1 Chau Au", "Flu" });

            migrationBuilder.InsertData(
                table: "HealthActivityClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "HealthActivityId", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId" },
                values: new object[] { "5c4e5339-01ed-4202-bcf0-3105f58861e7", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8416), new TimeSpan(0, 0, 0, 0, 0)), null, null, "d0d7fd7a-4153-416f-aeae-cc9597c13e41", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "82b7f52f-30bf-4a31-a522-18141c517447" });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "LastUpdatedBy", "LastUpdatedTime", "ParentNote", "StudentId", "VaccinationHistory", "Vision" },
                values: new object[,]
                {
                    { "031a3887-9cc5-4bee-9c50-cef4256036c7", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8263), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "e15271db-e1df-4cee-93d4-877392148bf3", "Fully using Rocket24/7", "20/25" },
                    { "cf392ce2-265a-4239-93db-faff2fecb03c", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8254), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "8a6bb4de-1d72-44f6-950e-7df94f5bd7b9", "Fully using Rocket1h", "20/20" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaignClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId", "VaccinationCampaignId" },
                values: new object[] { "3e91bdcf-11b0-4e00-bdf7-cccd154a879e", "System", new DateTimeOffset(new DateTime(2025, 7, 3, 8, 8, 21, 263, DateTimeKind.Unspecified).AddTicks(8619), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "d319498e-0883-4e2f-a271-aa294031dc5b", "14cffa39-8494-4897-93a5-7f5161ce7d8f" });
        }
    }
}
