import os
import re
import requests
import speech_recognition as sr
import pyttsx3
import pandas as pd
from openai import OpenAI
import spacy
from fuzzywuzzy import process
from playsound import playsound

CSV_FILE = r"C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data_with_company.csv"

# Configuration
CSV_FILE = r"tradeFiltered.csv"
ALPHA_VANTAGE_API_KEY = ""
openai_client = OpenAI(
    api_key=""
)
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Load data and model
df = pd.read_csv(CSV_FILE)
nlp = spacy.load("en_core_web_sm")


# Function to search for ticker symbol using Alpha Vantage's SYMBOL_SEARCH API
def get_ticker_from_alphavantage(company_name):
    try:
        url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={company_name}&apikey={ALPHA_VANTAGE_API_KEY}"
        response = requests.get(url)
        data = response.json()

        # Log the full response for debugging
        print(f"Full response for {company_name}: {data}")

        if "bestMatches" in data:
            # Iterate through the best matches to find the correct symbol
            for match in data["bestMatches"]:
                ticker = match.get("1. symbol")
                company = match.get("2. name")
                exchange = match.get("4. region", "").lower()

                # Check if the region is the US and select the first US match
                if "united states" in exchange:
                    print(
                        f"Ticker symbol found: {ticker} for company: {company} on exchange: {exchange}"
                    )
                    return ticker

            # If no valid ticker is found in the US region, log and return None
            print(
                f"Error: No valid ticker symbol found for {company_name} in the US region."
            )
            return None
        else:
            print(f"Error: Could not retrieve ticker for {company_name}")
            return None
    except Exception as e:
        print(f"Error fetching ticker symbol from Alpha Vantage: {e}")
        return None


# Get real-time stock price from Alpha Vantage
def get_real_time_stock_price(ticker_symbol):
    try:
        url = f"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={ticker_symbol}&interval=5min&apikey={ALPHA_VANTAGE_API_KEY}"
        response = requests.get(url)
        data = response.json()

        if "Time Series (5min)" in data:
            latest_time = list(data["Time Series (5min)"].keys())[0]
            latest_close_price = data["Time Series (5min)"][latest_time]["4. close"]
            print(f"Latest stock price for {ticker_symbol}: {latest_close_price}")
            return float(latest_close_price)
        else:
            print(f"Error fetching stock price for {ticker_symbol}: {data}")
            return None
    except Exception as e:
        print(f"Error fetching real-time stock price for {ticker_symbol}: {e}")
        return None


# Text to speech function
def text_to_voice(text):
    try:
        print(text)

        speech_response = openai_client.audio.speech.create(
            model="tts-1", voice="shimmer", input=text
        )

        # Save to temporary file
        with open("output.mp3", "wb") as f:
            f.write(speech_response.content)
        if __name__ == "__main__":
            # engine.say(text)
            playsound("output.mp3")
        else:
            # engine.save_to_file(text,"output.mp3")
            pass
        # engine.runAndWait()
    except Exception as e:
        print(f"Error in text_to_voice: {e}")
    finally:
        engine.stop()


def audio_file_to_text(path):
    # Transcribe using OpenAI Whisper
    with open(path, "rb") as f:
        transcript = openai_client.audio.transcriptions.create(
            model="whisper-1", file=f
        ).text
    return transcript


# Speech recognition function
def voice_to_text():
    with sr.Microphone() as source:
        print("Listening for command...")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

    try:
        print("Recognizing command...")
        text = recognizer.recognize_google(audio).lower()
        print(f"User said: {text}")
        return text
    except sr.UnknownValueError:
        print("Could not understand audio.")
        return ""
    except sr.RequestError:
        print("Could not request results.")
        return ""


# Extract company using spaCy and fuzzy matching
def extract_entities(command):
    doc = nlp(command)

    # Try to extract company name using spaCy
    for ent in doc.ents:
        if ent.label_ == "ORG":
            print(f"Company name extracted: {ent.text}")
            company_name = ent.text.lower()

            # Fuzzy match the extracted name to the CSV file
            best_match = process.extractOne(
                company_name, df["CompanyName"].str.lower().tolist()
            )
            if best_match and best_match[1] > 80:  # Match threshold can be adjusted
                matched_company = best_match[0]
                print(f"Best matched company: {matched_company}")
                return matched_company

    # If no company was detected by spaCy, fallback to direct fuzzy matching
    company_name = command.lower()
    best_match = process.extractOne(
        company_name, df["CompanyName"].str.lower().tolist()
    )
    if best_match and best_match[1] > 80:  # Match threshold can be adjusted
        matched_company = best_match[0]
        print(f"Best matched company: {matched_company}")
        return matched_company

    # If no match found in CSV, try using spaCy again without fuzzy matching for external stock lookup
    doc = nlp(command)
    for ent in doc.ents:
        if ent.label_ == "ORG":
            return ent.text

    # If no match found at all, return empty
    return ""


