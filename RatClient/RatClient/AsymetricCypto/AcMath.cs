using System;
using System.Numerics;
using System.Text;



public static class MathAc
{
    public static BigInteger Pow(BigInteger x, BigInteger y, BigInteger? z = null)
    {
        BigInteger n = BigInteger.One;
        if (z == null)
        {
            for (BigInteger i = 0; i < y; i++)
            {
                n *= x;
            }
            return n;
        }
        while (y > 0)
        {
            if (y % 2 != 0)
            {
                n = BigInteger.Remainder(n * x, z.Value);
            }
            y /= 2;
            x = BigInteger.Remainder(x * x, z.Value);
        }
        return n;
    }

    public static BigInteger altPow(BigInteger x, BigInteger y, BigInteger? z = null)
    {
        BigInteger power(BigInteger a, BigInteger b)
        {
            BigInteger result = 1;
            while (b > 0)
            {
                if (b % 2 != 0)
                {
                    result = z.HasValue ? BigInteger.Remainder(result * a, z.Value) : result * a;
                }
                b /= 2;
                a = z.HasValue ? BigInteger.Remainder(a * a, z.Value) : a * a;
            }
            return result;
        }

        return power(x, y);
    }

    public static BigInteger GetRand(BigInteger minimum, BigInteger maximum)
    {
        string randstring(BigInteger min, BigInteger max)
        {
            StringBuilder res = new StringBuilder();
            Random randint = new Random();
            int rng = randint.Next((min.ToString()).Length, (max.ToString()).Length);
            for (int i = 0; i < rng; i++)
            {
                res.Append(randint.Next(0, 9).ToString());
            }
            return res.ToString();
        }
        BigInteger result = BigInteger.Parse(randstring(minimum, maximum));
        while (result < minimum || result >= maximum)
        {
            result = BigInteger.Parse(randstring(minimum, maximum));
        }
        return result;
    }

    public static BigInteger RandAlt(BigInteger min, BigInteger max)
    {
        if (min > max)
            throw new ArgumentException("min value must be less than or equal to max value");

        var rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
        var range = max - min + 1;

        int bits = (int)Math.Ceiling(BigInteger.Log(range, 2));
        int bytes = (int)Math.Ceiling(bits / 8.0);

        BigInteger result;
        do
        {
            var buffer = new byte[bytes];
            rng.GetBytes(buffer);
            buffer[bytes - 1] &= (byte)((1 << (bits % 8)) - 1);
            result = new BigInteger(buffer);
        } while (result >= range);

        return result + min;
    }

    public static BigInteger RandBit(int nbit)
    {
        var min = Pow(2, nbit - 1) + 1;
        var max = Pow(2, nbit) - 1;
        return RandAlt(min, max);
    }

    public static byte[] RamdomBytes(int n)
    {
        Random r = new Random();
        byte[] b = new byte[n];
        r.NextBytes(b);
        return b;
    }
}
