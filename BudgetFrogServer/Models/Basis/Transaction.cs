using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BudgetFrogServer.Models.Common;

namespace BudgetFrogServer.Models.Basis
{
    public class Transaction : UserModelBase
    {

        [Required]
        [DataType(DataType.DateTime)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:G}")]//TODO FORMAT
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = .00m;

        //TODO: to take out in the external module (MAYBE)
        [Required]
        [MaxLength(3, ErrorMessage = "The maximum length of the Currency is 3")]
        [MinLength(3, ErrorMessage = "The minimum length of the Currency is 3")]
        [RegularExpression("(USD)|(EUR)|(UAH)|(RUB)", ErrorMessage = "Invalid currency!")]
        public string Currency { get; set; }

        [MaxLength(256, ErrorMessage = "The maximum length of the Notes is 256")]
        public string Notes { get; set; }

        [MaxLength]
        public string ReceiptBase64 { get; set; }

        [Required]
        public int TransactionCategoryID { get; set; }

        [JsonIgnore]
        public TransactionCategory TransactionCategory { get; set; }

        //TODO: move to external attribute
        public bool IsValidDate()
        {
            if (Date > DateTime.Now)
                return false;

            if (Date.AddYears(5) < DateTime.Now)
                return false;

            return true;
        }
    }
}
