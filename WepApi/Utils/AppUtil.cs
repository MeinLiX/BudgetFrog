namespace WepApi.Utils
{
    public class AppUtil
    {
        public static DateTime DatetimeNow => DateTime.Now;

        public static bool DateExpired(DateTime dt, TimeSpan timeToExpired) => DatetimeNow >= dt.Add(timeToExpired);
    }
}
