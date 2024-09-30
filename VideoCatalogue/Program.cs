using Microsoft.AspNetCore.Http.Features;
using VideoCatalogue.Helpers;
using VideoCatalogue.Models;

var builder = WebApplication.CreateBuilder(args);
var appSettingsSection = builder.Configuration.GetSection(nameof(AppSettings));

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.Configure<AppSettings>(appSettingsSection);
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = UploadHelpers.MaxFileUploadSize);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
