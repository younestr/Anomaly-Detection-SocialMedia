# Anomaly Detection in Social Media

## Overview
Anomaly detection in social media is essential for identifying cyberbullying, hate speech, misinformation, spam, and other malicious behaviors. This project uses user behavior characteristics, including textual content and interactive behaviors, to detect anomalies accurately and efficiently.

---

## Anomaly Detection Architecture
![Anomaly Detection Architecture](Anom_SM_UserBehavior.webp)

---

## Textual Feature Extraction
This section focuses on analyzing user-generated text to identify anomalous social behaviors. Techniques such as NLP, data mining, and dimensionality reduction aid in extracting and analyzing content features.

### Purpose
Detect anomalies related to:
- **Cyberbullying**
- **Hate Speech**
- **Misinformation**
- **Spam**

### Methods
- **Natural Language Processing (NLP)**
- **Data Mining**
- **Dimensionality Reduction**

### Key Studies and Approaches
- **Hao et al.**
  - Defined four abnormal behaviors: aggression, injury, arrest, and fatality.
  - Methods: Support Vector Machine (SVM) and trigger words for identifying anomalous sentences.
  - Used a behavioral co-construction network to detect anomalies in online opinion data.

- **Mu et al.**
  - Built an attention self-encoder with multi-head attention to handle missing data and capture text distributions for enhanced anomaly detection.

- **Al et al.**
  - Used Latent Dirichlet Allocation (LDA) to extract features from user content.
  - Developed a large-scale platform for malicious activity detection.

- **Qasim et al.**
  - Integrated features from content, social graph, and profile activity to analyze anomalies across large networks.

- **Drif et al.**
  - Used entity similarity calculation to reduce false positives in anomaly detection.

### Challenges
- **Data Limitations**: Limited datasets can restrict feature extraction capabilities.
- **Language and Cultural Nuance**: Difficulties in capturing complex language and cultural variations.
- **Privacy vs. Detection**: Balancing user privacy with effective anomaly detection.

### Advanced Techniques
- **Word Embeddings & Neural Networks**: Improved feature extraction through deep learning methods, enabling detection of subtle anomalies in text data.

---

## Feature Selection Based on Interactive Behaviors
This approach involves analyzing user interaction behaviors on social networks to identify unusual activities. It looks at variables such as post frequency, likes, comments, and discussion topics.

### Focus
Identify key features based on interactive behaviors that correlate with unusual user activity.

### Methods
- **Clustering Techniques**: Group users based on interaction features.
- **Combined Clustering and Classification**: Detect anomalous patterns in behavior.

### Key Studies and Approaches
- **Aljably et al.**
  - Identified behaviors like post frequency, timing, likes, comments, and topic diversity as anomaly indicators.
  - Used clustering to group users and trained models based on these groups.

- **Persia et al.**
  - Developed an advanced event detection framework using modified Interactive Structured Query Language (ISQL).
  - Applied Local Differential Privacy (LDP) for data protection.
  - Used sequential pattern mining to detect frequent behaviors and predict trends.

### Advantages and Challenges
- **Advantages**: 
  - In-depth behavior analysis enhances accuracy and reliability in detecting minor changes.
- **Challenges**:
  - High data demands, sensitivity to noisy data, and heavy computational needs.
  - Privacy issues due to extensive user interaction data collection.

---

## Performance Evaluation Metrics
To evaluate the effectiveness of anomaly detection models, various metrics are used, including:

- **Primary Metrics**:
  - **Accuracy (ACC)**: Overall classification accuracy.
  - **Recall**: Ability to capture true positives.
  - **Precision**: Accuracy of positive predictions.
  - **F1-score**: Balances Precision and Recall, ideal for imbalanced datasets.

- **Additional Metrics**:
  - **APs, FPs, Precision-Recall (PR) Curves, ROC Curves, AUC Curves**, etc., offer further insights into model usability and reliability.

---


