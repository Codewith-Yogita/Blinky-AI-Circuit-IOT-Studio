import { useState } from "react";
import { Eye, Volume2, VolumeX, Sparkles, Cpu } from "lucide-react";

function VisionVoiceBar({ instructions = [] }) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleSpeakGuidance = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }

    const textToSpeak = instructions.length > 0
      ? instructions.join(". ")
      : "Welcome to Blinky. Connect your HC-SR04 sensor VCC to five volts, trigger to GPIO five, and echo to GPIO eighteen.";

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingVoice(true);
  };

  return (
    <div className="vision-voice-bar">
      {/* 02 Vision AI Gemini Component Detection */}
      <div className="vision-ai-card">
        <div className="vision-badge">
          <Eye size={13} className="text-amber-400" />
          <span className="badge-text">02 VISION AI • Google Gemini</span>
          <span className="vision-dot" />
        </div>
        <div className="vision-info">
          <span className="vision-title">
            <Sparkles size={13} className="inline text-amber-400 mr-1" />
            Hardware Detection Synced via Camera:
          </span>
          <div className="detected-chips">
            <span className="part-chip">
              <Cpu size={11} /> ESP32 DevKit V1
            </span>
            <span className="part-chip">HC-SR04 Ultrasonic</span>
            <span className="part-chip">Piezo Buzzer</span>
            <span className="part-chip">Red LED (220Ω)</span>
          </div>
        </div>
      </div>

      {/* 06 Voice Interaction ElevenLabs */}
      <div className="voice-card">
        <div className="voice-header">
          <span className="voice-tag">
            <Volume2 size={13} className="text-red-400" />
            06 VOICE GUIDANCE • ElevenLabs
          </span>
          {isPlayingVoice && (
            <span className="waveform-anim">
              <span></span><span></span><span></span><span></span>
            </span>
          )}
        </div>
        <button
          type="button"
          className={`voice-play-btn ${isPlayingVoice ? "playing" : ""}`}
          onClick={handleSpeakGuidance}
        >
          {isPlayingVoice ? (
            <>
              <VolumeX size={15} />
              <span>Stop Voice Guidance</span>
            </>
          ) : (
            <>
              <Volume2 size={15} />
              <span>Listen: &apos;Connect this ➔ here&apos;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default VisionVoiceBar;
