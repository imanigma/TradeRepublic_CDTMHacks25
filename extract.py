import requests
import pandas as pd

# Define the OpenFIGI API URL
url = "https://api.openfigi.com/v3/mapping"

# Define the header with your OpenFIGI API key
headers = {
    'Content-Type': 'application/json',
    'X-OPENFIGI-APIKEY': '36e9a503-48a4-4815-971b-0e6370ba6e56'  # Replace with your actual OpenFIGI API key
}

# Function to get company name from ISIN using OpenFIGI API
def get_company_name_from_isin(isin):
    # Define the payload with the ISIN value
    payload = [
        {
            "idType": "ID_ISIN",
            "idValue": isin
        }
    ]
    
    try:
        # Make the POST request to the OpenFIGI API with an increased timeout
        response = requests.post(url, json=payload, headers=headers, timeout=30)  # Timeout set to 30 seconds
        response.raise_for_status()  # Raise an exception for HTTP error codes

        # Print the raw response for debugging
        print(f"API Response for ISIN {isin}: {response.text}")
        
        # Process the JSON response
        data = response.json()
        
        # Check if the response contains valid data and extract the company name
        if data and 'data' in data[0] and 'name' in data[0]['data'][0]:
            return data[0]['data'][0]['name']
        else:
            print(f"No company name found for ISIN: {isin}")
            return None

    except requests.exceptions.Timeout:
        print(f"Request timed out for ISIN: {isin}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed for ISIN: {isin}, error: {e}")
        return None


# Load your trading data (assuming it's saved in trading_sample_data.csv)
df = pd.read_csv(r'C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data.csv')

# Get the unique ISINs from the DataFrame
isin_list = df['ISIN'].unique()

# Create a dictionary to store ISIN to company name mapping
isin_to_company = {}

# Loop through ISINs and get the company name
for isin in isin_list:
    if isin not in isin_to_company:
        company_name = get_company_name_from_isin(isin)
        if company_name:  # Only store if the company name is found
            isin_to_company[isin] = company_name

# Map company names back to the original DataFrame
df['CompanyName'] = df['ISIN'].map(isin_to_company)

# Save the DataFrame to a CSV file
output_file = r'C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\trading_sample_data_with_company.csv'
df.to_csv(output_file, index=False)

# Show message to indicate the file is saved
print(f"Data with company names has been saved to: {output_file}")

# Optionally, group by Company Name to see how many times each company appears
grouped = df.groupby('CompanyName')['ISIN'].count().reset_index()

# Save the grouped data to another CSV file
grouped_file = r'C:\Users\ararm\Desktop\CDTM\voice-trading-bot\data\grouped_by_company.csv'
grouped.to_csv(grouped_file, index=False)

# Show message to indicate the grouped data is saved
print(f"Grouped data has been saved to: {grouped_file}")
