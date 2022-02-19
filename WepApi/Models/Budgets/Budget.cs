using WepApi.Models.Auth;
using WepApi.Models.Common;

namespace WepApi.Models.Budgets;

public class Budget : ModelBase
{
    public string Name { get; set; }

    public string InviteToken { get; set; }

    public Balance Balance { get; set; }

    public List<AppIdentityUser> Users { get; set; } = new();
}
