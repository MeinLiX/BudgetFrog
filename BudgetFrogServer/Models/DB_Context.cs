using Microsoft.EntityFrameworkCore;

using BudgetFrogServer.Models.Auth;
using BudgetFrogServer.Models.Basis;

namespace BudgetFrogServer.Models
{
    public class DB_Context : DbContext
    {
        public virtual DbSet<IdentityUser> IdentityUser { get; set; }
        public virtual DbSet<TransactionCategory> TransactionCategory { get; set; }
            
        public DB_Context(DbContextOptions options) : base(options)
        {
            Database.EnsureDeleted();
            Database.EnsureCreated();
        }
    }
}
