using BudgetFrogServer.Models.Common;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BudgetFrogServer.Models.ER_Basis
{
    public class Currency : ModelBase
    {
        [Required]
        [MaxLength(3, ErrorMessage = "The maximum length of the Currency is 3")]
        [MinLength(3, ErrorMessage = "The minimum length of the Currency is 3")]
        [RegularExpression("(USD)|(EUR)|(UAH)|(RUB)", ErrorMessage = "Invalid currency!")]
        public string Name { get; set; } = "USD";

        public List<Currency> Currencies { get; set; } = new();
        public List<CurencyRelationship> FirstCurencyRelationship { get; set; } = new();
        public List<CurencyRelationship> SecondCurencyRelationship { get; set; } = new();
    }
}
