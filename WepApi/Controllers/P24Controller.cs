using Microsoft.AspNetCore.Mvc;
using privat24.NET.Utils;

namespace WepApi.Controllers
{

    public class P24Controller : BaseController
    {

        [HttpGet("test/{id}/{password}/{card}")]
        public async Task<IActionResult> Test(string id, string password, string card)
        {
            var res = await privat24.NET.Source.P24Client.Balance(id, password, card);

            return new ContentResult
            {
                Content = P24XmlParser.ParseToString(res),
                ContentType = "application/xml",
                StatusCode = StatusCodes.Status200OK,
            };
        }
    }
}
