import requests

def fetch_tweets(user_id, token="DiVVgHqH56zTnJsJ"):
    """
    Fetch tweets for a specific Twitter user using the EnsembleData API.

    Args:
        user_id (int): The Twitter user ID.
        token (str): The API token for authentication.

    Returns:
        list: A list of tweets if successful, otherwise an empty list.
    """
    root = "https://ensembledata.com/apis"
    endpoint = "/twitter/user/tweets"
    params = {
        "id": user_id,
        "token": token
    }

    try:
        res = requests.get(root + endpoint, params=params)
        res.raise_for_status()  # Raise HTTPError for bad responses
        data = res.json()
        
        # Ensure the response contains tweets
        if isinstance(data, list):
            return [tweet.get("text", "") for tweet in data if "text" in tweet]
        else:
            print("Unexpected response structure:", data)
            return []
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return []
