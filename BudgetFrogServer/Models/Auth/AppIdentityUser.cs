using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using BudgetFrogServer.Models.Common;

namespace BudgetFrogServer.Models.Auth
{
    public class AppIdentityUser : ModelBase
    {
        [Required, Range(0, 999_999_999_999_999_999.99, ErrorMessage = "The balance field must be between 0 and 999_999_999_999_999_999.99!")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Balance { get; set; } = .00m;

        [Required]
        [RegularExpression("USD|EUR|UAH|RUB", ErrorMessage = "Invalid currency!")]
        public string Currency { get; set; } = "USD";

        [Required]
        [MaxLength(32, ErrorMessage = "The maximum length of the email field is 32")]
        [EmailAddress(ErrorMessage = "Invalid email!")]
        public string Email { get; set; }

        [MaxLength(32, ErrorMessage = "The maximum length of the firstname field is 32")]
        [RegularExpression("[a-zA-Zа-яА-Я1-9_]+", ErrorMessage = "Invalid firstname!")]
        public string FirstName { get; set; }

        [MaxLength(32, ErrorMessage = "The maximum length of the lastname field is 32")]
        [RegularExpression("[a-zA-Zа-яА-Я1-9_]+", ErrorMessage = "Invalid lastname!")]
        public string LastName { get; set; }

        [Required]
        [MaxLength(128, ErrorMessage = "The maximum length of the password field is 128")]
        [MinLength(1, ErrorMessage = "The minimum length of the password field is 1")]
        public string Password { get; set; } //like a simple passwords

        public bool IsConfirmed { get; set; } = false;

        [JsonIgnore]
        public Guid ExternalToken { get; set; } = Guid.NewGuid();
    }
}
