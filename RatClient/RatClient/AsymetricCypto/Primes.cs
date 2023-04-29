using System.Numerics;
using System.Linq;
using System;

public class Primes
{
    public static bool isPrime(int n)
    {
        int[] primes = { 2, 3, 5 };
        if (n == 0 || n == 1)
        {
            return false;
        }
        if (primes.Contains(n))
        {
            return true;
        }
        if (n < 5)
        {
            return false;
        }
        if (n % (n / 2) == 0)
        {
            return false;
        }
        for (int i = 2; i <= (int)Math.Sqrt(n); i++)
        {
            if (n % i == 0)
            {
                return false;
            }
        }
        return true;
    }
    private static bool iterat(BigInteger a, BigInteger e, BigInteger m, BigInteger n)
    {
        if (MathAc.Pow(a, e, n) == 1)
        {
            return true;
        }
        for (int i = 0; i < m; i++)
        {
            BigInteger y = MathAc.Pow(2, i) * e;
            BigInteger t = MathAc.Pow(a, y, n);
            if (t == n - 1)
            {
                return true;
            }
        }
        return false;
    }
    private static BigInteger[] div(BigInteger n)
    {
        BigInteger e = n - 1;
        BigInteger m = 0;
        var res = new BigInteger[2];
        while (e % 2 == 0)
        {
            e = e / 2;
            m = m + 1;
        }
        res[0] = e;
        res[1] = m;
        return res;
    }
    public static bool MilerRabin(BigInteger n)
    {
        BigInteger[] em = div(n);
        BigInteger e = em[0];
        BigInteger m = em[1];
        for (int i = 0; i < 20; i++)
        {
            BigInteger a = MathAc.GetRand(2, n);
            if (!iterat(a, e, m, n))
            {
                return false;
            }
        }
        return true;
    }
    public static BigInteger GenPrime(int nbit)
    {
        int[] primes = {
            2  , 3  , 5  , 7  , 11 , 13 , 17 , 19 ,
            23 , 29 , 31 , 37 , 41 , 43 , 47 , 53 ,
            59 , 61 , 67 , 71 , 73 , 79 , 83 , 89 ,
            97 , 101, 103, 107, 109, 113, 127, 131,
            137, 139, 149, 151, 157, 163, 167, 173,
            179, 181, 191, 193, 197, 199, 211, 223,
            227, 229, 233, 239, 241, 251, 257, 263,
            269, 271, 277, 281, 283, 293, 307, 311,
            313, 317, 331, 337, 347, 349, 353, 359,
            367, 373, 379, 383, 389, 397, 401, 409,
            419, 421, 431, 433, 439, 443, 449, 457,
            461, 463, 467, 479, 487, 491, 499, 503,
            509, 521, 523, 541, 547, 557, 563, 569,
            571, 577, 587, 593, 599, 601, 607, 613,
            617, 619, 631, 641, 643, 647, 653, 659,
            661, 673, 677, 683, 691, 701, 709, 719,
            727, 733, 739, 743, 751, 757, 761, 769,
            773, 787, 797, 809, 811, 821, 823, 827,
            829, 839, 853, 857, 859, 863, 877, 881,
            883, 887, 907, 911, 919, 929, 937, 941,
            947, 953, 967, 971, 977, 983, 991, 997,
        };
        while (true)
        {
            BigInteger p = MathAc.RandBit(nbit);
            int c = 0;
            foreach (int i in primes)
            {
                if (p % i == 0)
                {
                    c = 1;
                }
            }
            if (c == 0)
            {
                if (MilerRabin(p))
                {
                    return p;
                }
            }
        }
    }
}
