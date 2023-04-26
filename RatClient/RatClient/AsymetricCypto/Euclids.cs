using System.Numerics;

class Euclids
{
    public static BigInteger Gcd(BigInteger a, BigInteger b)
    {
        BigInteger r = BigInteger.Zero;
        while (true)
        {
            if (a == 0 || b == 0)
            {
                break;
            }
            BigInteger na = a;
            BigInteger nb = b;
            a = BigInteger.Remainder(na, nb);
            b = BigInteger.Remainder(nb, na);
            r = BigInteger.Add(b, a);
        }
        return r;
    }

    public static BigInteger[] Gcdx(BigInteger a, BigInteger b)
    {
        BigInteger[] res;
        if (a == 0)
        {
            res = new BigInteger[] { b, BigInteger.Zero, BigInteger.One };
            return res;
        }
        BigInteger r = b % a;
        BigInteger[] g = Gcdx(r, a);
        r = g[0];
        BigInteger x1 = g[1];
        BigInteger y1 = g[2];
        BigInteger x = y1 - (BigInteger.Multiply(BigInteger.Divide(b, a), x1));
        BigInteger y = x1;
        res = new BigInteger[] { r, x, y };
        return res;
    }
}