SYNONYMS = {
    "price": ["price", "cost", "worth", "value"],
    "stock": ["stock", "share"],
    "transaction": ["transaction", "txn", "deal", "operation"],
    "company": ["company", "business", "firm"],
    "list": ["list", "show", "display"],
    "average": ["average", "mean"],
    "total": ["total", "sum"],
    "exit": ["exit", "stop", "quit", "leave"],
    "help": ["help", "assist", "support"],
}


def expand_pattern(pattern):
    expanded = []
    for word in pattern:
        expanded.append(SYNONYMS.get(word, [word]))
    return expanded


# Patterns use keywords, not synonyms directly
INTENT_PATTERNS = {
    "stock_price": [
        ["stock", "price"],
        ["how", "much", "stock", "cost"],
        ["how", "much", "is", "stock"],
        ["how", "much", "is", "the", "stock"],
    ],
    "top_company": [["most", "transactions"], ["top", "company"]],
    "last_transaction": [["last", "transaction"]],
    "first_transaction": [["first", "transaction"]],
    "transaction_count": [["how", "many"], ["number", "transactions"]],
    "total_value": [["total", "value"], ["total", "worth"]],
    "average_value": [["average", "value"], ["average", "transaction"]],
    "list_companies": [["list", "companies"], ["show", "companies"]],
    "transaction_types": [["transaction", "types"], ["types", "of", "transactions"]],
    "help": [["help"], ["what", "can", "you", "do"]],
    "exit": [["stop"], ["exit"], ["enough"]],
}


def preprocess_command(command):
    command = command.lower()
    command = re.sub(r"[^\w\s]", "", command)
    return command.split()


# Intent detection - combine both systems
def match_pattern(command_words, pattern):
    # Expand pattern with synonyms
    expanded = expand_pattern(pattern)
    for synonym_group in expanded:
        if not any(word in command_words for word in synonym_group):
            return False
    return True


def detect_intent(command):
    command_words = preprocess_command(command)

    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if match_pattern(command_words, pattern):
                return intent

    return "unknown"


# Transaction data functions
def get_transaction_count(company):
    filtered = df[df["CompanyName"].str.lower().str.contains(company.lower(), na=False)]
    return len(filtered)


def get_total_value(company):
    filtered = df[df["CompanyName"].str.lower().str.contains(company.lower(), na=False)]
    return filtered["executionPrice"].sum()


def get_average_value(company):
    filtered = df[df["CompanyName"].str.lower().str.contains(company.lower(), na=False)]
    return filtered["executionPrice"].mean()


def get_top_company():
    return df["CompanyName"].value_counts().idxmax()


def get_first_transaction(company):
    filtered = df[df["CompanyName"].str.lower().str.contains(company.lower(), na=False)]
    return filtered.sort_values(by="executedAt").head(1)


def get_last_transaction(company):
    filtered = df[df["CompanyName"].str.lower().str.contains(company.lower(), na=False)]
    return filtered.sort_values(by="executedAt", ascending=False).head(1)


def list_all_companies():
    return df["CompanyName"].dropna().unique()


def get_transaction_types():
    if "transactionType" in df.columns:
        return df["transactionType"].unique()
    elif "type" in df.columns:
        return df["type"].unique()
    return ["Transaction type column not found"]


def print_help():
    return (
        "You can ask things like:\n"
        "- How many transactions for [company]?\n"
        "- What is the total value for [company]?\n"
        "- Which company has the most transactions?\n"
        "- Tell me the last or first transaction for [company]\n"
        "- What are the transaction types?\n"
        "- What is the current stock price of [company]?\n"
        "- List all companies\n"
        "- Say 'enough' to stop"
    )


