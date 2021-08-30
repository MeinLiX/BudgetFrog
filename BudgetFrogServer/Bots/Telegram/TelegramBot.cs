using BudgetFrogServer.Bots.Telegram.Handlers;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Extensions.Polling;

namespace BudgetFrogServer.Bots.Telegram
{
    public class TelegramBot
    {
        private static TelegramBotClient? Bot;
        private static StreamWriter LoggerSW;
        static TelegramBot()
        {
            ProcessStartInfo psi = new("cmd.exe") //todo
            {
                UseShellExecute = false
            };

            LoggerSW = Process.Start(psi).StandardInput;
        }
        public static async Task Start()
        {
            Bot = new TelegramBotClient(Configuration.Telegram.BotToken);

            var me = await Bot.GetMeAsync();

            using var cts = new CancellationTokenSource();

            Bot.StartReceiving(new DefaultUpdateHandler(Handler.HandleUpdateAsync, Handler.HandleErrorAsync),
                               cts.Token);

            LoggerSW.WriteLine($"Start listening for @{me.Username}");

            await Task.Delay(-1);
            cts.Cancel();
        }
    }
}
