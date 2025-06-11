using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SMMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ScheduleStatus : Migration
    {
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<int>(
				name: "Status",
				table: "ConselingSchedule",
				type: "int",
				nullable: false,
				oldClrType: typeof(bool),
				oldType: "bit");
		}

		/// <inheritdoc />
		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<bool>(
				name: "Status",
				table: "ConselingSchedule",
				type: "bit",
				nullable: false,
				oldClrType: typeof(int),
				oldType: "int");
		}


	}
}
