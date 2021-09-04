using BudgetFrogServer.Models.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BudgetFrogServer.Models.Auth
{
    public class EmailConfirmationKey : ModelBase
    {
        [Required]
        public string Key { get; set; }

        [Required]
        public string Email { get; set; }
    }
}
