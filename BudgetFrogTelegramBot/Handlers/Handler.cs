using BudgetFrogTelegramBot.Models.BudgetFrogTGdb;
using BudgetFrogTelegramBot.Models.Response;
using BudgetFrogTelegramBot.Utils.DB.BudgetFrogTG;
using BudgetFrogTelegramBot.Utils.RequestClient;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;

namespace BudgetFrogTelegramBot.Handlers
{
    public class Handler
    {
        public static Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
        {
            var ErrorMessage = exception switch
            {
                ApiRequestException apiRequestException => $"Telegram API Error:\n[{apiRequestException.ErrorCode}]\n{apiRequestException.Message}",
                _ => exception.ToString()
            };

            Console.WriteLine(ErrorMessage);
            return Task.CompletedTask;
        }

        public static async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
        {
            var handler = update.Type switch
            {
                // UpdateType.Unknown:
                // UpdateType.ChannelPost:
                // UpdateType.EditedChannelPost:
                // UpdateType.ShippingQuery:
                // UpdateType.PreCheckoutQuery:
                // UpdateType.Poll:
                UpdateType.Message => BotOnMessageReceived(botClient, update.Message),
                UpdateType.EditedMessage => BotOnMessageReceived(botClient, update.EditedMessage),
                // UpdateType.CallbackQuery:
                // UpdateType.InlineQuery:
                // UpdateType.ChosenInlineResult:
                _ => UnknownUpdateHandlerAsync(botClient, update)
            };

            try
            {
                await handler;
            }
            catch (Exception exception)
            {
                await HandleErrorAsync(botClient, exception, cancellationToken);
            }
        }

        private static async Task BotOnMessageReceived(ITelegramBotClient botClient, Message message)
        {
            Console.WriteLine($"Receive message type: {message.Type}");
            if (message.Type != MessageType.Text)
                return;

            Models.BudgetFrogTGdb.User user = await MainController.userController.GetUserOrDefaultAsync(message.From.Id);

            try
            {
                await (message.Text.Split(' ').First() switch
                {
                    "/transactions" => ShowTransactions(botClient, message, user),
                    "/categories" => ShowCategories(botClient, message, user),
                    "/token" => SetToken(botClient, message, user),
                    _ => Usage(botClient, message)
                });
            }
            catch (Exception e) { Console.WriteLine(e.Message); }

            static async Task<Message> ShowTransactions(ITelegramBotClient botClient, Message message, Models.BudgetFrogTGdb.User user)
            {
                await UserCheck(botClient, message, user);
                R_Transaction.Data transactionsData = await Client.GetTransactions(user.ExternalToken);
                StringBuilder transactionsListMessage = new();
                foreach (R_Transaction.Transaction t in transactionsData.transactions)
                    transactionsListMessage.Append($"{t.transactionCategory.name}\t|{(t.transactionCategory.income ? "+" : "-")}{t.balance}({t.currency})|\t{t.date}\n");

                return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                            text: "Transactions:\n" + transactionsListMessage.ToString());
            }

            static async Task<Message> ShowCategories(ITelegramBotClient botClient, Message message, Models.BudgetFrogTGdb.User user)
            {
                await UserCheck(botClient, message, user);
                R_Transactioncategory.Data transactionsData = await Client.GetTransactionCategories(user.ExternalToken);
                StringBuilder transactionscategoryListMessage = new();
                foreach (R_Transactioncategory.Transactioncategory t in transactionsData.transactionCategories)
                    transactionscategoryListMessage.Append($"{t.name} ({t.income})|hex: {t.color}\n");

                return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                        text: "Categories...\n" + transactionscategoryListMessage.ToString());
            }

            static async Task<Message> SetToken(ITelegramBotClient botClient, Message message, Models.BudgetFrogTGdb.User user)
            {
                string[] msg = message.Text.Split(' ');
                if (msg.Length == 1)
                    return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                            text: $"Use like:\n/token {new Guid()}");
                try
                {
                    Guid token = new(msg[1]);
                    user.ExternalToken = token;
                    bool TokenIsValid = await Client.ValidationToken(user.ExternalToken);
                    if (TokenIsValid)
                    {
                        await MainController.userController.UpdateUserAsync(user);
                        return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                         text: $"Token updated.");
                    }
                    else
                    {
                        return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                         text: $"Incorrect Token.\nTry again.");
                    }
                }
                catch
                {
                    return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                           text: $"Incorrect Token\nToken require like {new Guid()}");
                }
            }

            static async Task UserCheck(ITelegramBotClient botClient, Message message, Models.BudgetFrogTGdb.User user)
            {
                if (user == null)
                {
                    await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                                                 text: "Hi! You need set your token.\nUse /token");
                    await MainController.userController.AddUserAsync(new Models.BudgetFrogTGdb.User(message.From.Id));
                    throw new Exception($"[{message.From.Username}] New user.");
                }
                try
                {
                    bool TokenIsValid = await Client.ValidationToken(user.ExternalToken);
                    if (!TokenIsValid)
                    {
                        await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                            text: "Token expired.\rRefresh your token.\nUse /token");
                        throw new Exception($"[{message.From.Username}] Token expired.");
                    }
                }
                catch { throw; }
            }

            static async Task<Message> Usage(ITelegramBotClient botClient, Message message)
            {
                string ANSmessage = "Hi there! Use any command.";

                return await botClient.SendTextMessageAsync(chatId: message.Chat.Id,
                                                            text: ANSmessage);
            }
        }

        private static Task UnknownUpdateHandlerAsync(ITelegramBotClient botClient, Update update)
        {
            Console.WriteLine($"Unknown update type: {update.Type}");
            return Task.CompletedTask;
        }
    }
}
