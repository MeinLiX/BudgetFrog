using System.Security.Cryptography;

namespace WepApi.Utils;

public class CryptoEngine
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16; // 128 біт
        private const int HashSize = 32; // 256-біт
        private const int Iterations = 100000;
        private static readonly HashAlgorithmName HashAlgorithm = HashAlgorithmName.SHA512;

        public static (string Hash, string Salt) HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithm);
            byte[] hash = pbkdf2.GetBytes(HashSize);

            return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
        }

        public static bool VerifyPassword(string password, string savedHash, string savedSalt)
        {
            byte[] hashBytes = Convert.FromBase64String(savedHash);
            byte[] saltBytes = Convert.FromBase64String(savedSalt);

            var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, Iterations, HashAlgorithm);
            byte[] newHash = pbkdf2.GetBytes(HashSize);

            return CryptographicOperations.FixedTimeEquals(hashBytes, newHash);
        }

        public static bool HashesEqual(string lhash, string rhash)
        {
            if (string.IsNullOrEmpty(lhash) || string.IsNullOrEmpty(rhash))
                return false;
            

            byte[] lhashBytes = Convert.FromBase64String(lhash);
            byte[] rhashBytes = Convert.FromBase64String(rhash);

            return lhashBytes.Length == rhashBytes.Length && CryptographicOperations.FixedTimeEquals(lhashBytes, rhashBytes);
        }
    }
}
