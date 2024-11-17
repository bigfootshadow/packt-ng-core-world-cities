using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Reflection;

namespace WorldCities.Server.Data;

public class ApiResult<T>
{
    public List<T> Data { get; private set; }
    public int PageIndex { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }
    public int TotalPages { get; private set; }
    public string? SortingColumn { get; private set; }
    public string? SortingOrder { get; private set; }
    
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
    
    private ApiResult(List<T> data, 
        int count,
        int pageIndex,
        int pageSize,
        string? sortingColumn,
        string? sortingOrder)
    {
        Data = data;
        PageIndex = pageIndex;
        PageSize = pageSize;
        SortingColumn = sortingColumn;
        SortingOrder = sortingOrder;
        TotalCount = count;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    }

    public static async Task<ApiResult<T>> CreateAsync(
        IQueryable<T> source,
        int pageIndex,
        int pageSize,
        string? sortingColumn,
        string? sortingOrder
    )
    {
        var count = await source.CountAsync();

        if (!string.IsNullOrEmpty(sortingColumn) && IsValidProperty(sortingColumn))
        {
            sortingOrder = !string.IsNullOrEmpty(sortingOrder) && sortingOrder.ToUpper() == "ASC"
                ? "ASC" 
                : "DESC";
            
            source = source.OrderBy($"{sortingColumn} {sortingOrder}");
        }
        
        var data = await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
        return new ApiResult<T>(data, count, pageIndex, pageSize, sortingColumn, sortingOrder);
    }

    private static bool IsValidProperty(string propertyName, bool throwException = true)
    {
        var prop = typeof(T).GetProperty(
            propertyName, 
            BindingFlags.IgnoreCase 
            | BindingFlags.Public 
            | BindingFlags.Instance);
        
        if (prop == null && throwException)
        {
            throw new NotSupportedException($"Property '{propertyName}' is not supported");
        }

        return prop != null;
    }
}