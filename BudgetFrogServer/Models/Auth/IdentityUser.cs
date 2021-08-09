using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using BudgetFrogServer.Models.Basis;

namespace BudgetFrogServer.Models.Auth
{
    public class IdentityUser
    {
        [Key]
        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(32, ErrorMessage = "The maximum length of the email field is 32")]
        [RegularExpression("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", ErrorMessage = "Invalid email!")]
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



        public List<TransactionCategory> TransactionCategories { get; set; } = new List<TransactionCategory>();
    }
}
