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

        public ICollection<Currency> Currencies { get; set; }
        public ICollection<CurencyRelationship> FirstCurencyRelationship { get; set; }
        public ICollection<CurencyRelationship> SecondCurencyRelationship { get; set; }
    }
}
