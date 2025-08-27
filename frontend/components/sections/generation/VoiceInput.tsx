"use client";

import React, { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false);

const startRecognition = async () => {
  try {
    setIsRecording(true);

    // 1️⃣ Récupérer la clé + région depuis backend
    const response = await fetch("http://localhost:8000/speech-token", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Impossible d'obtenir la clé Azure");

    const { key, region } = await response.json();

    // 2️⃣ Configurer Azure Speech SDK directement
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
        {isRecording ? "⌛" : "🎙️"}
        </Button>
    </div>
  );
};

export default VoiceInput;
