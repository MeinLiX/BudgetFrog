using BudgetFrogTelegramBot.Utils;
using System;
using System.ComponentModel.DataAnnotations;

namespace BudgetFrogTelegramBot.Models.BudgetFrogTGdb
{
    class User
    {
        [Key]
        [Required]
        public long ID { get; set; }

        [Required]
        public Guid ExternalToken { get; set; } = new Guid(); //like "0000.0000.0000.0000"

        [Required]
        public int State { get; set; } = (int)UserState.Default;

        public User() { }

        public User(long iD)
            : this(iD, (int)UserState.Default)
        { }

        public User(long iD, int state) 
            : this(iD, new Guid(), state) 
        { }

        public User(long iD, Guid externalToken, int state)
        {
            ID = iD;
            ExternalToken = externalToken;
            State = state;
        }
    }
}
