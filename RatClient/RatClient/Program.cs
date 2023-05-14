using System;
using System.Text;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;



namespace ConsoleApp43
{
    class Program
    {
        
        static void Main(string[] args)
        {
            Console.WriteLine(Encoding.UTF8.GetString(RatClient.ProcManage.ProcInfo.GetFormatedProcesses()));
        }
    }
}
