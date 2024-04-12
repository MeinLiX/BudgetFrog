using WepApi.Models.Auth;
using WepApi.Models.Budgets;
using WepApi.Models.Bank;
using WepApi.Models.Transactions;

namespace WepApi.Context.Interfaces;

public interface IBudgetAppContext
{
    DbSet<AppIdentityUser> AppIdentityUsers { get; set; }
    DbSet<Balance> Balances { get; set; }
    DbSet<Budget> Budgets { get; set; }
    DbSet<PlannedBudget> PlannedBudgets { get; set; }
    DbSet<TransactionDescription> TransactionsDescription { get; set; }
    DbSet<TransactionDescriptionCategory> TransactionDescriptionCategories { get; set; }
    DbSet<BankCredential> BankCredentials { get; set; }

    Task<int> SaveChangesAsync();
}
