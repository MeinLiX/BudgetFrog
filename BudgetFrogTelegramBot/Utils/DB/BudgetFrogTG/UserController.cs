using BudgetFrogTelegramBot.Models.BudgetFrogTGdb;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BudgetFrogTelegramBot.Utils.DB.BudgetFrogTG
{
    class UserController
    {
        private readonly BFTGcontext _BFTGcontext;

        public UserController(BFTGcontext _BFTGcontext)
        {
            this._BFTGcontext = _BFTGcontext;
        }

        internal async Task<User> GetUser(int ID) => await _BFTGcontext.User.FirstOrDefaultAsync(u => u.ID == ID);

        internal async Task AddUser(User user)
        {
            try
            {
                _BFTGcontext.User.Add(user);
                await _BFTGcontext.SaveChangesAsync();
            }
            catch { throw; }
        }

        internal async Task UpdateUser(User user)
        {
            try
            {
                _BFTGcontext.User.Update(user);
                await _BFTGcontext.SaveChangesAsync();
            }
            catch { throw; }
        }
    }
}
