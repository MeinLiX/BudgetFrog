using System.Net;

namespace WepApi.Utils.Exceptions
{
    public class AppException : Exception
    {
        public List<string> ErrorMessages { get; }

        public List<object> ErrorData { get; }
        public HttpStatusCode StatusCode { get; }
        public AppException():this(string.Empty)
        {

        }
        public AppException(string message, List<string>? messages = default, List<object>? errorData = default, HttpStatusCode statusCode = HttpStatusCode.InternalServerError)
        : base(message)
        {
            ErrorMessages = messages ?? new List<string>();
            ErrorData = errorData ?? new List<object>();
            StatusCode = statusCode;
        }
    }
}
