using Microsoft.EntityFrameworkCore;

namespace WorldCities.Server.Data;

public class ApiResult<T>
{
    public List<T> Data { get; private set; }
    public int PageIndex { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }
    public int TotalPages { get; private set; }
    
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;
    
    private ApiResult(List<T> data, 
        int count,
        int pageIndex,
        int pageSize)
    {
        Data = data;
        PageIndex = pageIndex;
        PageSize = pageSize;
        TotalCount = count;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    }

    public static async Task<ApiResult<T>> CreateAsync(
        IQueryable<T> source,
        int pageIndex,
        int pageSize
    )
    {
        var count = await source.CountAsync();
        var data = await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
        return new ApiResult<T>(data, count, pageIndex, pageSize);
    }
}