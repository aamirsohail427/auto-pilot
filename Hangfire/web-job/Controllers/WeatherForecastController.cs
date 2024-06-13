using Hangfire;
using Microsoft.AspNetCore.Mvc;
using web_job.Services.Business;

namespace web_job.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IBusinessService _service;
        private readonly IRecurringJobManager _client;
        public WeatherForecastController(IBusinessService service, IRecurringJobManager client)
        {
            _service = service;
            _client = client;
        }
    }
}