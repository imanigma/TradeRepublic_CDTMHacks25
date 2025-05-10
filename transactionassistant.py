import os
import speech_recognition as sr
import pyttsx3
import pandas as pd
import spacy
from fuzzywuzzy import process

# Configuration
CSV_FILE = r"C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data_with_company.csv"
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Load data and model
df = pd.read_csv(CSV_FILE)
nlp = spacy.load("en_core_web_sm")


# Speak
def text_to_voice(text):
    try:
        print(text)
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in text_to_voice: {e}")
    finally:
        engine.stop()


# Listen
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

    # If no match found, return empty
    return ""


# Intent detection
def detect_intent(command):
    command = command.lower()
    print(f"Command: {command}")  # Debugging statement to print the command

    # Specific Intent checks first
    if "most transactions" in command or "top company" in command:
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

    # Exit related intents checked last
    elif "stop" in command or "exit" in command or "enough" in command:
        return "exit"

    else:
        return "unknown"


# Functionalities
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
    if 'type' in df.columns:
        return df['type'].unique()
    return ["type column not found"]


def print_help():
    return (
        "You can ask things like:\n"
        "- How many transactions for [company]?\n"
        "- What is the total value for [company]?\n"
        "- Which company has the most transactions?\n"
        "- Tell me the last or first transaction for [company]\n"
        "- What are the transaction types?\n"
        "- List all companies\n"
        "- Say 'enough' to stop"
    )


# Main loop
def trading_voice_interface():
    while True:
        command = voice_to_text()
        if not command:
            text_to_voice("Sorry, I didn't understand. Please try again.")
            continue

        intent = detect_intent(command)
        print(f"Intent Detected: {intent}")  # Debugging statement to print the detected intent

        if intent == "exit":
            text_to_voice("Thank you for using our service. Goodbye!")
            break

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
                    text_to_voice(f"The last transaction for {company} was on {row['executionDate']} for {row['executionPrice']}.")
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
                    text_to_voice(f"The first transaction for {company} was on {row['executionDate']} for {row['executionPrice']}.")
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
    trading_voice_interface()
