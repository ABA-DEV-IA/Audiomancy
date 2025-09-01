"use client";

import React, { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { Button } from "@/components/ui/button";
import { Hourglass, Mic } from 'lucide-react' ; 

interface VoiceInputProps {
  onResult: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecognition = async () => {
    try {
      setIsRecording(true);

      const response = await fetch("/api/speech-token", { method: "POST" });
      if (!response.ok) throw new Error("Impossible d'obtenir le token");

      const { key, region } = await response.json();

      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
      speechConfig.speechRecognitionLanguage = "fr-FR";

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync((result) => {
        setIsRecording(false);

        if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          onResult(result.text);
        } else {
          console.error("Speech not recognized:", result);
        }

        recognizer.close();
      });
    } catch (err) {
      console.error("Erreur Speech SDK :", err);
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={startRecognition}
        disabled={isRecording}
        className="w-full flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow-lg transition"
      >
        {isRecording ? <Hourglass /> : <Mic />}
      </Button>
    </div>
  );
};

export default VoiceInput;
