#include "pch.h"    

std::string WideToMultiByte(const WCHAR* wideStr)
{
    int bufferSize = WideCharToMultiByte(CP_UTF8, 0, wideStr, -1, NULL, 0, NULL, NULL);
    std::string multiByteStr(bufferSize, 0);
    WideCharToMultiByte(CP_UTF8, 0, wideStr, -1, &multiByteStr[0], bufferSize, NULL, NULL);
    return multiByteStr;
}

std::vector<std::string> WifiProfiles(HANDLE hClient, GUID interfaceGuid)
{
    PWLAN_PROFILE_INFO_LIST pProfileList = NULL;
    DWORD result = WlanGetProfileList(hClient, &interfaceGuid, NULL, &pProfileList);
    std::vector<std::string> xmlProfiles;
    if (result != ERROR_SUCCESS)
    {
        printf("Error getting profile list: %d\n", result);
        return xmlProfiles;
    }
    for (DWORD i = 0; i < pProfileList->dwNumberOfItems; i++)
    {
        LPWSTR xmlProfile = NULL;
        DWORD flags = WLAN_PROFILE_GET_PLAINTEXT_KEY;
        DWORD grantedAccess;
        result = WlanGetProfile(hClient, &interfaceGuid, pProfileList->ProfileInfo[i].strProfileName, NULL, &xmlProfile, &flags, &grantedAccess);
        if (result == ERROR_SUCCESS)
        {
            std::string profileStr = WideToMultiByte(xmlProfile);
            xmlProfiles.push_back(profileStr);
        }
        else
        {
            printf("Error getting profile XML: %d\n", result);
        }
    }
    if (pProfileList != NULL)
    {
        WlanFreeMemory(pProfileList);
    }

    return xmlProfiles;
}





std::unordered_map<std::string, std::vector<std::string>> enumerateInterfacesAndProfiles(HANDLE hClient)
{
    PWLAN_INTERFACE_INFO_LIST pInterfaceList = NULL;
    DWORD result = WlanEnumInterfaces(hClient, NULL, &pInterfaceList);
    std::unordered_map<std::string, std::vector<std::string>> interfaceProfiles;

    if (result != ERROR_SUCCESS)
    {
        printf("Error enumerating interfaces: %d\n", result);
        return interfaceProfiles;
    }

    for (DWORD i = 0; i < pInterfaceList->dwNumberOfItems; i++)
    {
        std::string key = WideToMultiByte(pInterfaceList->InterfaceInfo[i].strInterfaceDescription);
        std::vector<std::string> profile = WifiProfiles(hClient, pInterfaceList->InterfaceInfo[i].InterfaceGuid);
        interfaceProfiles[key] = profile;
    }

    if (pInterfaceList != NULL)
    {
        WlanFreeMemory(pInterfaceList);
    }

    return interfaceProfiles;
}


extern "C" __declspec(dllexport)
int getWifiProfiles(char** outPtr, int* length)
{
    DWORD version = 0;
    HANDLE hClient = NULL;
    DWORD result = WlanOpenHandle(2, NULL, &version, &hClient);

    if (result != ERROR_SUCCESS)
    {
        printf("Error opening handle: %d\n", result);
        return 1;
    }
    std::unordered_map<std::string, std::vector<std::string>> interfaceProfiles = enumerateInterfacesAndProfiles(hClient);
    std::ostringstream streamres;
    for (const auto& kv : interfaceProfiles) {
        std::string key = kv.first;
        key.erase(std::remove(key.begin(), key.end(), '\0'), key.end());

        streamres << INTERFACE_NAME << key << INTERFACE_NAME;

        const std::vector<std::string>& profiles = kv.second;
        for (size_t i = 0; i < profiles.size(); ++i) {
            std::string profile = profiles[i];
            profile.erase(std::remove(profile.begin(), profile.end(), '\0'), profile.end());

            streamres << PROFILE_INFO << profile << PROFILE_INFO;
        }
    }


    result = WlanCloseHandle(hClient, NULL);
    if (result != ERROR_SUCCESS)
    {
        printf("Error closing handle: %d\n", result);
        return 1;
    }
    std::string str = streamres.str();
    streamres.clear();
    *length = str.size();

    *outPtr = new char[str.size()];
    memcpy(*outPtr, str.c_str(), str.size());
    return 0;
}

extern "C" __declspec(dllexport)
void deleteBuffer(char* buffer)
{
    delete[] buffer;
}
