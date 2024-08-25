import os
import logging
from openai import OpenAI

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    except OpenAI.APIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return f"Error: OpenAI API error - {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected error during transcription: {str(e)}")
        return f"Error: Unexpected error during transcription - {str(e)}"

if __name__ == "__main__":
    audio_file_path = "path/to/your/audio/file.wav"
    result = transcribe_audio(audio_file_path)
    print(result)