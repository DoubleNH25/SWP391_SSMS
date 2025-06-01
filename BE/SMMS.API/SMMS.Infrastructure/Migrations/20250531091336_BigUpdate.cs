using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BigUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "27c0536e-449a-4ad8-9195-77c6080318e5");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "5597a171-09c1-4526-93d1-f0f8127e5318");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "c3c86baf-adc8-4e85-9beb-af667b988718");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "ebfd9f36-b7ac-46b5-8c26-c3b37e2aa1ef");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "7b2f1e2f-a24c-478e-9bcc-338c1c8f456f");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "86f70c6b-b77f-4d9f-be7e-6312db6b409b");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "d2ab8efb-c48f-4b15-b4de-157f03a80161");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "de319b76-c54e-4cfd-bd61-aaf468f1b75e");

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "VaccinationRecord",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Time",
                table: "HealthCheckupRecord",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "306386d5-4764-4f90-aaf2-f619c31a4092", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8353), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8354), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "6d23e1eb-c450-4e32-9da2-ce538d19abc8", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8306), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "97c594c8-3d7d-4b1b-ba3a-f0901dcfbb60", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8316), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8318), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "c08fb23a-63f3-42bd-a5e4-fac1ba03488e", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8374), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 573, DateTimeKind.Unspecified).AddTicks(8375), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "23d712d4-3437-4d5b-bb56-40727e2266a9", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9774), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 },
                    { "3cf4156f-3fd4-4714-9aec-565b42300625", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9769), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "IsAccepted", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "VaccineName", "VaccineType" },
                values: new object[,]
                {
                    { "effde0d1-504d-4d07-84d3-3b570d458121", "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 52, DateTimeKind.Unspecified).AddTicks(583), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Flu Vaccination 2025", new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Influenza Vaccine", "Influenza" },
                    { "f9e19210-ef40-4505-a67a-2c62a612cea3", "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 52, DateTimeKind.Unspecified).AddTicks(589), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2027, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), false, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "HPV Vaccination 2025", new DateTime(2025, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "HPV Vaccine", "HPV" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "0bd963bf-1a20-431e-a0a4-c633be04d08c", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9008), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$cgRKSCB2PevPwqZ8m7zFzOqW1RWB.fZZQSVDapetgRCyzgXeobDW6", "0987051234", "c08fb23a-63f3-42bd-a5e4-fac1ba03488e" },
                    { "b716b062-9da9-40e9-b641-41aea771d7ab", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 694, DateTimeKind.Unspecified).AddTicks(2549), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$HbLXOyGvunMfm6r30DERaONbKn08Obj1S/J3l8kyby6HhubNmLOTu", "0987654321", "6d23e1eb-c450-4e32-9da2-ce538d19abc8" },
                    { "bf59303b-408c-45f1-971f-ce3ebe499e1e", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 931, DateTimeKind.Unspecified).AddTicks(7484), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$wC0daEZGxIgvXWrRFbeKA.0sjZnij5Qo1DsHNNi3Hu.GUaEuwuYTq", "0987651234", "97c594c8-3d7d-4b1b-ba3a-f0901dcfbb60" },
                    { "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 35, 816, DateTimeKind.Unspecified).AddTicks(3152), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$RvS4jcuTsIDvA2NHLG24tupvl8i1brx.K.bTTl0vhzhPeml8g8yf6", "0912345678", "306386d5-4764-4f90-aaf2-f619c31a4092" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "IsAccepted", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "UserId" },
                values: new object[,]
                {
                    { "07e3bf6c-f142-4c34-bbd5-f5fc8e0dcf75", "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 52, DateTimeKind.Unspecified).AddTicks(474), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Routine health checkup for all students", false, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Annual Health Checkup 2025", new DateTime(2025, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a" },
                    { "4cb2cc02-d294-4ba3-a911-8c221f73cb4d", "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 52, DateTimeKind.Unspecified).AddTicks(484), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Vision screening for students in grades 10", false, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Vision Screening 2025", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a" }
                });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "4d0e0ba8-42d5-4772-90e0-861c1baa8d61", "3cf4156f-3fd4-4714-9aec-565b42300625", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9838), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "0bd963bf-1a20-431e-a0a4-c633be04d08c" },
                    { "fd00cb37-003f-46e1-a7d3-67be84bb1c6b", "23d712d4-3437-4d5b-bb56-40727e2266a9", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9842), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "0bd963bf-1a20-431e-a0a4-c633be04d08c" }
                });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "LastUpdatedBy", "LastUpdatedTime", "StudentId", "VaccinationHistory", "Vision" },
                values: new object[,]
                {
                    { "c38b8671-c3e5-495c-b35e-819d1c86bc7d", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9944), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "fd00cb37-003f-46e1-a7d3-67be84bb1c6b", "Fully vaccinated", "20/25" },
                    { "e6c15ab9-de9f-40bb-934a-546973891dde", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 5, 31, 9, 13, 36, 51, DateTimeKind.Unspecified).AddTicks(9927), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "4d0e0ba8-42d5-4772-90e0-861c1baa8d61", "Fully vaccinated", "20/20" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "HealthActivity",
                keyColumn: "Id",
                keyValue: "07e3bf6c-f142-4c34-bbd5-f5fc8e0dcf75");

            migrationBuilder.DeleteData(
                table: "HealthActivity",
                keyColumn: "Id",
                keyValue: "4cb2cc02-d294-4ba3-a911-8c221f73cb4d");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "c38b8671-c3e5-495c-b35e-819d1c86bc7d");

            migrationBuilder.DeleteData(
                table: "HealthProfile",
                keyColumn: "Id",
                keyValue: "e6c15ab9-de9f-40bb-934a-546973891dde");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "b716b062-9da9-40e9-b641-41aea771d7ab");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "bf59303b-408c-45f1-971f-ce3ebe499e1e");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaign",
                keyColumn: "Id",
                keyValue: "effde0d1-504d-4d07-84d3-3b570d458121");

            migrationBuilder.DeleteData(
                table: "VaccinationCampaign",
                keyColumn: "Id",
                keyValue: "f9e19210-ef40-4505-a67a-2c62a612cea3");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "6d23e1eb-c450-4e32-9da2-ce538d19abc8");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "97c594c8-3d7d-4b1b-ba3a-f0901dcfbb60");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "4d0e0ba8-42d5-4772-90e0-861c1baa8d61");

            migrationBuilder.DeleteData(
                table: "Student",
                keyColumn: "Id",
                keyValue: "fd00cb37-003f-46e1-a7d3-67be84bb1c6b");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "dbc4b466-18e3-42a6-8c5d-be6d1d43fd8a");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "306386d5-4764-4f90-aaf2-f619c31a4092");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "23d712d4-3437-4d5b-bb56-40727e2266a9");

            migrationBuilder.DeleteData(
                table: "SchoolClass",
                keyColumn: "Id",
                keyValue: "3cf4156f-3fd4-4714-9aec-565b42300625");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "0bd963bf-1a20-431e-a0a4-c633be04d08c");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "c08fb23a-63f3-42bd-a5e4-fac1ba03488e");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "VaccinationRecord");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "HealthCheckupRecord");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "7b2f1e2f-a24c-478e-9bcc-338c1c8f456f", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9411), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9411), new TimeSpan(0, 0, 0, 0, 0)), "Parent" },
                    { "86f70c6b-b77f-4d9f-be7e-6312db6b409b", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9382), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "d2ab8efb-c48f-4b15-b4de-157f03a80161", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9408), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9408), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "de319b76-c54e-4cfd-bd61-aaf468f1b75e", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9405), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 791, DateTimeKind.Unspecified).AddTicks(9405), new TimeSpan(0, 0, 0, 0, 0)), "Manager" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "27c0536e-449a-4ad8-9195-77c6080318e5", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 7, 910, DateTimeKind.Unspecified).AddTicks(8274), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$7YtM593Op2VDUjBz9h22GORYDXLFVWPtRjwP9cmT7GLxGOZfhhyUC", "0987654321", "86f70c6b-b77f-4d9f-be7e-6312db6b409b" },
                    { "5597a171-09c1-4526-93d1-f0f8127e5318", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 8, 26, DateTimeKind.Unspecified).AddTicks(368), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$p4YMspJ6aOstoyo.o/qZgugJrjsH1O6skFsk1ENQKv89vKg.FFdGi", "0912345678", "d2ab8efb-c48f-4b15-b4de-157f03a80161" },
                    { "c3c86baf-adc8-4e85-9beb-af667b988718", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 8, 140, DateTimeKind.Unspecified).AddTicks(6475), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$TawDA76Y9P.BL9KPrXwPx.6LAlEXIWFS/MOti3U90hwqXXfJpmDd6", "0987651234", "de319b76-c54e-4cfd-bd61-aaf468f1b75e" },
                    { "ebfd9f36-b7ac-46b5-8c26-c3b37e2aa1ef", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 28, 8, 256, DateTimeKind.Unspecified).AddTicks(27), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$aH9cqUypQC9Kw2QZZ6ctzujvq1vZstGzjbziY.jP2IZZe6Lyg/kpO", "0987051234", "7b2f1e2f-a24c-478e-9bcc-338c1c8f456f" }
                });
        }
    }
}
