namespace WepApi.Models.Externals.Assistant;

public class AssistRequest
{
    public string model { get; set; }
    public string prompt { get; set; }
    public List<MessageChat> messages { get;set;}
    public bool stream { get; set; }

    public class MessageChat
    {
        public string content { get; set; }
        public string role { get; set; }
    }
}
