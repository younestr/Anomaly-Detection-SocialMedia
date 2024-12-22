from flask import Flask, request, jsonify
import joblib
import nltk
import numpy as np
import re
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.linear_model import LogisticRegression
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer as VS
from textstat.textstat import textstat

# Initialize Flask App
app = Flask(__name__)

# Load NLTK Data
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
stopwords = nltk.corpus.stopwords.words("english")
stopwords.extend(["#ff", "ff", "rt"])
stemmer = nltk.stem.PorterStemmer()

# Preprocessing and Custom Functions
def preprocess(text_string):
    space_pattern = '\s+'
    giant_url_regex = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    mention_regex = '@[\\w\\-]+'
    parsed_text = re.sub(space_pattern, ' ', text_string)
    parsed_text = re.sub(giant_url_regex, '', parsed_text)
    parsed_text = re.sub(mention_regex, '', parsed_text)
    return parsed_text

def tokenize(tweet):
    tweet = " ".join(re.split("[^a-zA-Z]*", tweet.lower())).strip()
    tokens = [stemmer.stem(t) for t in tweet.split()]
    return tokens

# Custom Vectorizers
class PosTfidfVectorizer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self._pos_vectorizer = TfidfVectorizer(
            tokenizer=None,
            lowercase=False,
            preprocessor=None,
            ngram_range=(1, 3),
            stop_words=None,
            use_idf=False,
            smooth_idf=False,
            norm=None,
            decode_error='replace',
            max_features=5000,
            min_df=5,
            max_df=0.75,
        )

    def _preprocess(self, X):
        tweet_tags = []
        for t in X:
            tokens = tokenize(preprocess(t))
            tags = nltk.pos_tag(tokens)
            tag_list = [x[1] for x in tags]
            tag_str = " ".join(tag_list)
            tweet_tags.append(tag_str)
        return tweet_tags

    def fit(self, X, y=None):
        tweet_tags = self._preprocess(X)
        self._pos_vectorizer.fit(tweet_tags)
        return self

    def transform(self, X, y=None):
        tweet_tags = self._preprocess(X)
        return self._pos_vectorizer.transform(tweet_tags)

sentiment_analyzer = VS()

def count_twitter_objs(text_string):
    space_pattern = '\s+'
    giant_url_regex = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    mention_regex = '@[\\w\\-]+'
    hashtag_regex = '#[\\w\\-]+'
    parsed_text = re.sub(space_pattern, ' ', text_string)
    parsed_text = re.sub(giant_url_regex, 'URLHERE', parsed_text)
    parsed_text = re.sub(mention_regex, 'MENTIONHERE', parsed_text)
    parsed_text = re.sub(hashtag_regex, 'HASHTAGHERE', parsed_text)
    return (parsed_text.count('URLHERE'), parsed_text.count('MENTIONHERE'), parsed_text.count('HASHTAGHERE'))

# Define the model pipeline
model = joblib.load(r'C:\Users\xelor\Downloads\Anomaly-Detection-SocialMedia\HateSpeech\model\multiclass_model.pkl')

# API Routes
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    tweet = data.get('tweet', '')
    if not tweet:
        return jsonify({'error': 'No tweet provided!'}), 400
    
    prediction = model.predict([tweet])[0]
    return jsonify({'tweet': tweet, 'prediction': int(prediction)})

# Run Flask App
if __name__ == '__main__':
    app.run(debug=True)
