# Voice Trading Bot

This project lets you place mock trades using your **voice**, powered by:
- OpenAI Whisper (speech-to-text)
- LangChain + GPT (command parsing)
- Trade Republic WebSocket API (price retrieval)
- ElevenLabs (text-to-speech)

## 🚀 How to Run
1. Clone the repo
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Replace `OPENAI_API_KEY` and `ELEVEN_LABS_KEY` in `main.py`
4. Run it:
   ```bash
   python main.py
   ```

Speak something like:
> Buy 10 shares of BASF with stop loss at 40 euros

The bot will:
- Transcribe your voice
- Extract intent + asset + quantity
- Query the current price (via Trade Republic)
- "Execute" a mock trade
- Read back a confirmation using ElevenLabs

- Extraction works :D
- Extracted company name from ISINs and stored them in a local file
  
