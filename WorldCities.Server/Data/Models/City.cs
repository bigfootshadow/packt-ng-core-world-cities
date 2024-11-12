using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorldCities.Server.Data.Models;

[Table("Cities")]
[Index(nameof(Name))]
[Index(nameof(Lat))]
[Index(nameof(Lon))]
public class City
{
    /// <summary>
    /// The unique ID and primary key
    /// </summary>
    [Key]
    [Required]
    public int Id { get; set; }

    /// <summary>
    /// City name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// City Latitude
    /// </summary>
    [Column(TypeName = "decimal(7, 4)")]
    public decimal Lat { get; set; }

    /// <summary>
    /// City Longitude
    /// </summary>
    [Column(TypeName = "decimal(7, 4)")]
    public decimal Lon { get; set; }

    /// <summary>
    /// Country ID foreign key
    /// </summary>
    [ForeignKey(nameof(Country))]
    public int CountryId { get; set; }


    /// <summary>
    /// Navigation property Country
    /// </summary>
    public Country? Country { get; set; }
}