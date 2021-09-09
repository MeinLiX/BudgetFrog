using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Json;

using BudgetFrogTelegramBot.Models.Response;

namespace BudgetFrogTelegramBot.Utils.RequestClient
{
    class Client
    {
        private static readonly HttpClient client = new();
        private static readonly Uri baseUri=new("http://localhost:5000");

        public static async Task<bool> ValidationToken(Guid token)
        {
            try { 
            HttpResponseMessage res = await client.GetAsync($"{baseUri}external/token/{token}");
                if (res.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    Messages.Correct result = await res.Content.ReadFromJsonAsync<Messages.Correct>();
                    if (result.message == "Token is valid." || result.success == true) 
                        return true;
                }
                else if(res.StatusCode==System.Net.HttpStatusCode.BadRequest)
                {
                    return false;
                }
            }
            catch{ } //when response json model like Messages.Incorrect ( success == false ) 

            return false;
        }
    }
}
