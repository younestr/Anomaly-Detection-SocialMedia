from flask import Flask, jsonify
from twt_scrapper import fetch_tweets

app = Flask(__name__)

@app.route('/api/fetch_tweets/<int:user_id>', methods=['GET'])
def get_tweets(user_id):
    # Fetch tweets using the function from twtscrapper.py
    tweets = fetch_tweets(user_id)
    return jsonify({"tweets": tweets})

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change port to 5001
