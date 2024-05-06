namespace WepApi.Models.Externals.Assistant;

public class AssistRequest
{
    public string model { get; set; }
    public string prompt { get; set; }
    public bool stream { get; set; }
}
