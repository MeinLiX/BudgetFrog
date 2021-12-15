using WepApi.Models.Budgets;
using WepApi.Models.Common;

namespace WepApi.Models.Auth;

public class AppIdentityUser : ModelBase
{
    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Password { get; set; }

    public string PhotoUrl { get; set; }

    public List<Budget> Budgets { get; set; } = new();
}
