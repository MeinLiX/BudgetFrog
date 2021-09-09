namespace BudgetFrogTelegramBot.Models.Response
{
    class R_Transaction
    {
        public class Response
        {
            public Data data { get; set; }
            public bool success { get; set; }
            public string time { get; set; }
        }

        public class Data
        {
            public Transaction[] transactions { get; set; }
        }

        public class Transaction
        {
            public string date { get; set; }
            public float balance { get; set; }
            public string currency { get; set; }
            public string notes { get; set; }
            public bool recepitAvailable { get; set; }
            public int transactionCategoryID { get; set; }
            public object transactionCategory { get; set; }
            public int id { get; set; }
        }
    }
}
