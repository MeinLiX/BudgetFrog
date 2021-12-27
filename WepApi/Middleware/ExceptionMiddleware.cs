using System.Net;
using System.Text.Json;
using WepApi.Utils.Exceptions;
using WepApi.Utils.Wrapper;

namespace WepApi.Middleware
{
    public class ExceptionMiddleware : IMiddleware
    {
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception exception)
            {
                string errorId = Guid.NewGuid().ToString();
                _logger.LogWarning($"ErrorId {errorId}. StackTrace:\n {exception.StackTrace[..200]}"); //TODO stdout; temp limit 200 symb
                var responseModel = await ErrorResult<object>.ReturnErrorAsync(exception.Message);
                //responseModel.Source = exception.TargetSite?.DeclaringType?.FullName;
                responseModel.Exception = exception.Message.Trim();
                responseModel.ErrorId = errorId;
                var response = context.Response;
                response.ContentType = "application/json";
                if (exception is not AppException && exception.InnerException is not null)
                {
                    while (exception.InnerException != null)
                    {
                        exception = exception.InnerException;
                    }
                }

                switch (exception)
                {
                    case AppException e:
                        response.StatusCode = responseModel.StatusCode = (int)e.StatusCode;
                        responseModel.Messages = e.ErrorMessages;
                        responseModel.Data = e.ErrorData;
                        break;

                    case KeyNotFoundException:
                        response.StatusCode = responseModel.StatusCode = (int)HttpStatusCode.NotFound;
                        break;

                    case ValidationException e:
                        response.StatusCode = responseModel.StatusCode = (int)HttpStatusCode.BadRequest;
                        responseModel.Exception = "Validation failed";
                        Dictionary<string, List<string>> errors = new();
                        foreach (var modelState in e.Errors)
                        {
                            if (errors.ContainsKey(modelState.PropertyName))
                            {
                                errors[modelState.PropertyName].Add(modelState.ErrorMessage);
                            }
                            else
                            {
                                errors.Add(modelState.PropertyName, new List<string>() { modelState.ErrorMessage });
                            }
                        }
                        responseModel.Data = errors;
                        responseModel.Messages = new List<string>();
                        break;

                    default:
                        response.StatusCode = responseModel.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }

                await response.WriteAsync(JsonSerializer.Serialize(responseModel));
            }
        }
    }
}
