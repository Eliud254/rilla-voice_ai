import os
import logging
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("Wait a minute please.")

client = OpenAI(api_key=api_key)

def transcribe_audio(file_path):
    try:
        logger.info(f"Transcribing {file_path}...")
        
        with open(file_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )
        
        transcript = response.text
        logger.info(f"Transcription complete. Length: {len(transcript)} characters")
        
        return transcript
    except FileNotFoundError:
        logger.error(f"Audio file not found: {file_path}")
        return "Error: Audio file not found."
    except Exception as e:
        logger.error(f"Error during transcription: {str(e)}")
        return f"Error during transcription: {str(e)}"

if __name__ == "__main__":
    # Replace this with the actual path to your audio file
    audio_file_path = "path/to/your/audio/file.wav"
    
    if not os.path.exists(audio_file_path):
        print(f"Error: The file {audio_file_path} does not exist.")
    else:
        result = transcribe_audio(audio_file_path)
        print(result)