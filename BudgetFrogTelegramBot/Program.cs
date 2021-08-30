using System.Threading;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Extensions.Polling;
using BudgetFrogTelegramBot.Handlers;

namespace BudgetFrogTelegramBot
{
    public class Program
    {
        private static TelegramBotClient Bot;

        public static async Task Main()
        {
            Bot = new TelegramBotClient(Configuration.BotToken);

            var me = await Bot.GetMeAsync();
            using var cts = new CancellationTokenSource();

            Bot.StartReceiving(new DefaultUpdateHandler(Handler.HandleUpdateAsync, Handler.HandleErrorAsync),
                               cts.Token);

            System.Console.WriteLine($"Start listening for @{me.Username}");
            System.Console.ReadKey();
            cts.Cancel();
        }
    }
}
