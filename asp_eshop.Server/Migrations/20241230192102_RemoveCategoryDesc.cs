﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace asp_eshop.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCategoryDesc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Categories");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Categories",
                type: "TEXT",
                nullable: true);
        }
    }
}
