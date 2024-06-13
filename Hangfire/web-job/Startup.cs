using AutoMapper;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using web_job.AutoMapper;
using web_job.Models;
using web_job.Services.Business;
using web_job.Services.Methods;

namespace web_job
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            var mapperConfiguration = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new AutoMapperProfile());
            });
            IMapper mapper = mapperConfiguration.CreateMapper();
            services.AddSingleton(mapper);
            services.AddHangfire(x =>
            {
                x.UseSqlServerStorage(Configuration.GetConnectionString("AutoPilot"));
            });
            services.AddScoped<IBusinessService, BusinessService>();
            services.AddHangfireServer();

            services.AddDbContext<AutoPilotContext>(options => options.UseSqlServer(Configuration.GetConnectionString("AutoPilot")));

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IRecurringJobManager recurringJobManager, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseHangfireDashboard();
            recurringJobManager.AddOrUpdate("Run every minute", () => serviceProvider.GetService<IBusinessService>().GetBusiness(), Cron.HourInterval(6));
        }

        public static void PrintTest()
        {
           ReminderMethods.TestingMethod();
        }

    }
}
