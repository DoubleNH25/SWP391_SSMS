using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
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
                    { "11ecc00e-c42c-481e-8395-2c859366559d", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3407), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket12h", 50, 0 },
                    { "517f5e42-e142-40ae-a9ce-af3709af63ef", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3363), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1s", 100, 0 },
                    { "a5780575-0a47-45a5-9233-00eee8312e8f", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3411), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket-24/7", 50, 0 },
                    { "a83b386f-4429-4376-b2f8-65f091fa0e60", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3376), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1h", 50, 0 },
                    { "dda70569-8148-4b98-a9f4-c52439672989", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3371), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1m", 50, 0 }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "2daa2f90-8219-4cc6-82ee-1e62330987c6", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6166), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6166), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "a826145d-b586-4701-b1b4-528f48d022fc", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6174), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6174), new TimeSpan(0, 0, 0, 0, 0)), "Parent" },
                    { "ab16b5df-da9d-4752-8296-c8bb255f3336", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6170), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6171), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "fa6725ff-fdcb-4387-8a69-81d574ce7fc6", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 26, 935, DateTimeKind.Unspecified).AddTicks(6162), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "2d3d807d-60cf-438b-a118-0a59b93dea16", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(2866), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 },
                    { "5dc5695d-fa89-4868-a491-295a193d9035", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(2863), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "36829671-692c-48b0-99d0-46fd81c2a764", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 49, DateTimeKind.Unspecified).AddTicks(9911), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$tt/5IsDXvnm0/qEoPU3IO.zzxw5QABHYNgx3GBHL5TFHBAuTBf83K", "0987654321", "fa6725ff-fdcb-4387-8a69-81d574ce7fc6" },
                    { "5eb048c7-8d1b-4907-a764-d31951cfa251", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 164, DateTimeKind.Unspecified).AddTicks(787), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$oMvw1UqOvN3wylHI49KeQeTm9Jy9HlivsTIirMtFBcGtUck7y/3z2", "0912345678", "ab16b5df-da9d-4752-8296-c8bb255f3336" },
                    { "6b91844f-aadd-469f-aa28-9555642826bb", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 277, DateTimeKind.Unspecified).AddTicks(7401), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$vytDUgNFsUxsNYipO/3Hqu07aS1AjrroaFJzKLfHST9eydt1aHXAO", "0987651234", "2daa2f90-8219-4cc6-82ee-1e62330987c6" },
                    { "747c9843-657b-473e-a340-406fe5d934a3", "SeedData", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(2165), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$z7g5i9rdXM8MEFjBaRzuxeG6HEZ7ypHBjRYJSav8c9RAhS4FQ0SaK", "0987051234", "a826145d-b586-4701-b1b4-528f48d022fc" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "Status", "UserId" },
                values: new object[] { "42561153-4fc7-4a2f-938d-7b61d062e118", "5eb048c7-8d1b-4907-a764-d31951cfa251", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3157), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Nha Cai Hang Dau So 1 Dong Nam A", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Bet88", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "5eb048c7-8d1b-4907-a764-d31951cfa251" });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "43add8a1-bf31-41c4-a2a2-fb88f9297d4d", "5dc5695d-fa89-4868-a491-295a193d9035", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(2921), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "747c9843-657b-473e-a340-406fe5d934a3" },
                    { "6b994363-b5f6-4413-bef0-e722309115b5", "2d3d807d-60cf-438b-a118-0a59b93dea16", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(2964), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "747c9843-657b-473e-a340-406fe5d934a3" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "Status", "UserId", "VaccineName", "VaccineType" },
                values: new object[] { "38dcc4d8-65be-4ad9-98aa-522d46716261", "5eb048c7-8d1b-4907-a764-d31951cfa251", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3274), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "KT88", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "5eb048c7-8d1b-4907-a764-d31951cfa251", "Nha Cai Hang Dau So 1 Chau Au", "Flu" });

            migrationBuilder.InsertData(
                table: "HealthActivityClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "HealthActivityId", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId" },
                values: new object[] { "a46384f7-2cb1-4f30-b26f-be4b2c345d06", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3221), new TimeSpan(0, 0, 0, 0, 0)), null, null, "42561153-4fc7-4a2f-938d-7b61d062e118", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "5dc5695d-fa89-4868-a491-295a193d9035" });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "LastUpdatedBy", "LastUpdatedTime", "StudentId", "VaccinationHistory", "Vision" },
                values: new object[,]
                {
                    { "5db6262d-dab5-4bdd-b060-a5c40ad3f555", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3104), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "43add8a1-bf31-41c4-a2a2-fb88f9297d4d", "Fully using Rocket1h", "20/20" },
                    { "f0fa89af-065a-43f9-8266-6d57b6e797a7", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3112), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "6b994363-b5f6-4413-bef0-e722309115b5", "Fully using Rocket24/7", "20/25" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaignClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId", "VaccinationCampaignId" },
                values: new object[] { "5e5323fb-11fe-401b-bc75-c9cfcef013d0", "System", new DateTimeOffset(new DateTime(2025, 6, 24, 8, 6, 27, 392, DateTimeKind.Unspecified).AddTicks(3308), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "2d3d807d-60cf-438b-a118-0a59b93dea16", "38dcc4d8-65be-4ad9-98aa-522d46716261" });

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
