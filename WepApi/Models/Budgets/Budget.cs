using WepApi.Models.Auth;
using WepApi.Models.Common;
using WepApi.Models.Privat24;

namespace WepApi.Models.Budgets;

public class Budget : ModelBase
{
    public string Name { get; set; }

    public string InviteToken { get; set; }

    public Balance Balance { get; set; }

    public List<Privat24Credential> Privat24Credentials { get; set; } = new();

    public List<AppIdentityUser> Users { get; set; } = new();
}
