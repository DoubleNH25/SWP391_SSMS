using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewInit : Migration
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
                    Supplier = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                    Weight = table.Column<double>(type: "float", nullable: false),
                    Height = table.Column<double>(type: "float", nullable: false),
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
                    Weight = table.Column<double>(type: "float", nullable: false),
                    Height = table.Column<double>(type: "float", nullable: false),
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
                    Supplier = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "DetailInformation", "ExpiryDate", "LastUpdatedBy", "LastUpdatedTime", "Name", "Quantity", "Status", "Supplier" },
                values: new object[,]
                {
                    { "774b09a7-e6c2-415b-ae01-9387ee1b6adc", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(4154), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket12h", 50, 0, "VitaCare" },
                    { "7d1262d4-d1b4-4e8e-abda-7cfb76e16e71", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(4138), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1h", 50, 0, "HealthPlus" },
                    { "c6f2317a-abcb-40bf-95b6-a436cb925eb4", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(4132), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1m", 50, 0, "MediSupply" },
                    { "de3e49d9-6846-446c-b846-2c9d0c7e6e62", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(4121), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket1s", 100, 0, "PharmaCorp" },
                    { "de7ff374-9eea-402a-a883-a2417fdc7672", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(4158), new TimeSpan(0, 0, 0, 0, 0)), null, null, "A supplement for enhancing health and vitality", new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Rocket-24/7", 50, 0, "WellnessPharma" }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "RoleName" },
                values: new object[,]
                {
                    { "8c52409b-1e92-4e0e-823c-557059607698", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1409), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1410), new TimeSpan(0, 0, 0, 0, 0)), "Nurse" },
                    { "a494c983-072e-4dab-94d8-2cab26e29c3b", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1405), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1405), new TimeSpan(0, 0, 0, 0, 0)), "Manager" },
                    { "aa6e8bdd-e258-40f2-aa48-f1a57f3fc219", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1402), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Admin" },
                    { "eb9346d1-7830-4475-94af-2e4673bb8484", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1423), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 37, 901, DateTimeKind.Unspecified).AddTicks(1423), new TimeSpan(0, 0, 0, 0, 0)), "Parent" }
                });

            migrationBuilder.InsertData(
                table: "SchoolClass",
                columns: new[] { "Id", "ClassName", "ClassRoom", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "Quantity" },
                values: new object[,]
                {
                    { "3f738604-9ab0-470e-ba4a-41b0832e2794", "Class 10B", "Room 102", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(2975), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 28 },
                    { "913409a4-230c-45dd-8d1b-6dcaecda2523", "Class 10A", "Room 101", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(2970), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), 30 }
                });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Email", "FullName", "Image", "LastUpdatedBy", "LastUpdatedTime", "Password", "Phone", "RoleId" },
                values: new object[,]
                {
                    { "0f10cd22-135a-4b9b-8424-ac0c06e17bc2", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(2166), new TimeSpan(0, 0, 0, 0, 0)), null, null, "parent@gmail.com", "KietBap", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$5faVI/BNHRQgd9VSoGZoSe0.imeuEcx.gAQickYLaetXf03/v82li", "0987051234", "eb9346d1-7830-4475-94af-2e4673bb8484" },
                    { "327bf02f-da2f-49f3-9146-9a3a1d7a7a23", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 23, DateTimeKind.Unspecified).AddTicks(8114), new TimeSpan(0, 0, 0, 0, 0)), null, null, "admin@gmail.com", "KICM vippro", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$rvD.BqKbjswNapU0ADG1EOBrQT3ogcTdG15Rw4S0Lyj9QDKsv6ugi", "0987654321", "aa6e8bdd-e258-40f2-aa48-f1a57f3fc219" },
                    { "6c21ab80-b663-4705-9bdc-29cba885ac5a", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 147, DateTimeKind.Unspecified).AddTicks(392), new TimeSpan(0, 0, 0, 0, 0)), null, null, "nurse@gmail.com", "Jack97", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$G.fDcYSyj3M.2Lc4RPC/i.yQFNZAyITbFUuTGOImTQq59djpNuaJK", "0912345678", "8c52409b-1e92-4e0e-823c-557059607698" },
                    { "9d92a08d-66d1-4bb4-97b3-1be1b7eb3f60", "SeedData", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 265, DateTimeKind.Unspecified).AddTicks(534), new TimeSpan(0, 0, 0, 0, 0)), null, null, "manager@gmail.com", "FireFly", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "$2a$11$7kCUWtWk0BzSg0.sLHHa7O1udwIbYki.wykOt6b.1nnJbeHYDn31C", "0987651234", "a494c983-072e-4dab-94d8-2cab26e29c3b" }
                });

            migrationBuilder.InsertData(
                table: "HealthActivity",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Description", "LastUpdatedBy", "LastUpdatedTime", "Name", "ScheduledDate", "Status", "UserId" },
                values: new object[] { "b857d305-8a7c-4f22-b509-e8f2d283084e", "6c21ab80-b663-4705-9bdc-29cba885ac5a", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3743), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Nha Cai Hang Dau So 1 Dong Nam A", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "Bet88", new DateTime(2024, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "6c21ab80-b663-4705-9bdc-29cba885ac5a" });

            migrationBuilder.InsertData(
                table: "Student",
                columns: new[] { "Id", "ClassId", "CreatedBy", "CreatedTime", "DateOfBirth", "DeletedBy", "DeletedTime", "FullName", "Gender", "Image", "LastUpdatedBy", "LastUpdatedTime", "ParentId" },
                values: new object[,]
                {
                    { "205fa6a1-bc72-41dd-950d-2c7a94f9fd13", "913409a4-230c-45dd-8d1b-6dcaecda2523", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3052), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Nguyen Van A", "Male", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "0f10cd22-135a-4b9b-8424-ac0c06e17bc2" },
                    { "86d5bbfb-e3fb-433b-99bf-68cbb479ad3f", "3f738604-9ab0-470e-ba4a-41b0832e2794", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3496), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2010, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Tran Thi B", "Female", null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "0f10cd22-135a-4b9b-8424-ac0c06e17bc2" }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaign",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "EXP", "EndDate", "LastUpdatedBy", "LastUpdatedTime", "MFG", "Name", "StartDate", "Status", "UserId", "VaccineName", "VaccineType" },
                values: new object[] { "ac9285a6-24e0-42b5-8f24-472d71e3a25f", "6c21ab80-b663-4705-9bdc-29cba885ac5a", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3876), new TimeSpan(0, 0, 0, 0, 0)), null, null, new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 12, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "KT88", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "6c21ab80-b663-4705-9bdc-29cba885ac5a", "Nha Cai Hang Dau So 1 Chau Au", "Flu" });

            migrationBuilder.InsertData(
                table: "HealthActivityClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "HealthActivityId", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId" },
                values: new object[] { "6220c643-7b77-4f71-b7e5-7e5e579cbbd8", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3814), new TimeSpan(0, 0, 0, 0, 0)), null, null, "b857d305-8a7c-4f22-b509-e8f2d283084e", null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "913409a4-230c-45dd-8d1b-6dcaecda2523" });

            migrationBuilder.InsertData(
                table: "HealthProfile",
                columns: new[] { "Id", "AbnormalNote", "BMI", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "Dental", "Hearing", "Height", "LastUpdatedBy", "LastUpdatedTime", "ParentNote", "StudentId", "VaccinationHistory", "Vision", "Weight" },
                values: new object[,]
                {
                    { "63a313e4-9306-45d8-9650-49c67b5a8cb9", "Monitor dental health", 19.800000000000001, "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3679), new TimeSpan(0, 0, 0, 0, 0)), null, null, "Minor cavities", "Normal", 0.0, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "86d5bbfb-e3fb-433b-99bf-68cbb479ad3f", "Fully using Rocket24/7", "20/25", 0.0 },
                    { "83991635-875a-49c0-98e8-3d29f37fe849", "None", 20.5, "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(3671), new TimeSpan(0, 0, 0, 0, 0)), null, null, "No cavities", "Normal", 0.0, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), null, "205fa6a1-bc72-41dd-950d-2c7a94f9fd13", "Fully using Rocket1h", "20/20", 0.0 }
                });

            migrationBuilder.InsertData(
                table: "VaccinationCampaignClasses",
                columns: new[] { "Id", "CreatedBy", "CreatedTime", "DeletedBy", "DeletedTime", "LastUpdatedBy", "LastUpdatedTime", "SchoolClassId", "VaccinationCampaignId" },
                values: new object[] { "bce033a4-be53-462b-9e0d-a5e417738b0c", "System", new DateTimeOffset(new DateTime(2025, 7, 14, 4, 10, 38, 386, DateTimeKind.Unspecified).AddTicks(4056), new TimeSpan(0, 0, 0, 0, 0)), null, null, null, new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)), "3f738604-9ab0-470e-ba4a-41b0832e2794", "ac9285a6-24e0-42b5-8f24-472d71e3a25f" });

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
