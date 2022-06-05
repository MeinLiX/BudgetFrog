using System.Text;

namespace privat24.NET.Utils;

public class HashEngine
{
    private static string GetByteArrayAsHexadecimalString(IEnumerable<byte> buffer)
        => buffer.Select(b => b.ToString("x2")).Aggregate("", (total, cur) => total + cur);

    public static string MD5(string data)
    {
        var md5 = System.Security.Cryptography.MD5.Create();
        var md5Res = md5.ComputeHash(Encoding.UTF8.GetBytes(data));
        return GetByteArrayAsHexadecimalString(md5Res);
    }

    public static string SHA1(string data)
    {
        var sha1 = System.Security.Cryptography.SHA1.Create();
        var sha1Res = sha1.ComputeHash(Encoding.UTF8.GetBytes(data));
        return GetByteArrayAsHexadecimalString(sha1Res);
    }

    /// <returns>SHA1(MD5(data))</returns>
    public static string SHA1MD5(string data) => SHA1(MD5(data));

    /// <returns>SHA1(MD5(data+password))</returns>
    public static string SHA1MD5(string data, string password) => SHA1MD5($"{data}{password}");
}
