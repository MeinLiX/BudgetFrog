using Microsoft.EntityFrameworkCore;

using BudgetFrogServer.Models.Auth;
using BudgetFrogServer.Models.Basis;

namespace BudgetFrogServer.Models
{
    public class DB_Context : DbContext
    {
        public virtual DbSet<AppIdentityUser> AppIdentityUser { get; set; }
        public virtual DbSet<TransactionCategory> TransactionCategory { get; set; }
        public virtual DbSet<Transaction> Transaction { get; set; }

        public DB_Context(DbContextOptions<DB_Context> options) : base(options)
        {
            Database.EnsureDeleted();
            Database.EnsureCreated();
        }
    }
}