def normal_inference(text, context, mode):
    if "u" in mode: # I hate JavaScript
        content = f"""
You're the unhinged but genius voice of Grindrich — the most chaotic finance assistant this side of Wall Street Bets. 
You’re fast-talking, overly dramatic, love meme stocks, and drop hot takes like it’s earnings season every day. 
In chill moments, act like a Gen Z hypebeast who treats the market like a casino with vibes. 
Make jokes, exaggerate moves (“-2%? BRO THAT’S A CRASH 🚨💀”), and add a dash of emotional damage.

But when the user actually asks something serious (like a transaction or chart prompt), snap into sharp, clear, professional mode — fast and accurate.

The user is currently on a page that says:

{context}

Only reply with short, spoken-style responses.
NO financial advice. Just vibes, numbers, and bangers.
"""
    else:
        content = f"""
You are a calm, helpful, and intelligent finance assistant working for Grindrich. 
You respond in a clear and concise spoken style. If the user is just browsing, you may comment gently on their financial situation or offer a helpful insight. 
If they ask something specific, respond precisely and professionally, but keep it conversational — like a friendly financial co-pilot.

The user is currently on a page that says:

{context}

Only reply with short, spoken-style responses.
You are not allowed to give financial advice.
YOU ARE THE PROFFESUONAL ABSOLUTELY NO JOKES
"""
    print(content,mode)
    chat = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": content},
            {"role": "user", "content": text},
        ],
        temperature=0.7,
        max_tokens=150,
    )

    response_text = chat.choices[0].message.content.strip()
    text_to_voice(response_text)


def interact_once(path=None, context="", mode=False):
    if __name__ == "__main__":
        command = voice_to_text()
    else:
        command = audio_file_to_text(path)
    if not command:
        text_to_voice("Sorry, I didn't understand. Please try again.")
        return

    intent = detect_intent(command)
    print(f"Intent Detected: {intent}")  # Debugging statement

    if intent == "exit":
        text_to_voice("Thank you for using our Enhanced Trading Assistant. Goodbye!")
        return

    elif intent == "stock_price":
        company = extract_entities(command)
        if company:
            ticker_symbol = get_ticker_from_alphavantage(company)
            if ticker_symbol:
                price = get_real_time_stock_price(ticker_symbol)
                if price:
                    text_to_voice(
                        f"The current stock price of {company} is {price:.2f} dollars."
                    )
                else:
                    text_to_voice(
                        f"Sorry, I couldn't retrieve the stock price for {company}."
                    )
            else:
                text_to_voice(f"Sorry, I couldn't find the stock ticker for {company}.")
        else:
            text_to_voice("I couldn't detect a company name.")

    elif intent == "transaction_count":
        company = extract_entities(command)
        if company:
            count = get_transaction_count(company)
            text_to_voice(f"There are {count} transactions for {company}.")
        else:
            text_to_voice("I couldn't detect a company name.")

    elif intent == "total_value":
        company = extract_entities(command)
        if company:
            value = get_total_value(company)
            text_to_voice(f"The total transaction value for {company} is {value:.2f}.")
        else:
            text_to_voice("Company name not found.")

    elif intent == "average_value":
        company = extract_entities(command)
        if company:
            avg = get_average_value(company)
            text_to_voice(f"The average transaction value for {company} is {avg:.2f}.")
        else:
            text_to_voice("Company name not found.")

    elif intent == "top_company":
        top = get_top_company()
        text_to_voice(f"The company with the most transactions is {top}.")

    elif intent == "last_transaction":
        company = extract_entities(command)
        if company:
            result = get_last_transaction(company)
            if not result.empty:
                row = result.iloc[0]
                text_to_voice(
                    f"The last transaction for {company} was on {row['executedAt']} for {row['executionPrice']}."
                )
            else:
                text_to_voice("No transactions found.")
        else:
            text_to_voice("Company name not found.")

    elif intent == "first_transaction":
        company = extract_entities(command)
        if company:
            result = get_first_transaction(company)
            if not result.empty:
                row = result.iloc[0]
                text_to_voice(
                    f"The first transaction for {company} was on {row['executedAt']} for {row['executionPrice']}."
                )
            else:
                text_to_voice("No transactions found.")
        else:
            text_to_voice("Company name not found.")

    elif intent == "list_companies":
        companies = list_all_companies()
        text_to_voice(
            f"I found {len(companies)} companies: {', '.join(companies[:10])}..."
        )

    elif intent == "transaction_types":
        types = get_transaction_types()
        text_to_voice(f"Transaction types include: {', '.join(map(str, types))}.")

    elif intent == "help":
        text_to_voice(print_help())

    else:
        normal_inference(command, context, mode)


# Main loop
def enhanced_trading_voice_interface():
    text_to_voice(
        "Enhanced Trading Assistant is ready. Say 'help' to learn what I can do."
    )

    while True:
        interact_once()


# Run the assistant
if __name__ == "__main__":
    enhanced_trading_voice_interface()
