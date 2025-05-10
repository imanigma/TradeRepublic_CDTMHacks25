import os
import json
import speech_recognition as sr
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI
from elevenlabs import play
from elevenlabs.client import ElevenLabs
from tr_websocket_client import get_current_price, get_isin
#
import openai




# Config
OPENAI_API_KEY = "your-openai-api-key"
ELEVEN_LABS_KEY = "your-elevenlabs-api-key"
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# Initialize
recognizer = sr.Recognizer()
llm = OpenAI(temperature=0)
client = ElevenLabs(api_key=ELEVEN_LABS_KEY)

# Step 1: Voice to Text
def voice_to_text():
    with sr.Microphone() as source:
        print("Listening for trading command...")
        audio = recognizer.listen(source)

    try:
        with open("temp_audio.wav", "wb") as f:
            f.write(audio.get_wav_data())
        with open("temp_audio.wav", "rb") as file:
            resp = openai.audio.transcriptions.create(model="whisper-1", file=file)
        os.remove("temp_audio.wav")
        print("User said:", resp.text)
        return resp.text
    except Exception as e:
        print("Error:", e)
        return ""

# Step 2: Parse Command
cmd_template = """Extract trading parameters from this command:
{command}

Return JSON with:
- asset (symbol or company name)
- action (buy/sell/check)
- quantity
- leverage
- stop_loss
- take_profit
"""

command_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(template=cmd_template, input_variables=["command"]),
    output_key="json_output"
)

# Step 3: Mock Trade Execution
class TradingAPI:
    @staticmethod
    def execute_order(params):
        print("Executing order:", params)
        return {
            "status": "success",
            "order_id": "12345",
            "executed_price": params.get("price", 0),
            "timestamp": "2025-05-09T12:00:00Z"
        }

# Step 4: Generate Voice Response
response_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        template="""Generate a concise trading confirmation using:
{api_response}

Current {asset} price: ${current_price}
""",
        input_variables=["api_response", "asset", "current_price"]
    ),
    output_key="voice_response"
)

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
        print("TTS error:", e)

# Main App
def trading_voice_interface():
    cmd_text = voice_to_text()
    if not cmd_text:
        return
    extract = command_chain.run(command=cmd_text)
    try:
        params = json.loads(extract)
    except json.JSONDecodeError:
        print("JSON parsing failed.")
        return

    # Get real ISIN + price
    isin = get_isin(params["asset"])
    current_price = get_current_price(isin)
    params["price"] = current_price
    
    result = TradingAPI.execute_order(params)
    final_response = response_chain.run(api_response=result, asset=params["asset"], current_price=current_price)
    print("Response:", final_response)
    text_to_voice(final_response)

if __name__ == "__main__":
    trading_voice_interface()