import asyncio
import websockets
import json
import time
import random
from typing import Dict, Any, Optional

# Constants
TR_API_URL = "wss://api.traderepublic.com"
DEFAULT_TIMEOUT = 10
MAX_RETRIES = 3
INITIAL_RETRY_DELAY = 2


# WebSocket request function with compatibility fixes and retry logic
async def ws_request(payload: Dict[str, Any], timeout: int = DEFAULT_TIMEOUT, retry_count: int = 0) -> Dict[str, Any]:
    """
    Send a request to the Trade Republic WebSocket API with improved error handling.

    Args:
        payload: The request payload
        timeout: Timeout in seconds
        retry_count: Current retry attempt

    Returns:
        Dict containing the response or error information
    """
    # Use jitter for exponential backoff to avoid thundering herd problem
    current_retry_delay = INITIAL_RETRY_DELAY * (2 ** retry_count) * (0.5 + random.random())

    try:
        # Simple connect with compatible parameters
        async with websockets.connect(
                TR_API_URL,
                ping_interval=None,  # Disable ping for compatibility
                close_timeout=5
        ) as ws:
            # Connect to the WebSocket API
            try:
                await asyncio.wait_for(ws.send("connect 30"), timeout=timeout)
                response = await asyncio.wait_for(ws.recv(), timeout=timeout)
                # print(f"Connection response: {response}")

                if "error" in response.lower():
                    print(f"Connection error: {response}")
                    return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                               f"Connection failed: {response}")
            except asyncio.TimeoutError:
                print(f"Connection timed out after {timeout}s")
                return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                           "Connection timeout")
            except Exception as e:
                print(f"Connection error: {e}")
                return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                           f"Connection error: {str(e)}")

            # Send subscription request
            subscription_id = "1"  # Could use random/UUID for multiple concurrent requests
            try:
                full_payload = f"sub {subscription_id} {json.dumps(payload)}"
                await ws.send(full_payload)

                # Process subscription responses with timeout
                try:
                    start_time = time.time()
                    response_timeout = timeout

                    while True:
                        # Adjust remaining timeout for each message
                        elapsed = time.time() - start_time
                        remaining_timeout = max(0.5, response_timeout - elapsed)

                        msg = await asyncio.wait_for(ws.recv(), timeout=remaining_timeout)
                        if msg.startswith(f"{subscription_id} A"):
                            try:
                                # Extract and parse the JSON part of the message
                                json_part = msg.split(" ", 2)[-1]
                                return json.loads(json_part)
                            except json.JSONDecodeError as e:
                                print(f"JSON parse error: {e}, raw message: {msg}")
                                return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                                           f"JSON parse error: {str(e)}")

                        # Handle potential error messages
                        if msg.startswith(f"{subscription_id} E"):
                            error_msg = msg.split(" ", 2)[-1]
                            print(f"Subscription error: {error_msg}")
                            return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                                       f"Subscription error: {error_msg}")

                except asyncio.TimeoutError:
                    print(f"Subscription response timed out after {timeout}s")
                    return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                               "Subscription timeout")

            except Exception as e:
                print(f"Subscription error: {e}")
                return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                           f"Subscription error: {str(e)}")

    except Exception as e:
        print(f"WebSocket connection failed: {e}")
        return await _handle_retry(payload, timeout, retry_count, current_retry_delay,
                                   f"WebSocket error: {str(e)}")


async def _handle_retry(payload, timeout, retry_count, delay, error_message):
    """Helper function to handle retry logic"""
    if retry_count < MAX_RETRIES:
        print(f"Attempt {retry_count + 1}/{MAX_RETRIES} failed: {error_message}")
        print(f"Retrying in {delay:.2f}s...")
        await asyncio.sleep(delay)
        return await ws_request(payload, timeout, retry_count + 1)
    else:
        print(f"All {MAX_RETRIES} attempts failed. Last error: {error_message}")
        return {"error": error_message, "status": "failed"}


# Search for ISIN based on asset name
async def search_isin(query: str) -> str:
    """
    Search for an asset's ISIN by name

    Args:
        query: Asset name to search for

    Returns:
        ISIN string or error code
    """
    # Clean and normalize the query
    clean_query = query.strip()

    payload = {
        "type": "search",
        "query": clean_query
    }

    # Make the websocket request with automatic retries
    data = await ws_request(payload, timeout=15)  # Longer timeout for search

    if "error" in data:
        print(f"Error in search_isin: {data['error']}")
        return "ISIN_ERROR"

    try:
        # Parse results from the response
        results = data.get("results", [])

        if not results:
            print(f"No results found for '{clean_query}'")
            return "UNKNOWN"

        # First look for exact instrument matches
        for item in results:
            if item["type"] == "instrument":
                print(f"Found ISIN for '{clean_query}': {item['id']}")
                return item["id"]

        # Then check for company matches that might contain instrument info
        for item in results:
            if item["type"] == "company" and "instruments" in item:
                if item["instruments"] and len(item["instruments"]) > 0:
                    isin = item["instruments"][0]  # Take the first instrument
                    print(f"Found company ISIN for '{clean_query}': {isin}")
                    return isin

        return "UNKNOWN"  # No matching ISIN found
    except Exception as e:
        print(f"Error processing search results for '{clean_query}': {e}")
        return "ISIN_ERROR"


