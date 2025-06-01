using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRequired : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "42542daf-040f-429f-801a-d447e00e1aba");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "4d76a3b1-0948-48f0-9083-6fb54374a885");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "baf086b2-d6c2-4f87-a49d-9bf0febec4e6");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "cb68fee9-0ce2-48a3-869e-9a12e651cd6e");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "07d47c0a-ec6a-416e-b6b9-2c709b10ab72");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "519e7328-7eb8-468e-af78-5434344e7bd5");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "bebe626f-94ba-4518-b718-90470e210070");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "e3deb03d-2997-4895-b3ee-da0cae2586a7");

            migrationBuilder.AlterColumn<string>(
                name: "VaccinationCampaignId",
                table: "ActivityConsent",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "HealthActivityId",
                table: "ActivityConsent",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Comments",
                table: "ActivityConsent",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ActivityType",
                table: "ActivityConsent",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<string>(
                name: "VaccinationCampaignId",
                table: "ActivityConsent",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HealthActivityId",
                table: "ActivityConsent",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Comments",
                table: "ActivityConsent",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ActivityType",
                table: "ActivityConsent",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "07d47c0a-ec6a-416e-b6b9-2c709b10ab72", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2160), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2160), new TimeSpan(0, 0, 0, 0, 0)), "Parent" },
                    { "519e7328-7eb8-468e-af78-5434344e7bd5", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2150), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2151), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "bebe626f-94ba-4518-b718-90470e210070", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2155), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2157), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "e3deb03d-2997-4895-b3ee-da0cae2586a7", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 753, DateTimeKind.Unspecified).AddTicks(2146), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "42542daf-040f-429f-801a-d447e00e1aba", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 992, DateTimeKind.Unspecified).AddTicks(4257), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$6i7h0oKXiTaV7xwAIIqIJ.8QJGkKJ3IZm2Q3yQcPNjrwL0J4iFBHu", "0912345678", "bebe626f-94ba-4518-b718-90470e210070" },
                    { "4d76a3b1-0948-48f0-9083-6fb54374a885", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 6, 874, DateTimeKind.Unspecified).AddTicks(6720), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$9CKbhXcAocmGdiLF/RnEBebb.bLlUNIUBZHRkNNYYgB/.PxvY9.wq", "0987654321", "e3deb03d-2997-4895-b3ee-da0cae2586a7" },
                    { "baf086b2-d6c2-4f87-a49d-9bf0febec4e6", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 7, 110, DateTimeKind.Unspecified).AddTicks(7078), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$TblAtwHWxeXA3yDBJUH5l.rGvCM5VSB.4Wxw3zoSK1yhVZrC8E9zy", "0987651234", "519e7328-7eb8-468e-af78-5434344e7bd5" },
                    { "cb68fee9-0ce2-48a3-869e-9a12e651cd6e", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 8, 6, 7, 231, DateTimeKind.Unspecified).AddTicks(3765), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$fQvoOkKcuWaLtOwKYIvOGu3mI3jcxEQa.ztBSmQSZEUkD5Eze3r0S", "0987051234", "07d47c0a-ec6a-416e-b6b9-2c709b10ab72" }
                });
        }
    }
}
