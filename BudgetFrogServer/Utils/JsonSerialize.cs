namespace BudgetFrogServer.Utils
{
    public class JsonSerialize
    {
        public static object MessageText(string text) => new
        {
            message = new
            {
                text,
            }
        };
        public static object ErrorMessageText(string text) => new
        {
            error = new
            {
                message = new
                {
                    text,
                }
            }
        };
    }
}
