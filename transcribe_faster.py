import time
from faster_whisper import WhisperModel

print("Loading model...")
start_time = time.time()
model_size = "medium" 
# we can use medium to get good accuracy or small to be faster
model = WhisperModel(model_size, device="cpu", compute_type="int8")
print(f"Model loaded in {time.time() - start_time:.2f}s")

print("Transcribing video.mp4...")
segments, info = model.transcribe("video.mp4", beam_size=5, language="pt")

print(f"Detected language '{info.language}' with probability {info.language_probability:.2f}")

with open("transcription.md", "w", encoding="utf-8") as f:
    f.write("# Transcrição\n\n")
    for segment in segments:
        line = f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}"
        print(line)
        f.write(line + "\n")

print("Transcription saved to transcription.md")
