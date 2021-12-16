using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;
using WepApi.Utils.Wrapper;

namespace WepApi.Utils
{
    public class ApiBehavior
    {
        public Wrapper.IResult ErrorFormatResponseValidation(ModelStateDictionary input)
        {
            Dictionary<string, List<string>> errors = new();
            foreach (var modelState in input)
            {
                errors.Add(modelState.Key, modelState.Value.Errors.Select(err => err.ErrorMessage).ToList());
            }

            var responseModel = Result<Dictionary<string, List<string>>>.ReturnError();
            responseModel.Source = "FluentValidator";
            responseModel.Exception = "FluentException";
            responseModel.StatusCode = (int)HttpStatusCode.BadRequest;
            responseModel.ErrorId = Guid.NewGuid().ToString();
            responseModel.Data= errors;
            responseModel.Succeeded = false;
            return responseModel;
        }
    }
}