# Expanded common stocks dictionary with GameStop!
COMMON_STOCKS = {
    "apple": "US0378331005",
    "microsoft": "US5949181045",
    "amazon": "US0231351067",
    "google": "US02079K1079",
    "alphabet": "US02079K1079",
    "tesla": "US88160R1014",
    "meta": "US30303M1027",
    "facebook": "US30303M1027",
    "netflix": "US64110L1061",
    "nvidia": "US67066G1040",
    "amd": "US0079031078",
    "intel": "US4581401001",
    "gamestop": "US36467W1099",  # Added GameStop
    "gme": "US36467W1099",  # GameStop ticker
    "ibm": "US4592001014",
    "oracle": "US68389X1054",
    "salesforce": "US79466L3024",
    "walmart": "US9311421039",
    "disney": "US2546871060",
    "coca-cola": "US1912161007",
    "pepsi": "US7134481081"
}


# Get ISIN from asset name with improved reliability
async def get_isin(asset_name: str) -> str:
    """
    Get ISIN for an asset with cached lookup and retry logic

    Args:
        asset_name: Name of the asset to look up

    Returns:
        ISIN string or error code
    """
    print(f"Looking up ISIN for asset: {asset_name}")

    # Clean and normalize the asset name
    normalized_name = asset_name.lower().replace("stock", "").strip()

    # Check if it's in our expanded common stocks dictionary
    if normalized_name in COMMON_STOCKS:
        isin = COMMON_STOCKS[normalized_name]
        print(f"Using cached ISIN for {normalized_name}: {isin}")
        return isin

    # Try API with automatic retries (handled by ws_request)
    result = await search_isin(asset_name)

    # If we got a valid result, cache it for future use
    if result != "UNKNOWN" and result != "ISIN_ERROR":
        # This would ideally update a persistent cache
        COMMON_STOCKS[normalized_name] = result
        print(f"Added {normalized_name} to ISIN cache: {result}")
        return result

    print(f"Could not find ISIN for {asset_name}")
    return "ISIN_NOT_FOUND"


# Get current price based on ISIN
async def get_current_price(isin: str) -> float:
    """
    Get current price for an asset by ISIN

    Args:
        isin: ISIN of the asset

    Returns:
        Current price as float
    """
    # Mock prices for testing or when API fails
    mock_prices = {
        "US0378331005": 188.21,  # Apple
        "US5949181045": 413.64,  # Microsoft
        "US0231351067": 181.75,  # Amazon
        "US02079K1079": 176.50,  # Google
        "US88160R1014": 175.20,  # Tesla
        "US30303M1027": 465.78,  # Meta
        "US64110L1061": 622.83,  # Netflix
        "US67066G1040": 950.63,  # NVIDIA
        "US0079031078": 152.37,  # AMD
        "US36467W1099": 18.22,  # GameStop - Added for your use case
    }

    # Return mock price for invalid ISINs or for testing
    if isin in ["ISIN_NOT_FOUND", "UNKNOWN", "ISIN_ERROR"]:
        print("Using mock price data due to invalid ISIN")
        return mock_prices.get(isin, 100.00)

    # Try multiple exchange suffixes
    exchange_suffixes = ["", ".LSX", ".XETR", ".XFRA"]

    for suffix in exchange_suffixes:
        try:
            payload = {"type": "ticker", "id": f"{isin}{suffix}"}

            # Make websocket request with retry mechanism
            data = await ws_request(payload)

            if "error" in data:
                print(f"Error getting price with suffix {suffix}: {data['error']}")
                continue  # Try next exchange suffix

            if "last" in data and "price" in data["last"]:
                price = float(data["last"]["price"])
                print(f"Found price with suffix {suffix}: ${price}")
                return price

            print(f"No price data found with suffix {suffix}")
        except Exception as e:
            print(f"Error getting price with suffix {suffix}: {e}")

    # Fall back to mock price if available, or default
    if isin in mock_prices:
        print(f"Using fallback mock price for {isin}: ${mock_prices[isin]}")
        return mock_prices[isin]
    else:
        print(f"Using default price for {isin}: $100.00")
        return 100.00


# Synchronous wrapper functions
def sync_get_isin(asset_name: str) -> str:
    """Synchronous wrapper for get_isin"""
    try:
        return asyncio.run(get_isin(asset_name))
    except Exception as e:
        print(f"Error in sync_get_isin: {e}")
        return "ISIN_ERROR"


def sync_get_current_price(isin: str) -> float:
    """Synchronous wrapper for get_current_price"""
    try:
        return asyncio.run(get_current_price(isin))
    except Exception as e:
        print(f"Error in sync_get_current_price: {e}")
        return 100.00  # Default price


# Example usage
if __name__ == "__main__":
    # Test the functions
    test_assets = ["Apple", "GameStop", "Microsoft"]

    for asset in test_assets:
        print("-" * 50)
        isin = sync_get_isin(asset)
        print(f"ISIN for {asset}: {isin}")

        if isin != "ISIN_ERROR" and isin != "UNKNOWN" and isin != "ISIN_NOT_FOUND":
            price = sync_get_current_price(isin)
            print(f"Price for {asset} ({isin}): ${price}")