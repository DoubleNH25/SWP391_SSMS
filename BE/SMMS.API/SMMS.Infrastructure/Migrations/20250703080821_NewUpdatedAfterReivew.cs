using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewUpdatedAfterReivew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicalStock",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DetailInformation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalStock", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SchoolClass",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClassName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClassRoom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolClass", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Blog",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Excerpt = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    View = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Blog_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HealthActivity",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduledDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthActivity_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    EventId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notification_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Student",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClassId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentNumber = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentCode = table.Column<string>(type: "nvarchar(max)", nullable: false, computedColumnSql: "'STD' + CAST([StudentNumber] AS VARCHAR(10))"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Student", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Student_SchoolClass_ClassId",
                        column: x => x.ClassId,
                        principalTable: "SchoolClass",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Student_User_ParentId",
                        column: x => x.ParentId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VaccinationCampaign",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VaccineName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EXP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MFG = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VaccineType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccinationCampaign", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccinationCampaign_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthActivityClasses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HealthActivityId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SchoolClassId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthActivityClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthActivityClasses_HealthActivity_HealthActivityId",
                        column: x => x.HealthActivityId,
                        principalTable: "HealthActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HealthActivityClasses_SchoolClass_SchoolClassId",
                        column: x => x.SchoolClassId,
                        principalTable: "SchoolClass",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HealthCheckupRecord",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HealthActivityId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Vision = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hearing = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dental = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BMI = table.Column<double>(type: "float", nullable: false),
                    AbnormalNote = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecordDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsLatest = table.Column<bool>(type: "bit", nullable: false),
                    CheckingStatus = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthCheckupRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthCheckupRecord_HealthActivity_HealthActivityId",
                        column: x => x.HealthActivityId,
                        principalTable: "HealthActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HealthCheckupRecord_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HealthProfile",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Vision = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Hearing = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dental = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BMI = table.Column<double>(type: "float", nullable: false),
                    AbnormalNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VaccinationHistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthProfile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthProfile_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicalIncident",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IncidentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalIncident", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalIncident_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicalIncident_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRequest",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MedicationName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Form = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Route = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Frequency = table.Column<int>(type: "int", nullable: false),
                    TotalQuantity = table.Column<int>(type: "int", nullable: false),
                    RemainingQuantity = table.Column<int>(type: "int", nullable: false),
                    TimeToAdminister = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalRequest_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicalRequest_User_ParentId",
                        column: x => x.ParentId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalRequest_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ActivityConsent",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    VaccinationCampaignId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    HealthActivityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ScheduleTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActivityType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityConsent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityConsent_HealthActivity_HealthActivityId",
                        column: x => x.HealthActivityId,
                        principalTable: "HealthActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActivityConsent_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActivityConsent_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActivityConsent_VaccinationCampaign_VaccinationCampaignId",
                        column: x => x.VaccinationCampaignId,
                        principalTable: "VaccinationCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VaccinationCampaignClasses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    VaccinationCampaignId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SchoolClassId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccinationCampaignClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccinationCampaignClasses_SchoolClass_SchoolClassId",
                        column: x => x.SchoolClassId,
                        principalTable: "SchoolClass",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VaccinationCampaignClasses_VaccinationCampaign_VaccinationCampaignId",
                        column: x => x.VaccinationCampaignId,
                        principalTable: "VaccinationCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VaccinationRecord",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    VaccinationCampaignId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ResultNote = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    VaccinatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccinationRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccinationRecord_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VaccinationRecord_VaccinationCampaign_VaccinationCampaignId",
                        column: x => x.VaccinationCampaignId,
                        principalTable: "VaccinationCampaign",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ConselingSchedule",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MedicalStaffId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HealthCheckupId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MeetingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ParentRejectNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConselingSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConselingSchedule_HealthCheckupRecord_HealthCheckupId",
                        column: x => x.HealthCheckupId,
                        principalTable: "HealthCheckupRecord",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConselingSchedule_Student_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Student",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConselingSchedule_User_MedicalStaffId",
                        column: x => x.MedicalStaffId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConselingSchedule_User_ParentId",
                        column: x => x.ParentId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicalUsage",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MedicalIncidentId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MedicalStockId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MedicalName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dosage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalUsage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalUsage_MedicalIncident_MedicalIncidentId",
                        column: x => x.MedicalIncidentId,
                        principalTable: "MedicalIncident",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicalUsage_MedicalStock_MedicalStockId",
                        column: x => x.MedicalStockId,
                        principalTable: "MedicalStock",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MedicationRequestAdministration",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MedicalRequestId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    AdministeredBy = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AdministeredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DoseGiven = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WasTaken = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    LastUpdatedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    DeletedTime = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationRequestAdministration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationRequestAdministration_MedicalRequest_MedicalRequestId",
                        column: x => x.MedicalRequestId,
                        principalTable: "MedicalRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicationRequestAdministration_User_AdministeredBy",
                        column: x => x.AdministeredBy,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ActivityConsent_HealthActivityId",
                table: "ActivityConsent",
                column: "HealthActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityConsent_StudentId",
                table: "ActivityConsent",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityConsent_UserId",
                table: "ActivityConsent",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityConsent_VaccinationCampaignId",
                table: "ActivityConsent",
                column: "VaccinationCampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_Blog_UserId",
                table: "Blog",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConselingSchedule_HealthCheckupId",
                table: "ConselingSchedule",
                column: "HealthCheckupId");

            migrationBuilder.CreateIndex(
                name: "IX_ConselingSchedule_MedicalStaffId",
                table: "ConselingSchedule",
                column: "MedicalStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_ConselingSchedule_ParentId",
                table: "ConselingSchedule",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_ConselingSchedule_StudentId",
                table: "ConselingSchedule",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthActivity_UserId",
                table: "HealthActivity",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthActivityClasses_HealthActivityId",
                table: "HealthActivityClasses",
                column: "HealthActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthActivityClasses_SchoolClassId",
                table: "HealthActivityClasses",
                column: "SchoolClassId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheckupRecord_HealthActivityId",
                table: "HealthCheckupRecord",
                column: "HealthActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheckupRecord_StudentId",
                table: "HealthCheckupRecord",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthProfile_StudentId",
                table: "HealthProfile",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalIncident_StudentId",
                table: "MedicalIncident",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalIncident_UserId",
                table: "MedicalIncident",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequest_ParentId",
                table: "MedicalRequest",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequest_StudentId",
                table: "MedicalRequest",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRequest_UserId",
                table: "MedicalRequest",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalUsage_MedicalIncidentId",
                table: "MedicalUsage",
                column: "MedicalIncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalUsage_MedicalStockId",
                table: "MedicalUsage",
                column: "MedicalStockId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationRequestAdministration_AdministeredBy",
                table: "MedicationRequestAdministration",
                column: "AdministeredBy");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationRequestAdministration_MedicalRequestId",
                table: "MedicationRequestAdministration",
                column: "MedicalRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_UserId",
                table: "Notification",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Student_ClassId",
                table: "Student",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Student_ParentId",
                table: "Student",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_User_RoleId",
                table: "User",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationCampaign_UserId",
                table: "VaccinationCampaign",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationCampaignClasses_SchoolClassId",
                table: "VaccinationCampaignClasses",
                column: "SchoolClassId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationCampaignClasses_VaccinationCampaignId",
                table: "VaccinationCampaignClasses",
                column: "VaccinationCampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationRecord_StudentId",
                table: "VaccinationRecord",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccinationRecord_VaccinationCampaignId",
                table: "VaccinationRecord",
                column: "VaccinationCampaignId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityConsent");

            migrationBuilder.DropTable(
                name: "Blog");

            migrationBuilder.DropTable(
                name: "ConselingSchedule");

            migrationBuilder.DropTable(
                name: "HealthActivityClasses");

            migrationBuilder.DropTable(
                name: "HealthProfile");

            migrationBuilder.DropTable(
                name: "MedicalUsage");

            migrationBuilder.DropTable(
                name: "MedicationRequestAdministration");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "VaccinationCampaignClasses");

            migrationBuilder.DropTable(
                name: "VaccinationRecord");

            migrationBuilder.DropTable(
                name: "HealthCheckupRecord");

            migrationBuilder.DropTable(
                name: "MedicalIncident");

            migrationBuilder.DropTable(
                name: "MedicalStock");

            migrationBuilder.DropTable(
                name: "MedicalRequest");

            migrationBuilder.DropTable(
                name: "VaccinationCampaign");

            migrationBuilder.DropTable(
                name: "HealthActivity");

            migrationBuilder.DropTable(
                name: "Student");

            migrationBuilder.DropTable(
                name: "SchoolClass");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
