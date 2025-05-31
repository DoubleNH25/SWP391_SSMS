using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "35e26630-5914-4375-aca3-c622d03c7507");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "664494b3-a1ea-43ad-97f4-0d66952ca81a");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "7e7e7c05-9ad9-4f3a-8855-45fb447cbed5");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "da21d8d2-0698-421b-8de5-12a6a4aa2c38");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "d6d7cfaa-93c5-4a95-9731-3adf8ec65969");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "df02cb11-ece8-4176-80e5-801741dad5e2");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "edf02ecd-fb28-4140-adf7-84a7c158a1ed");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "efc7b0ae-76dd-4906-848d-973855797a3c");

            migrationBuilder.AddColumn<bool>(
                name: "IsAccepted",
                table: "VaccinationCampaign",
                type: "bit",
                nullable: false,
                defaultValue: false);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "IsAccepted",
                table: "VaccinationCampaign");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "d6d7cfaa-93c5-4a95-9731-3adf8ec65969", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7459), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7460), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "df02cb11-ece8-4176-80e5-801741dad5e2", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7476), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7476), new TimeSpan(0, 0, 0, 0, 0)), "Parent" },
                    { "edf02ecd-fb28-4140-adf7-84a7c158a1ed", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7448), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "efc7b0ae-76dd-4906-848d-973855797a3c", "System", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7454), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 523, DateTimeKind.Unspecified).AddTicks(7454), new TimeSpan(0, 0, 0, 0, 0)), "Manager" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "35e26630-5914-4375-aca3-c622d03c7507", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 805, DateTimeKind.Unspecified).AddTicks(7591), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$kPt1zfQYLWdXYStrJAvJHeR0flrBPkpE43dF3JKmfW8PncjpAMV4e", "0912345678", "d6d7cfaa-93c5-4a95-9731-3adf8ec65969" },
                    { "664494b3-a1ea-43ad-97f4-0d66952ca81a", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 10, 97, DateTimeKind.Unspecified).AddTicks(4867), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$Qz.79gAPVieVVztTLW1pn.pqrQNKn7G12edCpcCE72MXPUmTDXx52", "0987051234", "df02cb11-ece8-4176-80e5-801741dad5e2" },
                    { "7e7e7c05-9ad9-4f3a-8855-45fb447cbed5", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 958, DateTimeKind.Unspecified).AddTicks(4175), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$pHTB4aq4BkR5ajsgsWhP/uQhs3btpTZPQot6CK1mAi9istgh6Bf8i", "0987651234", "efc7b0ae-76dd-4906-848d-973855797a3c" },
                    { "da21d8d2-0698-421b-8de5-12a6a4aa2c38", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 31, 0, 46, 9, 671, DateTimeKind.Unspecified).AddTicks(4872), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$gpKbs42hwY0yhkybr1FrsePpvlTHaznd/hDETS8Mhdit.xbvXTUDq", "0987654321", "edf02ecd-fb28-4140-adf7-84a7c158a1ed" }
                });
        }
    }
}
