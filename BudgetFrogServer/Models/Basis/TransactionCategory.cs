using System.ComponentModel.DataAnnotations;
using BudgetFrogServer.Models.Common;

namespace BudgetFrogServer.Models.Basis
{
    public class TransactionCategory : UserModelBase
    {
        [Required]
        [MaxLength(32, ErrorMessage = "The maximum length of the transaction category name is 32")]
        [MinLength(1, ErrorMessage = "The minimum length of the transaction category name is 1")]
        //[RegularExpression("[a-zA-Zа-яА-Я1-9_- ]+", ErrorMessage = "Invalid transaction category name!")] 
        public string Name { get; set; }

        [Required]
        public bool? Income { get; set; } = false;

        [Required]
        [RegularExpression("^#(?:[0-9a-fA-F]{3}){1,2}$", ErrorMessage = "Invalid transaction category color string!")]
        public string Color { get; set; } = "#000000";
    }
}
