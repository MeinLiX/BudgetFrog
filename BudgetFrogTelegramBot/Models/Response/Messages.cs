
namespace BudgetFrogTelegramBot.Models.Response
{
    class Messages
    {
        public class Correct
        {
            public string message { get; set; }
            public bool success { get; set; }
            public string time { get; set; }
        }

        public class Incorrect
        {
            public Errors errors { get; set; }
            public bool success { get; set; }
            public string time { get; set; }
        }

        public class Errors
        {
            public string message { get; set; }
        }
    }
}
