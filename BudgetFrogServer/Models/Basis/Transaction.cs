using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BudgetFrogServer.Models.Common;

namespace BudgetFrogServer.Models.Basis
{
    public class Transaction : UserModelBase
    {
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = .00m;

        //TODO: to take out in the external module (MAYBE)
        [Required]
        [MaxLength(3, ErrorMessage = "The maximum length of the Currency is 3")]
        [MinLength(3, ErrorMessage = "The minimum length of the Currency is 3")]
        [RegularExpression("(USD)|(EUR)|(UAH)|(RUB)", ErrorMessage = "Invalid currency!")]
        public string Currency { get; set; }

        [Required]
        [JsonIgnore]
        public TransactionCategory TransactionCategory { get; set; }
    }
}
