using RatClient.Mtool;


namespace ConsoleApp43
{
    class Program
    {
        static void Main(string[] args)
        {
            ScreenRecorder videoRecorder = new ScreenRecorder();

            Console.WriteLine("Starting recording...");
            videoRecorder.StartRecording("qaz.avi");

            Console.WriteLine("Press any key to stop recording...");
            Console.ReadKey();

            videoRecorder.StopRecording();
            Console.WriteLine("Recording stopped.");
        }
    }
}
