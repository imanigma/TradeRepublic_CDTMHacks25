import os
import speech_recognition as sr
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import json
import sounddevice as sd
import openai

# Configuration
OPENAI_API_KEY = "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"
ELEVEN_LABS_KEY = "sk_f333cc2904fac1a4a82ab72d333481678b709719280b1711"
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# Initialize components
recognizer = sr.Recognizer()
llm = OpenAI(temperature=0)


# Step 1: Voice to Text
def voice_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening for trading command...")
        audio = recognizer.listen(source)
    
    try:
        # Save audio to a temporary file
        temp_filename = "temp_audio.wav"
        with open(temp_filename, "wb") as f:
            f.write(audio.get_wav_data())

        # Use OpenAI Whisper API for transcription
        with open(temp_filename, "rb") as audio_file:
            response = openai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        
        text = response.text
        print(f"User said: {text}")

        # Optionally, delete the temp file
        os.remove(temp_filename)
        return text
    except Exception as e:
        print(f"Error in speech recognition: {e}")
        return ""
    


# Step 2: Command Extraction Chain
command_extraction_template = """Extract trading parameters from this command:
{command}

Return JSON format with:
- asset (stock/crypto symbol)
- action (buy/sell/check)
- quantity (number or 'all')
- leverage (if mentioned)
- stop_loss (if mentioned)
- take_profit (if mentioned)

If any parameter is missing, use null."""

prompt = PromptTemplate(
    template=command_extraction_template,
    input_variables=["command"]
)

command_chain = LLMChain(
    llm=llm,
    prompt=prompt,
    output_key="json_output"
)

# Step 3: Trading API Integration (Mock)
class TradingAPI:
    @staticmethod
    def execute_order(params):
        # In real implementation, connect to actual trading platform API
        print(f"Executing order: {params}")
        return {
            "status": "success",
            "order_id": "12345",
            "executed_price": 150.25,
            "timestamp": "2023-07-20T12:34:56Z"
        }

# Step 4: Response Generation Chain
response_template = """Generate a concise trading confirmation message using this data:
{api_response}

Current {asset} price: ${current_price}
Include order ID and important details in natural language."""

response_prompt = PromptTemplate(
    template=response_template,
    input_variables=["api_response", "asset", "current_price"]
)

response_chain = LLMChain(
    llm=llm,
    prompt=response_prompt,
    output_key="voice_response"
)

client = ElevenLabs(api_key=ELEVEN_LABS_KEY)


# Step 5: Text to Voice
def text_to_voice(text):
    try:
        audio = client.text_to_speech.convert(
            text=text,
            voice_id="JBFqnCBsd6RMkjVDRZzb",
            output_format="mp3_44100_128"
        )
        play(audio)
    except Exception as e:
        print(f"Error in voice generation: {e}")

# Main Execution Flow
def trading_voice_interface():
    # 1. Get voice input
    command_text = voice_to_text()
    
    if not command_text:
        return "No command detected"
    
    # 2. Extract trading parameters
    extraction_result = command_chain.run(command=command_text)
    
    try:
        params = json.loads(extraction_result)
        print(f"Extracted parameters: {params}")
    except json.JSONDecodeError:
        print("Failed to parse parameters")
        return
    
    # 3. Execute trade (mock implementation)
    trade_result = TradingAPI.execute_order(params)
    
    # 4. Generate voice response
    final_response = response_chain.run(
        api_response=trade_result,
        asset=params.get('asset', 'asset'),
        current_price=150.25  # Mock price, replace with real API call
    )
    
    print(f"Response: {final_response}")
    
    # 5. Convert to voice
    text_to_voice(final_response)

# Run the interface
if __name__ == "__main__":
    trading_voice_interface()