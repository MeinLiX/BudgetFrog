using System.ComponentModel.DataAnnotations;

namespace BudgetFrogServer.Models.Common
{
    public abstract class ModelBase
    {
        [Key]
        [Required]
        public int ID { get; set; }
    }
}
