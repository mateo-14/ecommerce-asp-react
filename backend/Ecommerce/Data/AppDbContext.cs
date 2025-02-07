using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<FilterGroup> FilterGroups { get; set; }
        public DbSet<FilterOption> FilterOptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relations
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.SubCategories)
                .WithOne(c => c.Parent)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FilterGroup>()
                .HasMany(fg => fg.Options)
                .WithOne(fo => fo.FilterGroup)
                .HasForeignKey(fo => fo.FilterGroupId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<FilterOption>()
                .HasMany(fo => fo.Products)
                .WithMany(p => p.Filters);

            // Default values
            modelBuilder.Entity<Product>()
                .Property(p => p.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Product>()
                .Property(p => p.UpdatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Category>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<Category>()
                .Property(c => c.UpdatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<FilterGroup>()
                .Property(fg => fg.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<FilterGroup>()
                .Property(fg => fg.UpdatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<FilterOption>()
                .Property(fo => fo.CreatedAt)
                .HasDefaultValueSql("now()");

            modelBuilder.Entity<FilterOption>()
                .Property(fo => fo.UpdatedAt)
                .HasDefaultValueSql("now()");
        }
    }
}
