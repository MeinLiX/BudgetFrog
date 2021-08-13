using BudgetFrogServer.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BudgetFrogServer.Models.Common
{
    public abstract class UserModelBase : ModelBase
    {
        [Required]
        [JsonIgnore]
        public AppIdentityUser IdentityUser { get; set; }
    }
}
