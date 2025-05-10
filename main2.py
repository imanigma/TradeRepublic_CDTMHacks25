import os
import speech_recognition as sr
import pyttsx3
import pandas as pd
import spacy

# Configuration
CSV_FILE = r"C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data_with_company.csv"
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Load data
df = pd.read_csv(CSV_FILE)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")


def normalize_command(command):
    return command.lower().strip()


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
        print("Sorry, I didn't understand that request.")
        return ""
    except sr.RequestError:
        print("Sorry, there was an issue with the speech recognition service.")
        return ""


def extract_entities(command):
    doc = nlp(command)
    for ent in doc.ents:
        if ent.label_ == "ORG":
            print(f"Company name extracted: {ent.text}")
            return ent.text
    print("Company not found in command.")
    return ""


def detect_intent(command):
    if "most transactions" in command or "top company" in command:
        return "top_company"
    elif "last transaction" in command:
        return "last_transaction"
    elif "how many" in command or "number of transactions" in command:
        return "transaction_count"
    elif "total value" in command or "worth" in command:
        return "total_value"
    else:
        return "unknown"


def get_transaction_count(company_name):
    company_name = company_name.lower()
    filtered_df = df[df['CompanyName'].str.lower().str.contains(company_name, na=False)]
    transaction_count = filtered_df.shape[0]
    total_value = filtered_df['executionPrice'].sum()
    return transaction_count, total_value


def get_last_transaction(company_name):
    filtered = df[df['CompanyName'].str.lower().str.contains(company_name.lower(), na=False)]
    if not filtered.empty:
        last = filtered.sort_values(by='executionTime', ascending=False).iloc[0]
        return last['executionPrice'], last['executionTime']
    return None, None


def get_top_company():
    top_company = df['CompanyName'].value_counts().idxmax()
    count = df['CompanyName'].value_counts().max()
    return top_company, count


def text_to_voice(text):
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in voice generation: {e}")


def trading_voice_interface():
    while True:
        command = voice_to_text()
        if not command:
            text_to_voice("Sorry, I didn't understand your request. Please try again.")
            continue

        if "enough" in command or "stop" in command or "exit" or "exit" in command:
            text_to_voice("Okay, stopping now. Goodbye!")
            break

        intent = detect_intent(command)
        company_name = extract_entities(command)

        if intent == "top_company":
            top_company, count = get_top_company()
            response = f"The company with the most transactions is {top_company} with {count} transactions."
        elif intent == "last_transaction" and company_name:
            price, time = get_last_transaction(company_name)
            if price and time:
                response = f"The last transaction for {company_name} was at {time} for {price}."
            else:
                response = f"No transactions found for {company_name}."
        elif intent == "transaction_count" and company_name:
            count, total = get_transaction_count(company_name)
            response = f"There are {count} transactions for {company_name} with a total value of {total}." if count else f"No transactions found for {company_name}."
        elif intent == "total_value" and company_name:
            _, total = get_transaction_count(company_name)
            response = f"The total transaction value for {company_name} is {total}." if total else f"No transactions found for {company_name}."
        else:
            response = "Sorry, I couldn't understand the request."

        print(response)
        text_to_voice(response)



if __name__ == "__main__":
    trading_voice_interface()

