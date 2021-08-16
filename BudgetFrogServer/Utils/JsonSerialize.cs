using System;
using System.Collections.Generic;

namespace BudgetFrogServer.Utils
{
    public class JsonSerialize
    {
        private static string Time => DateTime.Now.ToString("G");

        private static bool Success(object data)
        {
            if (data is not null)
                return true;

            return false;
        }

        public static object MessageText(string message) => new
        {
            message,
            success = Success(message),
            Time,
        };

        public static object ErrorMessageText(string message) => new
        {
            errors = new
            {
                message,
            },
            success = false,
            Time,
        };

        public static object Error(object data) => new
        {
            errors = new
            {
                data,
            },
            success = false,
            Time,
        };

        public static object Data(object data, bool _success = true) => new
        {
            data,
            success = Success(data) && _success,
            Time,
        };

        public static object Data(object data, string message, bool _success = true) => new
        {
            data,
            message,
            success = Success(data) && _success,
            Time,
        };
    }
}
