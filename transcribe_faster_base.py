import time
from faster_whisper import WhisperModel
import sys

print("Loading model...")
start_time = time.time()
model_size = "base"
model = WhisperModel(model_size, device="cpu", compute_type="int8")
print(f"Model loaded in {time.time() - start_time:.2f}s")

print("Transcribing audio.wav...")
segments, info = model.transcribe("audio.wav", beam_size=5, language="pt", vad_filter=True)

print(f"Detected language '{info.language}' with probability {info.language_probability:.2f}")

with open("transcription.md", "w", encoding="utf-8") as f:
    f.write("# Transcrição\n\n")
    for segment in segments:
        line = f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}"
        print(line)
        f.write(line + "\n")
        f.flush()

print("Transcription saved to transcription.md")
