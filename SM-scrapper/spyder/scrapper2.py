import requests
import csv
import time
from datetime import datetime
import os
import json

# API details
root = "https://ensembledata.com/apis"
endpoint = "/reddit/subreddit/posts"

# Updated write_to_csv function
def write_to_csv(data, csv_file):
    try:
        with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=[
                "isNSFW", "isMedia", "title", "author", "authorIsBlocked", "upvoteRatio",
                "viewCount", "goldCount", "isSponsored", "isSpoiler", "sendReplies",
                "numComments", "score", "permalink", "text"
            ])
            writer.writeheader()  # Add header only once

            # Extract the first post ID
            post_ids = data.get("data", {}).get("postIds", [])
            if not post_ids:
                print("No post IDs found in the data.")
                return False  # No data to write

            first_post_id = post_ids[0]  # First post ID

            # Navigate to the post details
            posts = data.get("data", {}).get("posts", {})
            post_details = posts.get(first_post_id, {})

            # Collect top-level post attributes
            post_attributes = {
                "isNSFW": post_details.get("isNSFW", False),
                "isMedia": post_details.get("isMediaOnly", False),
                "title": post_details.get("title", ""),
                "author": post_details.get("author", ""),
                "authorIsBlocked": post_details.get("authorIsBlocked", False),
                "upvoteRatio": post_details.get("upvoteRatio", 0.0),
                "viewCount": post_details.get("viewCount", 0),
                "goldCount": post_details.get("goldCount", 0),
                "isSponsored": post_details.get("isSponsored", False),
                "isSpoiler": post_details.get("isSpoiler", False),
                "sendReplies": post_details.get("sendReplies", True),
                "numComments": post_details.get("numComments", 0),
                "score": post_details.get("score", 0),
                "permalink": post_details.get("permalink", "")
            }

            # Traverse to richtextContent -> document -> c -> t
            media = post_details.get("media", {})
            richtext_content = media.get("richtextContent", {}).get("document", [])

            for document in richtext_content:
                for content in document.get("c", []):
                    if content.get("e") == "text":  # Look for text elements
                        text_content = content.get("t", "")
                        row = {**post_attributes, "text": text_content}
                        writer.writerow(row)

        return True  # Data successfully written to CSV

    except Exception as e:
        print(f"Error writing to CSV: {e}")
        return False  # Error occurred during the process


# CSV file header
csv_file = r'C:\Users\hp\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data\subreddit_posts.csv'
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow([
        "ID", "Title", "Author", "Created UTC", "Upvotes", "Comments Count", 
        "View Count", "Is NSFW", "Is Media Only", "Permalink", 
        "Author Is Blocked", "Upvote Ratio", "Gold Count", 
        "Is Sponsored", "Is Spoiler", "Send Replies", "RichText Content"
    ])

# Get subreddit name and refresh interval from the user
subreddit_name = input("Enter the subreddit name: ").strip()
refresh_interval = int(input("Enter refresh interval in seconds (default is 60): ") or 60)

# Directory to save raw JSON data
json_save_directory = r'C:\Users\hp\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data'

if not os.path.exists(json_save_directory):
    os.makedirs(json_save_directory)

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

            # Save raw JSON data
            today_date = datetime.now().strftime("%Y-%m-%d")
            json_file_path = os.path.join(json_save_directory, f"{subreddit_name}_{today_date}.json")
            with open(json_file_path, mode='w', encoding='utf-8') as json_file:
                json.dump(data, json_file, indent=4)
            print(f"DEBUG: Raw JSON data saved to {json_file_path}")

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
