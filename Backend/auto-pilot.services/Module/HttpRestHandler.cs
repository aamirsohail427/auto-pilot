using auto_pilot.services.DTO.Config;
using IO.Swagger.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace aauto_pilot.services.Module
{
    public static class HttpRestHandler
    {
        private static async Task<T> DeserializeAsync<T>(HttpContent response)
        {
            var content = await response.ReadAsStringAsync();

            try
            {
                return JsonConvert.DeserializeObject<T>(content);
            }
            catch (IOException e)
            {
                throw new ApiException(500, e.Message);
            }

            catch (Exception e)
            {
                throw new ApiException(500, e.Message);
            }
        }
        public async static Task<T> PostAsync<T>(this HttpClient client, string url, Dictionary<string, string> body)
        {
            HttpResponseMessage tokenResponse = await client.PostAsync(url, new FormUrlEncodedContent(body));
            var jsonContent = await tokenResponse.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(jsonContent);
        }
        public async static Task<T> ExecAsync<T>(this HttpClient client, string url, HttpRequestMessage req)
        {
            try
            {
                client.BaseAddress = new Uri(url);
                var response = await client.SendAsync(req);

                if (response.IsSuccessStatusCode)
                {
                    var result = await DeserializeAsync<T>(response.Content);
                    return result;
                }
                var jresult = await response.Content.ReadAsStringAsync();
                throw new ApiException(500, jresult);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static Dictionary<string, string> ConvertToDictionary<T>(this T model)
        {
            var serializedModel = JsonConvert.SerializeObject(model);
            return JsonConvert.DeserializeObject<Dictionary<string, string>>(serializedModel);
        }
    }
}
