import requests

# Define the API endpoint
url = "http://127.0.0.1:5000/predict"

# Define the input data
data = {
    "tweets": [
        "I love this product! It's amazing! #BestProductEver",
        "Horrible customer service, never again #Disappointed",
        "This is a neutral statement with no offense."
    ]
}

# Send a POST request to the API
response = requests.post(url, json=data)

# Print the response
if response.status_code == 200:
    print("API Response:")
    print(response.json())
else:
    print(f"Error: {response.status_code}, {response.text}")
