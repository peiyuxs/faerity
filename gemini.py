import os
from pathlib import Path

from google import genai
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

api_key = os.getenv("GEMINI_KEY")
if not api_key:
    raise SystemExit("Missing GEMINI_KEY. Add your Gemini API key to the .env file.")

with genai.Client(api_key=api_key) as client:
    interaction = client.interactions.create(
        model="gemini-3.5-flash-lite",
        input="write a short haiku about toads",
    )
    print(interaction.output_text)