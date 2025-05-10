import os
import requests
import speech_recognition as sr
import pyttsx3
import pandas as pd
import spacy
from fuzzywuzzy import process

# Configuration
CSV_FILE = r"C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data_with_company.csv"
ALPHA_VANTAGE_API_KEY = "3MI0AOC4HKBQEG57"
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Load data and model
df = pd.read_csv(CSV_FILE)
nlp = spacy.load("en_core_web_sm")


# Function to search for ticker symbol using Alpha Vantage's SYMBOL_SEARCH API
def get_ticker_from_alphavantage(company_name):
    try:
        url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={company_name}&apikey={ALPHA_VANTAGE_API_KEY}'
        response = requests.get(url)
        data = response.json()

        # Log the full response for debugging
        print(f"Full response for {company_name}: {data}")

        if "bestMatches" in data:
            # Iterate through the best matches to find the correct symbol
            for match in data["bestMatches"]:
                ticker = match.get('1. symbol')
                company = match.get('2. name')
                exchange = match.get('4. region', '').lower()

                # Check if the region is the US and select the first US match
                if 'united states' in exchange:
                    print(f"Ticker symbol found: {ticker} for company: {company} on exchange: {exchange}")
                    return ticker

            # If no valid ticker is found in the US region, log and return None
            print(f"Error: No valid ticker symbol found for {company_name} in the US region.")
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
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={ticker_symbol}&interval=5min&apikey={ALPHA_VANTAGE_API_KEY}'
        response = requests.get(url)
        data = response.json()

        if 'Time Series (5min)' in data:
            latest_time = list(data['Time Series (5min)'].keys())[0]
            latest_close_price = data['Time Series (5min)'][latest_time]['4. close']
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
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in text_to_voice: {e}")
    finally:
        engine.stop()


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
            best_match = process.extractOne(company_name, df['CompanyName'].str.lower().tolist())
            if best_match and best_match[1] > 80:  # Match threshold can be adjusted
                matched_company = best_match[0]
                print(f"Best matched company: {matched_company}")
                return matched_company

    # If no company was detected by spaCy, fallback to direct fuzzy matching
    company_name = command.lower()
    best_match = process.extractOne(company_name, df['CompanyName'].str.lower().tolist())
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


# Intent detection - combine both systems
def detect_intent(command):
    command = command.lower().strip()
    print(f"Command: {command}")  # Debugging statement

    # Stock price intent (from gpt.py)
    if "stock price" in command or "current price" in command:
        return "stock_price"

    # Specific Intent checks (from transactionassistant.py)
    elif "most transactions" in command or "top company" in command:
        return "top_company"
    elif "last transaction" in command:
        return "last_transaction"
    elif "first transaction" in command:
        return "first_transaction"
    elif "how many" in command or "number of transactions" in command:
        return "transaction_count"
    elif "total value" in command or "worth" in command:
        return "total_value"
    elif "average value" in command or "average transaction" in command:
        return "average_value"
    elif "list" in command or "list companies" in command or "show companies" in command:
        return "list_companies"
    elif "transaction types" in command or "types of transactions" in command:
        return "transaction_types"
    elif "help" in command or "what can you do" in command:
        return "help"
    # Exit related intents
    elif "stop" in command or "exit" in command or "enough" in command:
        return "exit"
    else:
        return "unknown"


# Transaction data functions
def get_transaction_count(company):
    filtered = df[df['CompanyName'].str.lower().str.contains(company.lower(), na=False)]
    return len(filtered)


def get_total_value(company):
    filtered = df[df['CompanyName'].str.lower().str.contains(company.lower(), na=False)]
    return filtered['executionPrice'].sum()


def get_average_value(company):
    filtered = df[df['CompanyName'].str.lower().str.contains(company.lower(), na=False)]
    return filtered['executionPrice'].mean()


def get_top_company():
    return df['CompanyName'].value_counts().idxmax()


def get_first_transaction(company):
    filtered = df[df['CompanyName'].str.lower().str.contains(company.lower(), na=False)]
    return filtered.sort_values(by='executionDate').head(1)


def get_last_transaction(company):
    filtered = df[df['CompanyName'].str.lower().str.contains(company.lower(), na=False)]
    return filtered.sort_values(by='executionDate', ascending=False).head(1)


def list_all_companies():
    return df['CompanyName'].dropna().unique()


def get_transaction_types():
    if 'transactionType' in df.columns:
        return df['transactionType'].unique()
    elif 'type' in df.columns:
        return df['type'].unique()
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


# Main loop
def enhanced_trading_voice_interface():
    text_to_voice("Enhanced Trading Assistant is ready. Say 'help' to learn what I can do.")

    while True:
        command = voice_to_text()
        if not command:
            text_to_voice("Sorry, I didn't understand. Please try again.")
            continue

        intent = detect_intent(command)
        print(f"Intent Detected: {intent}")  # Debugging statement

        if intent == "exit":
            text_to_voice("Thank you for using our Enhanced Trading Assistant. Goodbye!")
            break

        elif intent == "stock_price":
            company = extract_entities(command)
            if company:
                ticker_symbol = get_ticker_from_alphavantage(company)
                if ticker_symbol:
                    price = get_real_time_stock_price(ticker_symbol)
                    if price:
                        text_to_voice(f"The current stock price of {company} is {price:.2f} dollars.")
                    else:
                        text_to_voice(f"Sorry, I couldn't retrieve the stock price for {company}.")
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
                        f"The last transaction for {company} was on {row['executionDate']} for {row['executionPrice']}.")
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
                        f"The first transaction for {company} was on {row['executionDate']} for {row['executionPrice']}.")
                else:
                    text_to_voice("No transactions found.")
            else:
                text_to_voice("Company name not found.")

        elif intent == "list_companies":
            companies = list_all_companies()
            text_to_voice(f"I found {len(companies)} companies: {', '.join(companies[:10])}...")

        elif intent == "transaction_types":
            types = get_transaction_types()
            text_to_voice(f"Transaction types include: {', '.join(map(str, types))}.")

        elif intent == "help":
            text_to_voice(print_help())

        else:
            text_to_voice("Sorry, I'm not sure how to help with that. Say 'help' to hear what I can do.")


# Run the assistant
if __name__ == "__main__":
    enhanced_trading_voice_interface()