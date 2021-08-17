using BudgetFrogServer.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BudgetFrogServer.Models.Common
{
    public abstract class UserModelBase : ModelBase
    {
        [JsonIgnore]
        public AppIdentityUser AppIdentityUser { get; set; }
    }
}
