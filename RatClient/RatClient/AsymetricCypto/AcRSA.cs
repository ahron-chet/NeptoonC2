
using System.Numerics;


namespace RatClient.AcRSA
{
    public static class RSA
    {
        public static Tuple<BigInteger[], BigInteger[]> GenFullKey(int nbit)
        {
            BigInteger e = 65537;
            BigInteger p = Primes.GenPrime(nbit);
            BigInteger q = Primes.GenPrime(nbit);
            BigInteger n = BigInteger.Multiply(q, p);
            BigInteger phi = BigInteger.Multiply((p - 1), (q - 1));
            BigInteger x = Euclids.Gcdx(e, phi)[1];
            BigInteger d = phi + x;
            BigInteger[] pubkey = { e, n };
            BigInteger[] prvtkey = { e, p, q, n, d };
            return Tuple.Create(pubkey, prvtkey);
        }
        private static BigInteger _encrypt(BigInteger m, BigInteger[] pubkey)
        {
            return MathAc.Pow(m, pubkey[0], pubkey[1]);
        }

        private static BigInteger _decrypt(BigInteger m, BigInteger[] prvtkey)
        {
            int len = prvtkey.Length;
            return MathAc.Pow(m, prvtkey[len - 1], prvtkey[len - 2]);
        }

        public static byte[] Encrypt(byte[] msg, BigInteger[] pubkey)
        {
            BigInteger m = BitConvert.FromBytes(padding(msg, pubkey[1]));
            BigInteger enc = _encrypt(m, pubkey);
            return BitConvert.ToBytes(enc);
        }
        public static byte[] Decrypt(byte[] encryptedMsg, BigInteger[] prvtkey)
        {
            BigInteger m = BitConvert.FromBytes(encryptedMsg);
            BigInteger dec = _decrypt(m, prvtkey);
            return unpading(BitConvert.ToBytes(dec));
        }

        public static byte[] Gethash(string algo, byte[] data)
        {
            var hasher = System.Security.Cryptography.HashAlgorithm.Create(algo);
            return hasher.ComputeHash(data);
        }

        private static byte[] padding(byte[] msg, BigInteger n)
        {
            if (msg.Length > BitConvert.GetBitLen(n) - 16)
            {
                throw new ArgumentException("Data exceeds maximum allowed length.");
            }
            return msg.Concat(Gethash("md5", MathAc.RamdomBytes(20))).ToArray();
        }
        private static byte[] unpading(byte[] msg)
        {
            return new ArraySegment<byte>(msg, 0, msg.Length - 16).ToArray();

        }
    }
}
