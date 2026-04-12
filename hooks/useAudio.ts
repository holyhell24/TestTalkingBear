import { SILENT_RECORDING_PROGRESS_UPDATE_INTERVAL } from "@/constants/constants";
import { Audio } from "expo-av";
import { useCallback, useState } from "react";

export const useAudio = () => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const [record, setRecord] = useState<Audio.Recording>();
  const [metering, setMetering] = useState<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      if (record) {
        return;
      }

      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }

      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status: Audio.RecordingStatus) => {
          if (status.isRecording) {
            setMetering((prev) => status.metering ?? prev);
          }
        },
        SILENT_RECORDING_PROGRESS_UPDATE_INTERVAL,
      );

      setRecord(rec);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }, [permissionResponse, record, requestPermission]);

  const stopRecording = useCallback(async () => {
    try {
      if (!record) {
        return;
      }

      await record.stopAndUnloadAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = record.getURI();

      setRecord(undefined);

      return uri;
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  }, [record]);

  const playWithPitch = useCallback(async (uri: string, timestamp: number) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      {
        shouldPlay: true,
        positionMillis: timestamp,
        rate: 1.2,
        volume: 1.0,
      },
    );

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  }, []);

  const updateProgressInterval = useCallback(
    (progressUpdateIntervalMillis: number) => {
      if (record) {
        record.setProgressUpdateInterval(progressUpdateIntervalMillis);
      }
    },
    [record],
  );

  return {
    metering,
    record,
    startRecording,
    stopRecording,
    playWithPitch,
    updateProgressInterval,
  };
};
