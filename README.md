# Anomaly Detection in Social Media

## Anomaly Detection Based on User Behavior Characteristics

![Anomaly Detection Architecture](Anom_SM_UserBehavior.webp)

### Textual Feature Extraction
- **Purpose**: Detect anomalies such as cyberbullying, hate speech, misinformation, and spam.
- **Methods**: 
   - Natural Language Processing (NLP)
   - Data Mining
   - Dimensionality Reduction
- **Objective**: Analyze textual content based on the subject for identifying unusual social behaviors.

### Key Studies and Approaches
- **Hao et al.**:
   - Defined four abnormal behaviors: aggression, injury, arrest, fatality.
   - Methods: Support Vector Machine (SVM) and trigger words for filtering anomalous sentences.
   - Developed a behavioral co-construction network for detecting anomalies in online public opinion data.
- **Mu et al.**:
   - Built an attention self-encoder with multi-head attention to handle missing data and capture text distribution.
   - Used this for enhanced anomaly detection.
- **Al et al.**:
   - Employed Latent Dirichlet Allocation (LDA) to extract features from user content.
   - Developed a platform for large-scale malicious activity detection.
- **Qasim et al.**:
   - Combined content, social graph connections, and profile activity to analyze anomalies across large social networks.
- **Drif et al.**:
   - Implemented entity similarity calculation to reduce false positives in anomaly detection.

### Challenges
- **Data Limitations**: Small dataset sizes limit feature extraction capabilities.
- **Language and Cultural Nuance**: Complex language, cultural, and linguistic differences make anomaly detection challenging.
- **Privacy vs. Detection**: Finding a balance between protecting user privacy and effectively detecting anomalies.

### Advanced Techniques
- **Word Embeddings & Neural Networks**: Deep learning methods improve feature extraction, helping to identify subtle anomalies within text-based contexts.


### Feature Selection Based on Interactive Behaviors
- **Focus**: Identify key features from user interactions, such as post frequency, likes, comments, and discussion topics, which correlate with unusual behaviors.
- **Methods**: 
   - Clustering techniques to group users based on interaction features.
   - Combined clustering and classification models to detect anomalies in behavior patterns.

#### Key Studies and Approaches
- **Aljably et al.**:
   - Defined behavioral features like post frequency, timing, likes, comments, and topic diversity as indicators of anomalies.
   - Used clustering to group users and trained models for anomaly detection using these grouped behaviors.
- **Persia et al.**:
   - Developed a framework using a modified Interactive Structured Query Language (ISQL) algorithm for advanced event detection.
   - Applied Local Differential Privacy (LDP) to generate protected synthetic data.
   - Used sequential pattern mining to detect frequent behavioral patterns and predict trends in anomalous activities.

### Advantages and Challenges
- **Advantages**: 
   - Detailed analysis of user behaviors allows for precise detection of minor and gradual changes, improving accuracy and reliability.
- **Challenges**: 
   - High data demands, sensitivity to noisy/incomplete data, reliance on predefined behavioral features, and significant computational needs.
   - Privacy concerns due to the extensive collection of user interaction data.

### Performance Evaluation Metrics
- **Primary Metrics**: 
   - Accuracy (ACC): Overall classification accuracy.
   - Recall: Ability to capture actual positives.
   - Precision: Accuracy of positive predictions.
   - F1-score: Balances Precision and Recall, especially useful for imbalanced datasets.
- **Additional Metrics**:
   - APs, FPs, Precision-Recall (PR) curves, ROC curves, AUC curves, etc., are used to further assess model effectiveness and usability.
