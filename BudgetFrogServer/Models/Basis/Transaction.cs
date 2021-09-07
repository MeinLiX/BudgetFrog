using System;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BudgetFrogServer.Models.Common;
using System.IO;

namespace BudgetFrogServer.Models.Basis
{
    public class Transaction : UserModelBase
    {

        [Required]
        [DataType(DataType.DateTime)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:G}")]//TODO FORMAT
        public DateTime Date { get; set; } = DateTime.Now;

        [Required,Range(0, 999_999_999_999_999_999.99, ErrorMessage = "The balance field must be between 0 and 999_999_999_999_999_999.99!")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Balance { get; set; } = .00m;

        [Required]
        [RegularExpression("(USD)|(EUR)|(UAH)|(RUB)", ErrorMessage = "Invalid currency!")]
        public string Currency { get; set; }

        [MaxLength(256, ErrorMessage = "The maximum length of the Notes is 256")]
        public string Notes { get; set; }

        [MaxLength]
        [JsonIgnore]
        public byte[] RecepitBinary { get; set; }

        [Required]
        public int? TransactionCategoryID { get; set; }

        //[JsonIgnore]
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
