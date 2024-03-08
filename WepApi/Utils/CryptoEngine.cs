using System.Security.Cryptography;

namespace WepApi.Utils;

public class CryptoEngine
{
    private const int itterations = 9999;
    private const int saltSize = 16;
    private const int hashSize = 20;
    private const int Zero = 0;
    private static readonly HashAlgorithmName pwd_HashAlgorithmName = HashAlgorithmName.SHA512;
    /// <summary>
    /// Generation Hash from the password. 
    /// </summary>
    public static string GetHashValue(string password)
    {
        byte[] salt = new byte[saltSize];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, itterations, pwd_HashAlgorithmName);
        byte[] hash = pbkdf2.GetBytes(hashSize);
        byte[] hashBytes = new byte[salt.Length + hash.Length];
        Array.Copy(salt, Zero, hashBytes, Zero, salt.Length);
        Array.Copy(hash, Zero, hashBytes, salt.Length, hash.Length);

        return Convert.ToBase64String(hashBytes);
    }

    /// <summary>
    /// Compare the hash and password.
    /// </summary>
    public static bool EqualHashValue(string password, string passwordHash)
    {
        byte[] hashBytes = Convert.FromBase64String(passwordHash);
        byte[] salt = new byte[saltSize];
        Array.Copy(hashBytes, Zero, salt, Zero, salt.Length);
        var pbkdf2 = new Rfc2898DeriveBytes(password, salt, itterations, pwd_HashAlgorithmName);
        byte[] hash = pbkdf2.GetBytes(hashSize);
        for (int i = 0; i < hash.Length; i++)
            if (hashBytes[i + salt.Length] != hash[i])
                return false;

        return true;
    }
}
