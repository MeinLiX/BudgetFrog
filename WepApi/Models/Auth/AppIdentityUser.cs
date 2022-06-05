using System.Text.Json.Serialization;
using WepApi.Models.Budgets;
using WepApi.Models.Common;

namespace WepApi.Models.Auth;

public class AppIdentityUser : ModelBase
{
    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    [JsonIgnore]
    public string Password { get; set; }

    public string PhotoUrl { get; set; }

    [JsonIgnore]
    public List<Budget> Budgets { get; set; } = new();
}
