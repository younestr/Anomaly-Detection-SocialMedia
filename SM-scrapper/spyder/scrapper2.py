import requests
import csv
import time
from datetime import datetime
import os

# API details
root = "https://ensembledata.com/apis"
endpoint = "/reddit/subreddit/posts"


# Function to write data to CSV
def write_to_csv(data, csv_file):
    try:
        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            for post in data:
                # Check if the post is a dictionary
                if isinstance(post, dict):
                    try:
                        # Extract richtext content if available
                        richtext_content = ""
                        media = post.get("media", {})
                        if "richtextContent" in media:
                            document = media["richtextContent"].get("document", [])
                            for item in document:
                                if isinstance(item, dict) and "c" in item:
                                    for content in item.get("c", []):
                                        if isinstance(content, dict) and "t" in content:
                                            richtext_content += content["t"] + " "

                        # Write the post details to the CSV
                        writer.writerow([
                            post.get("id", ""),
                            post.get("title", ""),
                            post.get("author", ""),
                            post.get("created", ""),
                            post.get("score", ""),  # Upvotes
                            post.get("numComments", ""),  # Comments Count
                            post.get("viewCount", ""),  # View Count
                            post.get("isNSFW", ""),
                            post.get("isMediaOnly", ""),
                            post.get("permalink", ""),
                            richtext_content.strip()  # Extracted richtext content
                        ])
                    except Exception as post_error:
                        print(f"DEBUG: Error processing post {post.get('id', 'unknown')}: {post_error}")
                else:
                    print("DEBUG: Skipped invalid post data (not a dictionary).")
            print("DEBUG: All posts in the batch written to CSV successfully.")
            return True  # Data successfully written to CSV
    except Exception as e:
        print(f"DEBUG: Error writing to CSV: {e}")
        return False  # Error occurred during the process


# CSV file header
csv_file = r'C:\Users\xelor\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data\subreddit_posts.csv'
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(["ID", "Title", "Author", "Created UTC", "Upvotes", "Comments Count", "View Count", "Is NSFW", "Is Media Only", "Permalink", "RichText Content"])

# Get subreddit name and refresh interval from the user
subreddit_name = input("Enter the subreddit name: ").strip()
refresh_interval = int(input("Enter refresh interval in seconds (default is 60): ") or 60)

# Parameters for the API request
params = {
    "name": subreddit_name,       # Subreddit name entered by the user
    "sort": "new",                # Sort by 'new'
    "period": "hour",             # Data for the past hour
    "cursor": "",                 # Use this for pagination if needed
    "token": "DiVVgHqH56zTnJsJ"   # Your personal API token
}

print("Fetching data in real-time. Press Ctrl+C to stop.")

# Fetch data in a loop
try:
    while True:
        # Make the API request
        res = requests.get(root + endpoint, params=params)

        if res.status_code == 200:
            data = res.json()
            # Debug: Print the structure of the response data
            print(f"DEBUG: API Response Data: {data}")

            if "data" in data and isinstance(data["data"], list):  # Check if 'data' is a list
                print(f"[{datetime.now()}] Fetched {len(data['data'])} posts.")

                for post in data["data"]:
                    print(f"DEBUG: Post being processed: {post}")  # Debug each post

                success = write_to_csv(data["data"], csv_file)
                if success:
                    print(f"DEBUG: Data uploaded to CSV successfully.")
                else:
                    print(f"DEBUG: Failed to upload data to CSV.")
            else:
                print(f"[{datetime.now()}] No recent posts available or unexpected data structure.")
        elif res.status_code == 404:
            print(f"The subreddit '{subreddit_name}' does not exist or is unavailable.")
            break
        else:
            print(f"Error: {res.status_code}, {res.text}")
            break

        # Wait for the specified interval before fetching data again
        time.sleep(refresh_interval)

except KeyboardInterrupt:
    print("\nReal-time data collection stopped.")
