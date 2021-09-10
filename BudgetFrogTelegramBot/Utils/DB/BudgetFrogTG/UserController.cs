using BudgetFrogTelegramBot.Models.BudgetFrogTGdb;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

        internal async Task<User> GetUserOrDefaultAsync(long ID) => await _BFTGcontext.User.FirstOrDefaultAsync(u => u.ID == ID);

        internal async Task<List<User>> GetUsersAsync(Guid externalToken) => await _BFTGcontext.User.Where(u => u.ExternalToken == externalToken).ToListAsync();

        internal async Task AddUserAsync(User user)
        {
            try
            {
                _BFTGcontext.User.Add(user);
                await _BFTGcontext.SaveChangesAsync();
            }
            catch { throw; }
        }

        internal async Task UpdateUserAsync(User user)
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
