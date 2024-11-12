using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Security;
using Microsoft.EntityFrameworkCore;
using WorldCities.Server.Data;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        private class DataRecord
        {
            public string City { get; set; }
            public decimal Lat { get; set; }
            public decimal Lng { get; set; }
            public string Country { get; set; }
            public string Iso2 { get; set; }
            public string Iso3 { get; set; }
        }

        private sealed class DataRecordMap : ClassMap<DataRecord>
        {
            public DataRecordMap()
            {
                Map(m => m.City).Name("city");
                Map(m => m.Lat).Name("lat");
                Map(m => m.Lng).Name("lng");
                Map(m => m.Country).Name("country");
                Map(m => m.Iso2).Name("iso2");
                Map(m => m.Iso3).Name("iso3");
            }
        }

        public SeedController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult> ImportCities()
        {
            if (!_environment.IsDevelopment())
            {
                throw new SecurityException("only for dev environment");
            }

            var path = Path.Combine(_environment.ContentRootPath, "Data/Source/worldcities.csv");

            int recordCount;
            int addedCountries;
            var addedCities = 0;

            using (var reader = new StreamReader(path))

            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                csv.Context.RegisterClassMap<DataRecordMap>();
                var records = csv.GetRecords<DataRecord>().ToList();
                recordCount = records.Count;

                var dbCountryNames = _context.Countries
                    .AsNoTracking()
                    .Select(c => c.Name);

                var countries = records
                    .Select(r => new Country { Name = r.Country, ISO2 = r.Iso2, ISO3 = r.Iso3 })
                    .DistinctBy(c => new { c.Name, c.ISO2, c.ISO3 })
                    .Where(c => !dbCountryNames.Any(n => n == c.Name))
                    .ToList();


                addedCountries = countries.Count;

                if (addedCountries > 0)
                {
                    await _context.Countries.AddRangeAsync(countries);
                    await _context.SaveChangesAsync();
                }

                var dbCountries = _context.Countries
                    .AsNoTracking()
                    .ToList();

                var dbCities = _context.Cities
                    .AsNoTracking()
                    .ToDictionary(c => (
                        c.Name,
                        c.Lat,
                        c.Lon,
                        c.CountryId));

                foreach (var record in records)
                {
                    var countryId = dbCountries.First(c => c.Name.Equals(record.Country, StringComparison.InvariantCultureIgnoreCase)).Id;

                    if (!dbCities.ContainsKey((Name: record.City, Lat: record.Lat, Lon: record.Lng, CountryId: countryId)))
                    {
                        await _context.Cities.AddAsync(new City
                        {
                            Name = record.City,
                            Lat = record.Lat,
                            Lon = record.Lng,
                            CountryId = countryId
                        });
                        addedCities++;
                    }
                }

                if (addedCities > 0)
                {
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new
            {
                recordCount, 
                addedCountries,
                addedCities
            });
        }
    }
}
