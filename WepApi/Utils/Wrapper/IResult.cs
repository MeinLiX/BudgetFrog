namespace WepApi.Utils.Wrapper;

public interface IResult
{
    List<string>? Messages { get; set; }

    bool Succeeded { get; set; }

    DateTime Date { get; set; }
}


public interface IErrorResult<T> : IResult<T>
{ 
    public string? Exception { get; set; }

    public string? ErrorId { get; set; }

    public int StatusCode { get; set; }
}

public interface IResult<out T> : IResult
{
    T? Data { get; }
}