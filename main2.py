import os
import speech_recognition as sr
import pyttsx3
import pandas as pd
import json
import re

# Configuration: Set up the file and TTS engine
CSV_FILE = r"C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data_with_company.csv"
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Load the CSV data into a pandas DataFrame
df = pd.read_csv(CSV_FILE)


# Normalize command input (helpful for abbreviations or variations)
def normalize_command(command):
    command = command.lower().strip()
    return command


# Listen to voice command and recognize it
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


# Process the command to extract relevant data (company name and query type)
def process_command(command):
    command = normalize_command(command)

    # Updated regex to capture only company name (ignores 'transactions' or 'transaction')
    match = re.search(r"how many ([\w\s]+?)(?: transactions?)?$", command)
    matchend = re.search(r"enough", command)  # Ensure this only matches "enough"

    if match:
        company_name = match.group(1).strip()
        print(f"Company name extracted: {company_name}")
        return company_name
    elif matchend:
        print("Thank you for using our service!")
        return -1
    else:
        print("Company not found in command.")
        return ""




# Get the count of transactions for a specific company
def get_transaction_count(company_name):
    company_name = company_name.lower()
    filtered_df = df[df['CompanyName'].str.lower().str.contains(company_name, na=False)]
    transaction_count = filtered_df.shape[0]
    return transaction_count


# Convert the text to speech and respond
def text_to_voice(text):
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in voice generation: {e}")


# Main function to run the program
def trading_voice_interface():
    while True:
        command = voice_to_text()
        if command:
            company_name = process_command(command)
            if company_name == -1:
                text_to_voice("Thank you for using our service!")
                break  # Exit the loop if the user says "enough"
            elif company_name:
                transaction_count = get_transaction_count(company_name)
                if transaction_count > 0:
                    response = f"There are {transaction_count} transactions for {company_name}."
                else:
                    response = f"No transactions found for {company_name}."
                text_to_voice(response)
            else:
                text_to_voice("Sorry, I couldn't find a company in the command.")
        else:
            text_to_voice("Sorry, I didn't understand your request. Please try again.")



if __name__ == "__main__":
    trading_voice_interface()
