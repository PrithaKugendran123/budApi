using budt.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Register controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });


// Register DbContext with SQL Server configuration
builder.Services.AddDbContext<budgetTrackerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BudStr"))
);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin() // Allow any domain
               .AllowAnyMethod() // Allow all HTTP methods (GET, POST, etc.)
               .AllowAnyHeader() // Allow all headers
    );
});

// Enable Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.

// Enable Swagger in all environments (can limit to specific environments if needed)
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Staging"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors("AllowAll");

// Enforce HTTPS for all requests
app.UseHttpsRedirection();

// Authorization middleware (no authentication configured here)
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Start the application
app.Run();
