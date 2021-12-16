namespace WepApi.Utils.Wrapper;

public interface IResult
{
    List<string>? Messages { get; set; }

    bool Succeeded { get; set; }

    DateTime Date { get; set; }
}

public interface IResult<out T> : IResult
{
    T? Data { get; }
}
