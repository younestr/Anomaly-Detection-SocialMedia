import json
import csv
import os

# File paths
input_json_path = r"C:\Users\hp\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data\jsontest.json"
output_csv_dir = r"C:\Users\hp\Downloads\Anomaly-Detection-SocialMedia\SM-scrapper\data"
output_csv_path = os.path.join(output_csv_dir, "extracted_data.csv")

# Load your JSON file
with open(input_json_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Extract the first post ID
post_ids = data.get("data", {}).get("postIds", [])
if not post_ids:
    print("No post IDs found in the data.")
    exit()

first_post_id = post_ids[0]  # First post ID

# Navigate to the post details
posts = data.get("data", {}).get("posts", {})
post_details = posts.get(first_post_id, {})

# Initialize a list to store extracted data
extracted_data = []

# Collect top-level post attributes
post_attributes = {
    "isNSFW": post_details.get("isNSFW", False),
    "isMedia": post_details.get("isMediaOnly", False),
    "title": post_details.get("title", ""),
    "author": post_details.get("author", ""),
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
csv_columns = ["isNSFW", "isMedia", "title", "author", "numComments", "score", "permalink", "text"]

try:
    with open(output_csv_path, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=csv_columns)
        writer.writeheader()
        writer.writerows(extracted_data)
    print(f"Data successfully written to {output_csv_path}")
except Exception as e:
    print(f"An error occurred while writing to CSV: {e}")
