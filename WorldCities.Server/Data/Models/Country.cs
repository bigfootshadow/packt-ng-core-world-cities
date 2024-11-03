using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WorldCities.Server.Data.Models;

[Table("Countries")]
[Index(nameof(Name))]
[Index(nameof(ISO2))]
[Index(nameof(ISO3))]
public class Country
{
    /// <summary>
    /// The unique ID and primary key
    /// </summary>
    [Key]
    [Required]
    public int Id { get; set; }

    /// <summary>
    /// Country name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// ISO 2 char country code
    /// </summary>
    public required string ISO2 { get; set; }

    /// <summary>
    /// ISO 3 char country code
    /// </summary>
    public required string ISO3 { get; set; }

    /// <summary>
    /// Cities in this Country
    /// </summary>
    public ICollection<City>? Cities { get; set; }
}