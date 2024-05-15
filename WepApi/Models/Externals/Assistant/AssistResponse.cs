namespace WepApi.Models.Externals.Assistant;

public class AssistResponse
{
    public string model { get; set; }
    public DateTime created_at { get; set; }
    public string response { get; set; }
    public bool done { get; set; }
    public string done_reason { get; set; }
    public int[] context { get; set; }
    public long total_duration { get; set; }
    public int load_duration { get; set; }
    public int prompt_eval_duration { get; set; }
    public int eval_count { get; set; }
    public long eval_duration { get; set; }

    public MessageResponse message { get; set; }

    public class MessageResponse
    {
        public string role { get; set; }
        public string content { get; set; }
    }

}
