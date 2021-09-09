using BudgetFrogTelegramBot.Models.BudgetFrogTGdb;

namespace BudgetFrogTelegramBot.Utils.DB.BudgetFrogTG
{
    class UserController
    {
        private readonly BFTGcontext _BFTGcontext;

        public UserController(BFTGcontext _BFTGcontext)
        {
            this._BFTGcontext = _BFTGcontext;
        }
    }
}
