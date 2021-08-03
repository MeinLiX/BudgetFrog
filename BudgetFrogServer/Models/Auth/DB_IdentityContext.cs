using Microsoft.EntityFrameworkCore;

namespace BudgetFrogServer.Models.Auth
{
    public class DB_IdentityContext : DbContext
    {
        public virtual DbSet<IdentityUser> IdentityUser { get; set; }

        public DB_IdentityContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
