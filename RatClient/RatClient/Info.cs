using System.IO.Compression;

class Info
{
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
}

