using Ecommerce.Data;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce.Services.ImageValidationService;
using Ecommerce.Services.ImageConverterService;
using Ecommerce.Services.StorageService;
using Ecommerce.Services.ProductService;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Ecommerce.Services.CategoriesService;
using Ecommerce.Services.FiltersService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<MvcOptions>(options =>
{
    options.ModelMetadataDetailsProviders.Add(
        new SystemTextJsonValidationMetadataProvider());
});

// Register Firebase client
var credential = GoogleCredential.FromFile("firebase-credentials.json");
var storage = StorageClient.Create(credential);
builder.Services.AddSingleton(storage);
builder.Services.AddScoped<IImageValidationService, ImageValidationService>();
builder.Services.AddScoped<IImageConverterService, ImageConverterService>();
builder.Services.AddScoped<IStorageService, LocalStorageService>();
builder.Services.AddScoped<IProductsService, ProductsService>();
builder.Services.AddScoped<ICategoriesService, CategoriesService>();
builder.Services.AddScoped<IFiltersService, FiltersService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthorization();

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapControllers();

app.Run();
