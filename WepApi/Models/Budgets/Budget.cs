using WepApi.Models.Auth;
using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public class Budget : ModelBase
{
    public Balance Balance { get; set; }

    public List<AppIdentityUser> Users { get; set; }
}
