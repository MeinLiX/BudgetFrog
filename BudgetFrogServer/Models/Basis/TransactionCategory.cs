using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BudgetFrogServer.Models.Auth;
using System.Text.Json.Serialization;

namespace BudgetFrogServer.Models.Basis
{
    public class TransactionCategory
    {
        [Key]
        [Required]
        public int TransactionCategoryId { get; set; }

        [Required]
        [MaxLength(32, ErrorMessage = "The maximum length of the transaction category name is 32")]
        [MinLength(1, ErrorMessage = "The minimum length of the transaction category name is 1")]
        //[RegularExpression("[a-zA-Zа-яА-Я1-9_- ]+", ErrorMessage = "Invalid transaction category name!")] 
        public string TransactionCategoryName { get; set; }

        [Required]
        public bool TransactionCategoryIncome { get; set; } = false;

        [Required]
        [JsonIgnore]
        public AppIdentityUser IdentityUser { get; set; }
    }
}
