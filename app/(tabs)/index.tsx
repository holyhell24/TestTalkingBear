import RiveBear from "@/components/RiveBear";
import {
  MICROPHONE_THRESHOLD,
  RECORDING_PROGRESS_UPDATE_INTERVAL,
  SILENT_RECORDING_PROGRESS_UPDATE_INTERVAL,
  START_TALKING_OFFSET,
} from "@/constants/constants";
import { useAudio } from "@/hooks/useAudio";
import { CharacterState } from "@/types/enums";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  const [characterState, setCharacterState] = useState<CharacterState>(
    CharacterState.IDLE,
  );
  const [talkingTimestamp, setTalkingTimestamp] = useState({
    recordStart: 0,
    talkingStart: 0,
  });

  const {
    metering,
    record,
    startRecording,
    stopRecording,
    playWithPitch,
    updateProgressInterval,
  } = useAudio();

  useEffect(() => {
    if (!record && characterState === CharacterState.IDLE) {
      setTalkingTimestamp((prev) => ({
        ...prev,
        recordStart: Date.now(),
      }));

      startRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterState, record]);

  useEffect(() => {
    console.log("metering", metering);

    if (metering === null) {
      return;
    }

    const isSpeaking = metering > MICROPHONE_THRESHOLD;

    if (characterState === CharacterState.IDLE && isSpeaking) {
      setTalkingTimestamp((prev) => ({
        ...prev,
        talkingStart: Date.now() - START_TALKING_OFFSET,
      }));

      updateProgressInterval(RECORDING_PROGRESS_UPDATE_INTERVAL);

      setCharacterState(CharacterState.RECORDING);
    }

    if (characterState === CharacterState.RECORDING && !isSpeaking) {
      setCharacterState(CharacterState.PLAYING);

      const startTimestamp =
        talkingTimestamp.talkingStart - talkingTimestamp.recordStart;

      setTalkingTimestamp({
        recordStart: 0,
        talkingStart: 0,
      });

      stopRecording().then(async (uri) => {
        if (uri) {
          await playWithPitch(uri, startTimestamp);

          setCharacterState(CharacterState.IDLE);
          updateProgressInterval(SILENT_RECORDING_PROGRESS_UPDATE_INTERVAL);
        }
      });
    }
  }, [
    characterState,
    metering,
    talkingTimestamp,
    playWithPitch,
    stopRecording,
    updateProgressInterval,
  ]);

  return (
    <View style={styles.container}>
      <RiveBear characterState={characterState} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151718",
  },
});
