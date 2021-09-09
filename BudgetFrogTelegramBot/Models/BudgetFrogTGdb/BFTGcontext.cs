using System;
using Microsoft.EntityFrameworkCore;

namespace BudgetFrogTelegramBot.Models.BudgetFrogTGdb
{
    class BFTGcontext : DbContext
    {
        public DbSet<User>  User { get; set; }

        public BFTGcontext()
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(@$"Filename={Environment.CurrentDirectory + @"\BFTG.db"}");
        }
    }
}
