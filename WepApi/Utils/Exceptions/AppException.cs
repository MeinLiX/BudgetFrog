using System.Net;

namespace WepApi.Utils.Exceptions
{
    public class AppException : Exception
    {
        public List<string> ErrorMessages { get; }

        public HttpStatusCode StatusCode { get; }

        public AppException(string message, List<string>? errors = default, HttpStatusCode statusCode = HttpStatusCode.InternalServerError)
        : base(message)
        {
            ErrorMessages = errors ?? new List<string>();
            StatusCode = statusCode;
        }
    }
}
