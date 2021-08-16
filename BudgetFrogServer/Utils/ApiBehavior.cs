using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BudgetFrogServer.Utils
{
    public class ApiBehavior
    {
        public BaseErrorFormatResponse ErrorFormatResponseValidation(ModelStateDictionary input, string message = null, bool success = false)
        {
            BaseErrorFormatResponse baseResult = new();
            foreach (var modelState in input)
            {
                baseResult.errors.Add(modelState.Key, modelState.Value.Errors.Select(err=>err.ErrorMessage).ToList());
            }

            baseResult.message = message;
            baseResult.success = success;
            return baseResult;
        }

        public class BaseErrorFormatResponse
        {
            public Dictionary<string, List<string>> errors { get; set; } = new();
            public string message { get; set; }
            public bool success { get; set; }
            public string time { get; set; } = DateTime.Now.ToString("G");
        }
    }
}
