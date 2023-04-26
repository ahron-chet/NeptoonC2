using System.Numerics;


public class BitConvert
{
    public static BigInteger GetBitLen(BigInteger n)
    {
        BigInteger c = BigInteger.One;
        while (n >= 256)
        {
            n = BigInteger.Divide(n, 256);
            c = BigInteger.Add(c, 1);
        }
        return c;
    }
    public static byte[] ToBytes(BigInteger n)
    {
        BigInteger len = GetBitLen(n);
        List<byte> b = new List<byte>();
        for (int i = 0; i < len; i++)
        {
            b.Add((byte)BigInteger.Remainder(n, 256));
            n = BigInteger.Divide(n, 256);
        }
        b.Reverse();
        return b.ToArray();
    }
    public static BigInteger FromBytes(byte[] bytearr)
    {
        int c = bytearr.Length - 1;
        BigInteger n = BigInteger.Zero;
        for (int i = 0; i <= c; i++)
        {
            BigInteger m = MathAc.Pow(256, c - i);
            BigInteger r = BigInteger.Multiply(m, (BigInteger)bytearr[i]);
            n = BigInteger.Add(r, n);
        }
        return n;
    }
}