import json
import csv
import os

# File paths
input_json_path = r"C:\Users\xelor\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data\trees_2024-12-21.json"
output_csv_dir = r"C:\Users\xelor\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data"
output_csv_path = os.path.join(output_csv_dir, "trees.csv")

# Load your JSON file
with open(input_json_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Extract the post IDs
post_ids = data.get("data", {}).get("postIds", [])
if not post_ids:
    print("No post IDs found in the data.")
    exit()

# Navigate to the posts
posts = data.get("data", {}).get("posts", {})

# Initialize a list to store extracted data
extracted_data = []

# Iterate over each post ID and extract data
for post_id in post_ids:
    post_details = posts.get(post_id, {})
    
    # Collect top-level post attributes
    post_attributes = {
        "postId": post_id,  # Add the post ID to the attributes
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
                extracted_data.append({**post_attributes, "text": text_content})

# Write the extracted data to a CSV file
csv_columns = [
    "postId", "isNSFW", "isMedia", "title", "author", "authorIsBlocked", "upvoteRatio",
    "viewCount", "goldCount", "isSponsored", "isSpoiler", "sendReplies",
    "numComments", "score", "permalink", "text"
]

try:
    with open(output_csv_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=csv_columns)
        writer.writeheader()
        writer.writerows(extracted_data)
    print(f"Data successfully written to {output_csv_path}")
except Exception as e:
    print(f"An error occurred while writing to CSV: {e}")
