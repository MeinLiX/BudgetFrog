using System;
using System.Collections.Generic;

namespace BudgetFrogServer.Utils
{
    public class JsonSerialize
    {
        public static object MessageText(string message) => new
        {
            message,
            success = true,
            time = DateTime.Now.ToString("G"),
        };

        public static object ErrorMessageText(string message) => new
        {
            error = new
            {
                message,
            },
            success = false,
            time = DateTime.Now.ToString("G"),
        };

        public static object Data<T>(List<T> data) => new
        {
            data,
            success = data is not null,
            time = DateTime.Now.ToString("G"),
        };

        public static object Data(object data) => new
        {
            data,
            success = data is not null,
            time = DateTime.Now.ToString("G"),
        };

        public static object Data<T>(List<T> data, string message) => new
        {
            data,
            message,
            success = data is not null,
            time = DateTime.Now.ToString("G"),
        };

        public static object Data(object data, string message) => new
        {
            data,
            message,
            success = data is not null,
            time = DateTime.Now.ToString("G"),
        };
    }
}
