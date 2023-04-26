#include "pch.h"

#pragma comment(lib, "Wtsapi32.lib")


extern "C" __declspec(dllexport)
int ReadFromPipe(HANDLE hRead, unsigned char* outputBuffer, int len)
{
    DWORD bytesRead;
    std::vector<char> buffer(len);

    if (ReadFile(hRead, static_cast<LPVOID>(buffer.data()), len, &bytesRead, NULL) && bytesRead > 0)
    {
        memcpy(outputBuffer, buffer.data(), bytesRead);
    }
    return bytesRead;
}

extern "C" __declspec(dllexport)
int RunAsLoggedInUser(const wchar_t* command, HANDLE * phRead) {
    DWORD sessionID = WTSGetActiveConsoleSessionId();
    HANDLE hToken = NULL;


    if (WTSQueryUserToken(sessionID, &hToken)) {
        STARTUPINFOW si;
        PROCESS_INFORMATION pi;
        SECURITY_ATTRIBUTES sa;
        HANDLE hRead, hWrite;

        ZeroMemory(&pi, sizeof(pi));
        ZeroMemory(&sa, sizeof(sa));
        sa.nLength = sizeof(sa);
        sa.bInheritHandle = TRUE;
        sa.lpSecurityDescriptor = NULL;

        if (!CreatePipe(&hRead, &hWrite, &sa, 0))
        {
            std::cout << "Failed to create pipe. Error code: " << GetLastError() << std::endl;
            return -1;
        }

        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        si.dwFlags = STARTF_USESTDHANDLES;
        si.hStdInput = NULL;
        si.hStdOutput = hWrite;
        si.hStdError = hWrite;

        ZeroMemory(&pi, sizeof(pi));
        if (CreateProcessWithTokenW(hToken, 0, NULL, (LPWSTR)command, CREATE_NO_WINDOW | CREATE_UNICODE_ENVIRONMENT, NULL, NULL, &si, &pi))
        {
            CloseHandle(pi.hThread);
            CloseHandle(pi.hProcess);
            CloseHandle(hWrite);

            if (phRead)
            {
                *phRead = hRead;
            }
        }
        else
        {
            CloseHandle(hRead);
            CloseHandle(hWrite);
            return -1;
        }

        return 0;
    }
}
