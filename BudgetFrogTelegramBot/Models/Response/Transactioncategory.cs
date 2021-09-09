namespace BudgetFrogTelegramBot.Models.Response
{
    class R_Transactioncategory
    {
        public class Response
        {
            public Data data { get; set; }
            public bool success { get; set; }
            public string time { get; set; }
        }

        public class Data
        {
            public Transactioncategory[] transactionCategories { get; set; }
        }

        public class Transactioncategory
        {
            public string name { get; set; }
            public bool income { get; set; }
            public string color { get; set; }
            public int id { get; set; }
        }
    }
}
