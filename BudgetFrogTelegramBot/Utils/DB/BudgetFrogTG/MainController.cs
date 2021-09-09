using BudgetFrogTelegramBot.Models.BudgetFrogTGdb;

namespace BudgetFrogTelegramBot.Utils.DB.BudgetFrogTG
{
    class MainController
    {
        private readonly static BFTGcontext _BFTGcontext = new();
        internal static UserController userController { get; } = new(_BFTGcontext);
    }
}
