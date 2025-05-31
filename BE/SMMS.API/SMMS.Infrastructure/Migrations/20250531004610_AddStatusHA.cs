using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusHA : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "32a3346f-bb46-4bcb-a397-f458f574e722");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "697f1d8b-9cdc-4358-8650-1d773a40af85");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "a3ca1283-a371-403d-b1b3-4929f53678f3");

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: "f4a37e95-e94f-47c5-8f69-35d537c3f088");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "349fb78c-744c-47b5-8463-aed1426b4f9d");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "6779ebc6-0ce2-45bb-a561-fd913aad7c79");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "c5298ccd-12eb-454d-8325-28250a9d1385");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "d84b1e4b-bf61-4672-a1d2-552245ee6af8");

            migrationBuilder.AddColumn<bool>(
                name: "IsAccepted",
                table: "HealthActivity",
                type: "bit",
                nullable: false,
                defaultValue: false);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "IsAccepted",
                table: "HealthActivity");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "349fb78c-744c-47b5-8463-aed1426b4f9d", "System", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3943), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "6779ebc6-0ce2-45bb-a561-fd913aad7c79", "System", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3947), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3947), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "c5298ccd-12eb-454d-8325-28250a9d1385", "System", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3954), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3954), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "d84b1e4b-bf61-4672-a1d2-552245ee6af8", "System", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3957), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 37, 902, DateTimeKind.Unspecified).AddTicks(3957), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "32a3346f-bb46-4bcb-a397-f458f574e722", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 38, 134, DateTimeKind.Unspecified).AddTicks(9274), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$/7D1fguexmWEL9sgIp/CSeWvayTNVkbDLoyR3PoWhumVoeZN51Byu", "0912345678", "c5298ccd-12eb-454d-8325-28250a9d1385" },
                    { "697f1d8b-9cdc-4358-8650-1d773a40af85", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 38, 17, DateTimeKind.Unspecified).AddTicks(5514), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$Y2XzYj7Kr6yVy.ZAc/DGLeDfAAmkSois/H0t1jgrSG2wzWh3FYDKu", "0987654321", "349fb78c-744c-47b5-8463-aed1426b4f9d" },
                    { "a3ca1283-a371-403d-b1b3-4929f53678f3", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 38, 366, DateTimeKind.Unspecified).AddTicks(6243), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$sGKqTKGG4rjZ5LSRTW/YZeQ/qB1kjaJYp2e.dppiPbNFuGg5xRzKy", "0987051234", "d84b1e4b-bf61-4672-a1d2-552245ee6af8" },
                    { "f4a37e95-e94f-47c5-8f69-35d537c3f088", "SeedData", new DateTimeOffset(new DateTime(2025, 5, 27, 4, 37, 38, 252, DateTimeKind.Unspecified).AddTicks(3464), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$LNpTtZBTczddc8ymNO/pIu1muKdd2KLya1023vls6IKMuMDs7Cw2G", "0987651234", "6779ebc6-0ce2-45bb-a561-fd913aad7c79" }
                });
        }
    }
}
