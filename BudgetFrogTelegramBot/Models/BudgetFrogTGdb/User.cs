﻿using BudgetFrogTelegramBot.Utils;
using System;
using System.ComponentModel.DataAnnotations;

namespace BudgetFrogTelegramBot.Models.BudgetFrogTGdb
{
    class User
    {
        [Key]
        [Required]
        public int ID { get; set; }

        [Required]
        public Guid ExternalToken { get; set; } = new Guid(); //like "0000.0000.0000.0000"

        [Required]
        public int State { get; set; } = (int)UserState.Default;

        public User() { }

        public User(int iD)
            : this(iD, (int)UserState.Default)
        { }

        public User(int iD, int state) 
            : this(iD, new Guid(), state) 
        { }

        public User(int iD, Guid externalToken, int state)
        {
            ID = iD;
            ExternalToken = externalToken;
            State = state;
        }
    }
}