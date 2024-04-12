using WepApi.Context.Interfaces;
using WepApi.Models.Auth;
using WepApi.Models.Budgets;
using WepApi.Models.Bank;
using WepApi.Models.Transactions;

namespace WepApi.Context;

public class BudgetAppContext : DbContext, IBudgetAppContext
{
    public BudgetAppContext(DbContextOptions<BudgetAppContext> options)
        : base(options)
    {
        //Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    public DbSet<AppIdentityUser> AppIdentityUsers { get; set; }
    public DbSet<Balance> Balances { get; set; }
    public DbSet<Budget> Budgets { get; set; }
    public DbSet<PlannedBudget> PlannedBudgets { get; set; }
    public DbSet<TransactionDescription> TransactionsDescription { get; set; }
    public DbSet<TransactionDescriptionCategory> TransactionDescriptionCategories { get; set; }
    public DbSet<BankCredential> BankCredentials { get; set; }


    public async Task<int> SaveChangesAsync() => await base.SaveChangesAsync();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.BuildAppIdentityUser();
        modelBuilder.BuildBalance();
        modelBuilder.BuildBudget();
        modelBuilder.BuildPlannedBudget();
        modelBuilder.BuildTransactionDescription();
        modelBuilder.BuildTransactionDescriptionCategory();
        modelBuilder.BuildBankCredential();
    }
}
