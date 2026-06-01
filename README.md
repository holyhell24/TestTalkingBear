# Talking Bear

## Rive Object

- Used `rive-react-native` as main library to work with Rive object and it's animations
- All character animations is controlled by useEffect inside dedicated component RiveBear
- Each time `CharacterState` updates the character will play corresponding animation

## Audio Recording and playing

- For the recording and playing audio used `expo-av` library (`expo-audio` does not provide `metering` value so I decided to use depricated lib `expo-av`)
- The main purpose was to start the record from the start of the application to track microphone usage, then write the timestamp for the start speaking if mircophone threshold was exceeded (user said something). At the same time I updated `record` object's `progressUpdateIntervalMillis` value from 100ms to 1 second. This value means the time how often `onRecordingStatusUpdate` event is triggered and how often I updated `metering` value to track microphone threshold. So when user said something and the bear is started to listen him, it automatically stopped the recording when `metering` value will be lower then threshold after ~1 second of silence
- For the playing the audio I used the same library to play recorded file from start speaking timestamp (+ 500ms before to avoid the cutting of the start of the speach), then unload recorded file and start over
- For pitch up the audio I slightly sped up the audio file
