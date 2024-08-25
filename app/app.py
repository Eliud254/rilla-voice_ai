from flask import Flask, jsonify, request
from flask_cors import CORS
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Flask server is running!"
@app.route('/record', methods=['POST'])
def record_audio():
    print("Received request to /record endpoint")  # Add this log
    try:
        duration = request.json.get('duration', 5)
        fs = 44100
        print("Recording...")
        audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=2)
        sd.wait()
        write("output.wav", fs, np.array(audio_data * 32767, dtype=np.int16))
        print("Recording complete.")
        return jsonify({"message": "Recording complete", "file": "output.wav"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Error recording audio.", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
