using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SMMS.Application.Helpers.Implements;
using SMMS.Application.Helpers.Interface;
using SMMS.Application.Services.Implements;
using SMMS.Application.Services.Interfaces;
using SMMS.Domain.Interface.Repositories;
using SMMS.Infrastructure.Context;
using SMMS.Infrastructure.Hubs;
using SMMS.Infrastructure.Implements;
using StackExchange.Redis;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var serviceAccountPath = Path.Combine(Directory.GetCurrentDirectory(), "Config", "smms-otp-firebase-adminsdk-fbsvc-0fe060d117.json");

try
{
	if (!File.Exists(serviceAccountPath))
	{
		throw new FileNotFoundException("Cannot Found File JSON service account at: " + serviceAccountPath);
	}

	FirebaseApp.Create(new AppOptions()
	{
		Credential = GoogleCredential.FromFile(serviceAccountPath)
	});
}
catch (Exception ex)
{
	Console.WriteLine($"Error To Execute Firebase: {ex.Message}");
	throw;
}

builder.Services.AddControllers()
	   .AddJsonOptions(options =>
		   options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy
			.WithOrigins("http://localhost:5173")
			.AllowAnyMethod()
			.AllowAnyHeader()
			.AllowCredentials();
	});
});

builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
	options.MultipartBodyLengthLimit = 104857600; // 100 MB //Ok
});

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = builder.Configuration.GetConnectionString("Redis");
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
	c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
	{
		Description = "Chỉ nhập JWT token, không cần 'Bearer' prefix",
		Name = "Authorization",
		In = ParameterLocation.Header,
		Type = SecuritySchemeType.Http,
		Scheme = "bearer",
		BearerFormat = "JWT"
	});
	c.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference
				{
					Type = ReferenceType.SecurityScheme,
					Id = "Bearer"
				}
			},
			new string[] { }
		}
	});
});

// Database Context
builder.Services.AddDbContext<DatabaseContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionStringDB")));

// Repositories
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

// Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INurseService, NurseService>();
builder.Services.AddScoped<IHealthActivityService, HealthActivityService>();
builder.Services.AddScoped<IVaccinationCampaignService, VaccinationCampaignService>();
builder.Services.AddScoped<IActivityConsentService, ActivityConsentService>();
builder.Services.AddScoped<IVaccinationRecordService, VaccinationRecordService>();
builder.Services.AddScoped<IHealthCheckupService, HealthCheckupService>();
builder.Services.AddScoped<IConselingService, ConselingService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ISchoolClassService, SchoolClassService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ImportService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<IMedicalService, MedicalService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IRedisCacheService, RedisCacheService>();
builder.Services.AddScoped<SendMailService>();



// Infrastructure Services
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<ISmsService, SmsService>();
builder.Services.AddLogging(logging =>
{
	logging.AddConsole();
	logging.AddDebug();
});
// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
			ValidAudience = builder.Configuration["JwtSettings:Audience"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"]))
		};
		options.Events = new JwtBearerEvents
		{
			OnMessageReceived = context =>
			{
				var accessToken = context.Request.Query["access_token"];
				var path = context.HttpContext.Request.Path;
				if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
				{
					context.Token = accessToken;
				}
				return Task.CompletedTask;
			}
		};
	});

var app = builder.Build();
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();