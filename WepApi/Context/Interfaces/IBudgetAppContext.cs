using Microsoft.EntityFrameworkCore;
using WepApi.Models.Auth;
using WepApi.Models.Budgets;

namespace WepApi.Context.Interfaces;

public interface IBudgetAppContext
{
    DbSet<AppIdentityUser> AppIdentityUsers { get; set; }
    DbSet<Balance> Balances { get; set; }
    DbSet<Budget> Budgets { get; set; }
    DbSet<TransactionDescription> TransactionsDescription { get; set; }
    DbSet<TransactionDescriptionCategory> TransactionDescriptionCategories { get; set; }

    Task<int> SaveChangesAsync();
}
