import { AnimationType, CharacterState } from "@/types/enums";
import React, { useEffect, useRef } from "react";
import Rive, { RiveRef } from "rive-react-native";
import { RiveBearProps } from "./types";

const RiveBear = ({ characterState }: RiveBearProps) => {
  const riveRef = useRef<RiveRef>(null);

  useEffect(() => {
    switch (characterState) {
      case CharacterState.RECORDING: {
        riveRef.current?.setInputState(
          "State Machine 1",
          AnimationType.HEAR,
          true,
        );
        riveRef.current?.setInputState(
          "State Machine 1",
          AnimationType.TALK,
          false,
        );

        break;
      }
      case CharacterState.PLAYING: {
        riveRef.current?.setInputState(
          "State Machine 1",
          AnimationType.HEAR,
          false,
        );
        riveRef.current?.setInputState(
          "State Machine 1",
          AnimationType.TALK,
          true,
        );

        break;
      }
      default: {
        riveRef.current?.setInputState(
          "State Machine 1",
          AnimationType.HEAR,
          false,
        );
        riveRef.current?.setInputState(
          "State Machine 1",
          AnimationType.TALK,
          false,
        );

        break;
      }
    }
  }, [characterState]);

  return (
    <Rive
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      source={require("../../assets/wave_hear_and_talk.riv")}
      ref={riveRef}
      style={{ width: 400, height: 400 }}
      autoplay
    />
  );
};

export default RiveBear;
